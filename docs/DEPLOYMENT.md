# 🚀 Guide de Déploiement en Production — Karyy's Food

Ce guide récapitule la procédure complète pour déployer **Karyy's Food** en production.

---

## 📋 1. Prérequis Production

1. **Compte Vercel** (Déploiement Frontend Next.js 15).
2. **Projet Supabase Cloud / Neon** (PostgreSQL, Auth, Realtime, Storage).
3. **Clé API Groq** (console.groq.com).

---

## 🗄️ 2. Migration Base de Données & Supabase Cloud

1. Créer un projet sur [supabase.com](https://supabase.com).
2. Lier le projet local avec la CLI Supabase :
   ```bash
   npx supabase link --project-ref <votre-project-id>
   ```
3. Pousser toutes les migrations SQL :
   ```bash
   npx supabase db push
   ```
4. Exécuter le fichier de seed (`supabase/seed.sql`) ou charger les catégories/menu initiaux.

---

## 🌐 3. Déploiement Frontend sur Vercel

1. Connecter le dépôt GitHub à Vercel.
2. Configurer les variables d'environnement suivantes dans le dashboard Vercel :

```env
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://<votre-projet>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<votre-anon-key-production>
SUPABASE_SERVICE_ROLE_KEY=<votre-service-role-key-production>

# Groq IA
GROQ_API_KEY=<votre-cle-groq>

# App Config
NEXT_PUBLIC_APP_NAME="Karyy's Food"
NEXT_PUBLIC_APP_URL=https://karyys-food.vercel.app
```

3. Lancer le déploiement (`git push origin main` ou `vercel --prod`).

---

## 📱 4. Mobile Money Togo (T-Money & Flooz)

Le système intègre le helper de validation [payment-togo.ts](file:///e:/PROJETS/Karyy's%20Food/frontend/lib/utils/payment-togo.ts) :
- **T-Money** : Numéros commençant par `90`, `91`, `92`, `93`, `70`.
- **Flooz** : Numéros commençant par `96`, `97`, `98`, `99`.
- **Paiement à la livraison** : Option par défaut activée.

---

## ✅ 5. Checklist de Validation Finale

- [x] Compilation Next.js 15 Zéro Erreur (`npm run build`).
- [x] Application PWA installable sur smartphone.
- [x] Chatbot IA (Groq rotation) fonctionnel.
- [x] Dashboard Admin, Portail Client et Portail Livreur sécurisés par RLS et Middleware.
