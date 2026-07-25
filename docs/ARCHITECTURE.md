# 🏗️ ARCHITECTURE — Karyy's Food PWA

> Document d'architecture technique complet du projet Karyy's Food
> Version : 1.1 — 2026-07-20

---

## 1. Vue d'Ensemble

```
┌──────────────────────────────────────────────────────────────────┐
│               CLIENTS (PWA — Installable sur mobile)             │
│        iOS (Safari) + Android (Chrome) + Desktop                 │
└──────────────────────┬───────────────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼───────────────────────────────────────────┐
│                    NEXT.JS 15 (App Router)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │  (client)/  │  │   /admin/*   │  │    /delivery/*       │    │
│  │  Portail    │  │  Dashboard   │  │   Portail Livreur    │    │
│  │  Client     │  │  Admin       │  │                      │    │
│  └─────────────┘  └──────────────┘  └──────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │                    /api/* (API Routes)                  │     │
│  └─────────────────────────────────────────────────────────┘     │
└──────────────────────┬───────────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────┐           ┌────────▼────────┐
│  SUPABASE      │           │   GROQ AI API   │
│  (Local Docker)│           │  (Cloud)        │
│                │           │                 │
│ • PostgreSQL   │           │ • Llama 3.3 70b │
│ • Auth JWT     │           │ • Mixtral 8x7b  │
│ • Realtime     │           │ • Gemma2 9b     │
│ • Storage      │           │ • Auto-rotation │
└────────────────┘           └─────────────────┘
```

---

## 2. PWA — Capacité d'Installation

```
MANIFEST.JSON
├── name: "Karyy's Food"
├── short_name: "Karyy's"
├── theme_color: "#5C3A1E"       ← Brun chocolat logo
├── background_color: "#0D0A08"  ← Fond sombre
├── display: "standalone"        ← Plein écran, sans barre URL
└── icons: [72, 96, 128, 144, 152, 192, 384, 512]px

INSTALLATION PAR PLATEFORME :
• Android (Chrome) → Bandeau "Installer l'application" auto
• iOS (Safari)     → "Partager" → "Ajouter à l'écran d'accueil"
• Desktop          → Icône d'installation dans la barre Chrome

SERVICE WORKER (next-pwa) :
├── Cache stratégies :
│   ├── StaleWhileRevalidate → pages HTML
│   ├── CacheFirst          → images, fonts, CSS
│   └── NetworkFirst        → API calls (données fraîches)
├── Offline fallback         → page /offline.tsx
└── Push notifications       → Web Push API
```

---

## 3. Architecture des Routes Next.js

```
app/
├── (client)/
│   ├── page.tsx                # Accueil / hero + menu vedette
│   ├── menu/page.tsx           # Catalogue complet
│   ├── order/
│   │   ├── confirm/page.tsx    # Récapitulatif commande
│   │   ├── payment/page.tsx    # Mock paiement
│   │   └── [id]/page.tsx       # Suivi temps réel
│   ├── chat/[orderId]/page.tsx # Chat client ↔ admin
│   └── profile/
│       ├── page.tsx
│       └── orders/page.tsx
│
├── admin/
│   ├── layout.tsx              # Sidebar navigation
│   ├── dashboard/page.tsx      # KPIs temps réel
│   ├── menu/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── deliverers/page.tsx     # Gestion 2 livreurs
│   ├── users/page.tsx
│   ├── analytics/page.tsx      # Stats IA
│   └── settings/page.tsx       # ⚙️ Paramètres (horaires, zones, etc.)
│
├── delivery/
│   ├── dashboard/page.tsx      # Livraisons assignées
│   └── [id]/page.tsx           # Détail + validation frais
│
├── auth/
│   ├── login/page.tsx
│   └── register/page.tsx
│
└── api/
    ├── ai/
    │   ├── suggest/route.ts
    │   ├── chat/route.ts
    │   └── analytics/route.ts
    ├── orders/route.ts
    ├── menu/route.ts
    └── settings/route.ts       # Lecture/écriture paramètres admin
```

---

## 4. Schéma Base de Données

