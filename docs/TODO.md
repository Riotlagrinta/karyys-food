# ✅ TODO — Karyy's Food PWA
> Dernière mise à jour : 2026-07-20

---

## 🚀 PHASE 0 — Setup & Infrastructure (Semaine 1)

### Initialisation du Projet
- `[x]` Initialiser Next.js 15 avec App Router + TypeScript
- `[x]` Configurer Tailwind CSS avec design tokens custom (thème sombre)
- `[x]` Configurer ESLint + Prettier
- `[x]` Initialiser Git + .gitignore
- `[x]` Créer le fichier `.env.example`
- `[x]` Configurer Supabase CLI localement
- `[x]` Démarrer l'instance Supabase Docker (local)
- `[x]` Tester la connexion Supabase locale

### Design System
- `[x]` Définir les CSS variables (couleurs, typographie, espacements)
- `[x]` Configurer Google Fonts (Playfair Display + Inter)
- `[x]` Créer les composants UI de base (Button, Input, Card, Badge, Modal)
- `[x]` Créer le composant Logo/Navbar
- `[x]` Créer le composant de loading/skeleton
- `[x]` Tester le rendu du thème sombre

---

## 🗄️ PHASE 1 — Base de Données & Auth (Semaine 1-2)

### Schéma Base de Données
- [ ] Migration : table `profiles` (users + rôles : client, admin, livreur)
- [ ] Migration : table `categories` (catégories du menu)
## Phase 1 : Base de Données & Authentification (COMPLÉTÉE)
- [x] Initialiser le projet Supabase local (`supabase init`).
- [x] Créer le schéma de base de données : `profiles`, `categories`, `menu_items`, `orders`, `order_items`, `deliveries`, `notifications`.
- [x] Définir les politiques RLS (Row Level Security) pour chaque table.
- [x] Configurer l'authentification avec rôles (`client`, `admin`, `deliverer`) via des triggers.
- [x] Créer le client Supabase SSR (`@supabase/ssr`) et le middleware Next.js.
- [x] Pages : `/login`, `/register`, `/reset-password`.

---

## 🍽️ PHASE 2 — Portail Client (Semaine 2-3)

## 🍽️ PHASE 2 — Portail Client (Semaine 2-3)

### Menu & Catalogue (COMPLÉTÉ)
- [x] Page d'accueil `/` (hero + catégories en vedette)
- [x] Page menu `/menu` (liste des plats par catégorie)
- [x] Composant `MenuCard` (photo, nom, prix, bouton ajout)
- [x] Filtrage par catégorie
- [x] Recherche de plats

### Panier & Commande
- [x] Composant panier (sidebar ou drawer) -> On utilise la page /cart et une modale MenuModal
- [x] État global panier (Zustand)
- [x] Page récapitulatif `/cart`
- [x] Page d'adresse de livraison `/order/confirm`
- [x] Page mock paiement `/order/payment`
- [x] Confirmation de commande + numéro de suivi

### Suivi & Profil
- [x] Page suivi `/order/[id]` (statuts temps réel)
- [x] Page profil `/profile` avec historique des commandes

---

## 🛠️ PHASE 3 — Dashboard Admin (Semaine 3-4)

### Layout Admin
- [x] Layout `/admin` avec sidebar navigation
- [x] Protection middleware (rôle admin uniquement)
- [x] Page d'accueil admin `/admin/dashboard` (KPIs temps réel)

### Gestion Menu
- [x] Page `/admin/menu` — liste tous les plats
- [x] Formulaire création/modification plat (avec upload photo)
- [x] Gestion des catégories (CRUD)
- [x] Toggle disponibilité d'un plat (en temps réel)

### Gestion Commandes
- [x] Page `/admin/orders` — toutes les commandes (temps réel)
- [x] Détail d'une commande + changement de statut
- [x] Assignation d'un livreur à une commande
- [x] Filtres (en attente / en préparation / en route / livré)

