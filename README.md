# 🍽️ Karyy's Food — PWA de Commande & Restauration

> **Pâtisserie | Restauration Africaine & Occidentale**  
> Application web progressive (PWA) moderne pour la gestion des commandes, la messagerie temps réel et la coordination de livraison.

---

## 🎯 Vision du Projet

**Karyy's Food** est une PWA complète permettant :
- Aux **clients** de parcourir un menu dynamique et passer des commandes facilement
- Au **restaurant** (admin) de gérer le menu, les commandes, les livreurs et les communications
- Aux **livreurs** d'accéder à un portail dédié pour gérer leurs courses en temps réel
- À une **IA multi-modèles** d'assister clients, admin et livreurs à chaque étape

---

## ✨ Fonctionnalités Principales

### 👤 Portail Client
- [ ] Catalogue menu dynamique avec catégories et photos
- [ ] Système de panier et commande en ligne
- [ ] Suivi de commande en temps réel (statuts)
- [ ] Chat avec le restaurant à propos des commandes
- [ ] Notifications push PWA (commande acceptée, en route, livrée)
- [ ] Assistant IA pour aider au choix et répondre aux questions
- [ ] Historique des commandes
- [ ] Mock paiement (préparation T-Money/Flooz)

### 🛠️ Dashboard Administrateur (Karyy's)
- [ ] Gestion complète du menu (CRUD catégories, plats, prix, photos)
- [ ] Tableau de bord des commandes en temps réel
- [ ] Chat avec les clients sur chaque commande
- [ ] Gestion et assignation des livreurs
- [ ] Analytics des ventes (IA assistée)
- [ ] Notifications push et alertes internes
- [ ] Gestion des utilisateurs et rôles

### 🛵 Portail Livreur
- [ ] Accès sécurisé exclusif (rôle livreur)
- [ ] Liste des livraisons assignées
- [ ] Mise à jour du statut en temps réel (en route, livré)
- [ ] Chat avec le restaurant et le client
- [ ] Assistant IA pour support livraison/itinéraire

### 🤖 Système IA (Rotation Multi-Modèles)
- [ ] Groq (Llama 3.3, Mixtral, Gemma) — modèle principal
- [ ] Rotation automatique en cas de rate limit
- [ ] Assistant client (suggestions de plats, FAQ commandes)
- [ ] Assistant admin (analyse ventes, rapports)
- [ ] Chatbot support livraison

---

## 🛠️ Stack Technique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| **Frontend** | Next.js 15 (App Router) | SSR/SSG, PWA natif, déploiement Vercel |
| **Styling** | Tailwind CSS + CSS Variables | Thème sombre personnalisé |
| **Temps réel** | Supabase Realtime (Docker local) | Migration cloud sans changer le code |
| **Base de données** | PostgreSQL via Supabase local | Migration Neon/Supabase cloud directe |
| **Auth** | Supabase Auth (JWT) | Gratuit, sécurisé, multi-rôles |
| **API** | Next.js API Routes | Fullstack unifié |
| **IA** | Groq API (rotation modèles) | Disponibilité illimitée, gratuit |
| **PWA** | next-pwa | Service Worker, offline, push notifs |
| **Uploads** | Supabase Storage (local) | Photos menu, avatars |

---

## 🎨 Design System

### Palette de Couleurs
```css
/* Couleurs primaires — inspirées du logo */
--color-brand-brown:       #5C3A1E;  /* Brun chocolat du logo */
--color-brand-brown-light: #8B5E3C;  /* Brun clair */
--color-brand-rose:        #C47FA0;  /* Rose fané principal */
--color-brand-rose-light:  #E8B4CC;  /* Rose fané clair */

/* Dark theme */
--color-bg-primary:   #0D0A08;  /* Fond principal très sombre */
--color-bg-secondary: #1A1410;  /* Fond secondaire */
--color-bg-card:      #241C16;  /* Cartes */
--color-text-primary: #F5EDE8;  /* Texte principal (crème) */
--color-text-muted:   #9B8B7D;  /* Texte secondaire */
```

### Typographie
- **Titres** : `Playfair Display` (élégance, restauration)
- **Corps** : `Inter` (lisibilité moderne)

---

## 🏗️ Architecture des Rôles

```
┌─────────────────────────────────────────────────────┐
│                   KARYY'S FOOD PWA                  │
├──────────────┬──────────────────┬───────────────────┤
│   CLIENTS    │  ADMINISTRATEUR  │     LIVREURS       │
│  /menu       │   /admin/*       │   /delivery/*      │
│  /order      │                  │                   │
│  /track      │  Gestion totale  │  Portail dédié    │
│  /chat       │  Dashboard       │  Statuts live     │
│  /profile    │  Analytics IA    │  Chat intégré     │
└──────────────┴──────────────────┴───────────────────┘
          │             │                  │
          └─────────────┴──────────────────┘
                        │
              Supabase Realtime + PostgreSQL
                        │
                   Groq IA (rotation)
```

---

## 🚀 Démarrage Rapide (Local)

### Prérequis
- Node.js 20+
- Docker Desktop (pour Supabase local)
- Groq API Key (gratuit sur console.groq.com)

### Installation

```bash
# 1. Cloner le projet
git clone <repo>
cd "Karyy's Food"

# 2. Démarrer Supabase local
npx supabase start

# 3. Installer les dépendances
cd frontend && npm install

# 4. Variables d'environnement
cp .env.example .env.local
# Remplir les clés Supabase et Groq

# 5. Lancer le projet
npm run dev
```

### Variables d'Environnement
```env
# Supabase Local
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<local-service-key>

# Groq IA
GROQ_API_KEY=<votre-clé>

# App
NEXT_PUBLIC_APP_NAME="Karyy's Food"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📁 Structure du Projet

```
Karyy's Food/
├── frontend/                    # Application Next.js 15
│   ├── app/
│   │   ├── (client)/           # Routes clients
│   │   ├── admin/              # Dashboard administrateur
│   │   ├── delivery/           # Portail livreur
│   │   └── api/                # API Routes
│   ├── components/
│   │   ├── ui/                 # Composants UI réutilisables
│   │   ├── menu/               # Composants menu/catalogue
│   │   ├── orders/             # Composants commandes
│   │   ├── chat/               # Système de chat
│   │   └── admin/              # Composants dashboard
│   ├── lib/
│   │   ├── supabase/           # Client Supabase + hooks
│   │   ├── ai/                 # Système IA rotation
│   │   └── utils/              # Utilitaires
│   └── public/
│       └── icons/              # Icônes PWA
├── supabase/
│   ├── migrations/             # Migrations SQL
│   └── seed.sql                # Données initiales
├── docs/
│   ├── ARCHITECTURE.md
│   ├── TODO.md
│   └── PROGRESS.md
├── Karyy's Logo.jpg
└── README.md
```

---

## 🌐 Déploiement (Futur)

| Service | Environnement | Description |
|---------|--------------|-------------|
| **Vercel** | Production | Frontend Next.js |
| **Neon / Supabase Cloud** | Production | PostgreSQL + Realtime |
| **Groq** | Production | IA (déjà cloud) |

---

## 👥 Équipe

| Rôle | Nom |
|------|-----|
| Propriétaire & Client | Karyy's Food |
| Développeur Full-Stack | Kelvyn KARABOKA (Kelvix Agency) |

---

## 📄 Licence

Propriétaire — © 2026 Karyy's Food. Tous droits réservés.  
Développé par **Kelvix Agency** 🚀