```sql
-- Profils utilisateurs
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name   TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'client',
  -- 'client' | 'admin' | 'livreur'
  avatar_url  TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ⚙️ Paramètres configurables par l'admin
CREATE TABLE app_settings (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  label       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
-- Exemples de clés :
-- 'opening_hours'  → {"mon":{"open":"08:00","close":"22:00"}, ...}
-- 'is_open'        → true/false (override manuel)
-- 'delivery_zones' → [{"name":"Zone 1","fee":500}, ...]
-- 'restaurant_info'→ {"name":"Karyy's Food","phone":"..."}

-- Catégories du menu
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Plats du menu
CREATE TABLE menu_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id  UUID REFERENCES categories(id),
  name         TEXT NOT NULL,
  description  TEXT,
  price        DECIMAL(10,2) NOT NULL,
  image_url    TEXT,
  is_available BOOLEAN DEFAULT true,
  tags         TEXT[],
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Commandes
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id        UUID REFERENCES profiles(id),
  livreur_id       UUID REFERENCES profiles(id),
  status           TEXT NOT NULL DEFAULT 'pending',
  -- 'pending'           → En attente validation admin
  -- 'accepted'          → Acceptée par admin
  -- 'preparing'         → En préparation
  -- 'ready'             → Prête, en attente livreur
  -- 'pending_delivery'  → En attente validation frais livraison
  -- 'delivering'        → En cours de livraison
  -- 'delivered'         → Livrée
  -- 'cancelled'         → Annulée
  items_total      DECIMAL(10,2) NOT NULL,
  delivery_fee     DECIMAL(10,2) DEFAULT 0,
  total_amount     DECIMAL(10,2) NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_notes   TEXT,
  payment_method   TEXT DEFAULT 'mock',
  payment_status   TEXT DEFAULT 'pending',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Articles commandés
CREATE TABLE order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  item_name    TEXT NOT NULL,   -- snapshot nom au moment commande
  quantity     INT NOT NULL,
  unit_price   DECIMAL(10,2) NOT NULL,
  subtotal     DECIMAL(10,2) NOT NULL
);

-- Propositions de frais de livraison (par le livreur)
CREATE TABLE delivery_fee_proposals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  livreur_id  UUID REFERENCES profiles(id),
  proposed_fee DECIMAL(10,2) NOT NULL,
  status      TEXT DEFAULT 'pending',  -- 'pending' | 'accepted' | 'refused'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Messages du chat
CREATE TABLE messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID REFERENCES orders(id) ON DELETE CASCADE,
  sender_id  UUID REFERENCES profiles(id),
  content    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES profiles(id),
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  type       TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT false,
  data       JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Flux de Commande Complet

```
CLIENT                    ADMIN                     LIVREUR
  │                          │                          │
  │─── Passe commande ───────▶│                          │
  │                          │                          │
  │                    Notif temps réel                 │
  │                    Accepte/Refuse                   │
  │                          │                          │
  │◀── Commande acceptée ────│                          │
  │    (notif push PWA)      │                          │
  │                          │                          │
  │                    En préparation                   │
  │◀── "En préparation" ─────│                          │
  │                          │                          │
  │                    Prêt → Assigne livreur           │
  │                          │────── Mission ──────────▶│
  │                          │                          │
  │                          │               Livreur voit adresse
  │                          │               Propose frais livraison
  │                          │◀──────── Frais proposés ─│
  │◀── Notif frais livraison─│                          │
  │    (ex: 500 FCFA)        │                          │
  │                          │                          │
  │─── Accepte les frais ───▶│                          │
  │                          │──── Confirme livreur ───▶│
  │                          │                          │
  │                          │               "En route"
  │◀── "Livreur en route" ───│◀────────────────────────│
  │                          │                          │
  │                          │               "Livré"
  │◀── "Commande livrée" ────│◀────────────────────────│
  │                          │                          │
```

---

## 6. Paramètres Admin (app_settings)

```
GÉRÉS DEPUIS /admin/settings :