### Gestion Livreurs & Utilisateurs
- [x] Page `/admin/users` — liste clients
- [x] Page `/admin/deliverers` — gestion livreurs
- [x] Création de compte livreur (admin uniquement)

### Analytics IA
- [x] Page `/admin/analytics` — tableau de bord stats
- [x] Résumé des ventes du jour (IA)
- [x] Plats les plus commandés
- [x] Rapport généré par IA (Groq)

---

## 🛵 PHASE 4 — Portail Livreur (Semaine 4)

- [x] Layout `/delivery` avec navigation simplifiée
- [x] Protection middleware (rôle livreur uniquement)
- [x] Page `/delivery/dashboard` — livraisons assignées
- [x] Détail d'une livraison + infos client
- [x] Boutons de mise à jour statut (En route / Livré)
- [x] Chat intégré (livreur ↔ admin / client)
- [x] Historique des livraisons effectuées

---

## 💬 PHASE 5 — Chat & Notifications Temps Réel (Semaine 4-5)

### Système de Chat
- [x] Composant `ChatWindow` (messages + input)
- [x] Channel Supabase Realtime par commande
- [x] Indicateur "en train d'écrire..."
- [x] Notifications de nouveaux messages
- [x] Chat client ↔ admin sur commande active
- [x] Chat livreur ↔ admin / client

### Notifications Push PWA
- [x] Configurer `manifest.json` et Service Worker (`sw.js`)
- [x] Demande permission notifications au premier accès (`useNotifications`)
- [x] Notif : commande acceptée
- [x] Notif : commande en préparation
- [x] Notif : livreur en route
- [x] Notif : commande livrée
- [x] Notif : nouveau message chat (Toast & Sound Chime)

---

## 🤖 PHASE 6 — Système IA (Semaine 5)

### Architecture Rotation
- [x] Créer `lib/ai/groq-client.ts` (client Groq)
- [x] Créer `lib/ai/rotation.ts` (logique de rotation modèles)
- [x] Liste des modèles actifs : llama-3.3-70b-versatile, llama-3.1-8b-instant, qwen/qwen3.6-27b, allam-2-7b
- [x] Gestion des erreurs de rate limit → switch automatique

### Agents IA
- [x] Agent client : suggestions de plats selon le menu (`/api/ai/suggest`)
- [x] Agent client : FAQ et conseiller culinaire interactif (`/api/ai/chat`)
- [x] Agent admin : résumé des ventes et rapport de performance (`/admin/analytics`)
- [x] Agent livreur : assistance itinéraire et support

### API Routes IA
- [x] `POST /api/ai/suggest` — suggestions menu
- [x] `POST /api/ai/chat` — chatbot client
- [x] `generateAIAssessment` — rapport admin (Groq)

---

## 🎨 PHASE 7 — PWA & Finitions (Semaine 5-6)

- [x] Configurer `manifest.json` PWA (couleurs, thèmes, icônes)
- [x] Stratégie offline & Service Worker (`sw.js`)
- [x] Bannière intelligente d'installation mobile (`PWAInstallPrompt.tsx`)
- [x] Page d'installation PWA dédiée (`/install`)
- [x] Support multi-plateformes (Android Chrome & iOS Safari instructions)
- [x] Audit de performance et compilation TypeScript Zéro Erreur

---

## 🌐 PHASE 8 — Préparation Production (COMPLÉTÉE)

- [x] Guide de migration base de données Supabase Cloud / Neon (`docs/DEPLOYMENT.md`)
- [x] Configuration variables d'environnement Vercel (`.env.example` + Vercel config)
- [x] Fichier de configuration Vercel (`frontend/vercel.json`)
- [x] Helper validation paiements Togo Mobile Money (T-Money & Flooz : `payment-togo.ts`)
- [x] Build final de validation TypeScript Zéro Erreur
- [x] Préparation des sauvegardes BDD et sécurité RLS