┌─────────────────────────────────────────────────────┐
│  ⏰ HORAIRES D'OUVERTURE                            │
│  • Horaires par jour (Lun-Dim)                      │
│  • Toggle "Ouvert maintenant" (override manuel)     │
│  • Message affiché quand fermé                      │
├─────────────────────────────────────────────────────┤
│  🛵 ZONES DE LIVRAISON                              │
│  • CRUD zones (nom + frais indicatifs)              │
│  • Note : frais finaux validés par le livreur       │
├─────────────────────────────────────────────────────┤
│  🏪 INFOS RESTAURANT                                │
│  • Nom, téléphone, adresse, description             │
│  • Réseaux sociaux                                  │
├─────────────────────────────────────────────────────┤
│  🔔 NOTIFICATIONS                                   │
│  • Messages par défaut (push notifs)                │
└─────────────────────────────────────────────────────┘
```

---

## 7. Système d'Authentification & Rôles

```
RÔLES (3) :
• client  → Accès (client)/*, /api/orders (own), /api/menu
• admin   → Accès tout + /admin/*, /api/settings
• livreur → Accès /delivery/*, ordres assignés uniquement

POLITIQUES RLS :
profiles              : SELECT/UPDATE own | SELECT all (admin)
app_settings          : SELECT all | UPDATE admin only
categories            : SELECT all | CRUD admin
menu_items            : SELECT all | CRUD admin
orders                : SELECT own (client) | SELECT all (admin/livreur)
                        INSERT client | UPDATE admin/livreur
delivery_fee_proposals: INSERT livreur | SELECT/UPDATE client+admin
messages              : SELECT/INSERT participants de la commande
notifications         : SELECT/UPDATE own

COMPTES DE DÉMARRAGE (seed) :
• admin@karyys.food       → rôle admin
• livreur1@karyys.food    → rôle livreur
• livreur2@karyys.food    → rôle livreur
• client_demo@karyys.food → rôle client
```

---

## 8. Système IA — Rotation Multi-Modèles

```typescript
// lib/ai/rotation.ts

const MODELS = [
  { id: 'llama-3.3-70b-versatile',  priority: 1 },
  { id: 'mixtral-8x7b-32768',       priority: 2 },
  { id: 'gemma2-9b-it',             priority: 3 },
  { id: 'llama-3.1-8b-instant',     priority: 4 },  // Fallback rapide
];

AGENTS IA (français uniquement) :
• /api/ai/suggest  → Suggestions plats selon panier/historique
• /api/ai/chat     → Assistant conversationnel client (FR)
• /api/ai/analytics → Résumé ventes + recommandations admin (FR)
• /api/ai/support  → Aide livreur (adresse, support)
```

---

## 9. Design System & Thème

```css
/* === COULEURS === */
--brand-600: #5C3A1E;   /* Brun chocolat logo — PRINCIPAL */
--brand-500: #8B5E3C;   /* Brun clair */
--rose-500:  #C47FA0;   /* Rose fané — ACCENT */
--rose-400:  #D4889C;   /* Rose hover */

/* Dark theme */
--bg-primary:   #0D0A08;   /* Noir quasi pur */
--bg-secondary: #1A1410;
--bg-card:      #241C16;
--bg-elevated:  #2E2218;
--text-primary: #F5EDE8;   /* Crème chaud */
--text-muted:   #9B8B7D;
--border:       rgba(92,58,30,0.3);

/* === TYPOGRAPHIE === */
--font-serif: 'Playfair Display', serif;  /* Titres */
--font-sans:  'Inter', system-ui;          /* Corps */

/* Langue : Français uniquement (fr-FR) */
```

---

## 10. Données de Démo (seed.sql)

```
CATÉGORIES DÉMO :
• 🍰 Pâtisseries
• 🍽️ Plats Africains
• 🥗 Plats Occidentaux
• 🥤 Boissons

PLATS DÉMO (4-5 par catégorie)

COMPTES DÉMO :
• admin@karyys.food     / Admin2026!
• livreur1@karyys.food  / Livreur2026!
• livreur2@karyys.food  / Livreur2026!
• client@karyys.food    / Client2026!

COMMANDES DÉMO :
• 2-3 commandes dans différents statuts
• Messages de chat exemples
```

---

## 11. Plan de Migration vers Production

```
LOCAL                          PRODUCTION
─────────────────             ──────────────────────
Supabase Docker          →    Supabase Cloud / Neon
localhost:54321          →    <projet>.supabase.co
npm run dev              →    Vercel (auto-deploy)

ÉTAPES :
1. Créer projet Supabase Cloud
2. supabase db dump → import cloud
3. Variables d'env Vercel
4. GitHub → Vercel (auto-deploy)
5. DNS custom domain
6. Intégration T-Money/Flooz (réelle)
```
