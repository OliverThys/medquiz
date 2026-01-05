# Guide de déploiement sur Cloudflare Pages

## Prérequis

1. **Compte Cloudflare** (gratuit) : https://dash.cloudflare.com/sign-up
2. **GitHub/GitLab/Bitbucket** : Votre code doit être dans un dépôt Git
3. **Base de données** : Migration de SQLite vers une base compatible (voir ci-dessous)

## ⚠️ Important : Migration de la base de données

SQLite ne fonctionne pas en production serverless. Vous devez migrer vers :

### Option 1 : Cloudflare D1 (Recommandé - Gratuit)
- Base de données SQLite gérée par Cloudflare
- Compatible avec votre schéma actuel
- Gratuit jusqu'à 5GB

### Option 2 : PostgreSQL (Turso, Neon, Supabase)
- Bases de données PostgreSQL serverless gratuites
- Nécessite de modifier le schéma Prisma

## Étapes de déploiement

### 1. Préparer votre dépôt Git

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <URL_DE_VOTRE_REPO>
git push -u origin main
```

### 2. Migrer vers Cloudflare D1 (Option recommandée)

#### a) Installer Wrangler CLI

```bash
npm install -g wrangler
wrangler login
```

#### b) Créer une base D1

```bash
wrangler d1 create medquiz-db
```

Cela vous donnera un `database_id` et un `database_name`.

#### c) Mettre à jour wrangler.toml

Le fichier `wrangler.toml` est déjà configuré. Ajoutez votre `database_id` dans le fichier.

#### d) Migrer le schéma

```bash
# Générer le client Prisma
npx prisma generate

# Créer les migrations
npx prisma migrate dev --name init

# Appliquer les migrations à D1
wrangler d1 execute medquiz-db --file=./prisma/migrations/20260104232627_init/migration.sql
wrangler d1 execute medquiz-db --file=./prisma/migrations/20260104233455_add_course_reference/migration.sql
wrangler d1 execute medquiz-db --file=./prisma/migrations/20260104233930_add_reference_to_question/migration.sql
```

#### e) Seed la base de données

```bash
# Modifier temporairement DATABASE_URL pour pointer vers D1
# Puis exécuter :
npm run seed:nephro
```

### 3. Configurer Cloudflare Pages

#### a) Via le Dashboard Cloudflare

1. Allez sur https://dash.cloudflare.com
2. Sélectionnez **Pages** dans le menu
3. Cliquez sur **Create a project**
4. Connectez votre dépôt Git (GitHub/GitLab/Bitbucket)
5. Configurez le build :
   - **Framework preset** : Next.js
   - **Build command** : `npm run build`
   - **Build output directory** : `.next`
   - **Node version** : 20.x (ou la version que vous utilisez)
   - **Install command** : `npm install` (par défaut)

#### b) Variables d'environnement

Dans les paramètres du projet Pages, allez dans **Settings** > **Environment variables** et ajoutez :

- `DATABASE_URL` : Pour D1, utilisez le format fourni par Cloudflare (ex: `file:./dev.db?__db_name=medquiz-db`)
- `NEXTAUTH_SECRET` : Générez avec `openssl rand -base64 32` (ou `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`)
- `NEXTAUTH_URL` : L'URL de votre site (ex: `https://votre-app.pages.dev`)

**Note** : Pour obtenir l'URL D1 correcte, exécutez :
```bash
wrangler d1 info medquiz-db
```

### 4. Déploiement automatique

Une fois configuré, chaque push sur votre branche principale déclenchera un déploiement automatique.

## Configuration du domaine personnalisé (Optionnel)

1. Dans Cloudflare Pages, allez dans **Custom domains**
2. Ajoutez votre domaine
3. Suivez les instructions DNS

## Commandes utiles

```bash
# Tester localement avec D1
wrangler pages dev

# Voir les logs
wrangler pages deployment tail

# Lister les déploiements
wrangler pages deployment list
```

## Dépannage

### Erreur de build
- Vérifiez que toutes les dépendances sont dans `package.json`
- Vérifiez les variables d'environnement
- Vérifiez les logs de build dans Cloudflare Pages

### Erreur de base de données
- Vérifiez que D1 est bien configuré dans `wrangler.toml`
- Vérifiez que les migrations ont été appliquées
- Vérifiez que `DATABASE_URL` est correctement configuré

### Erreur Prisma
- Le script `postinstall` génère automatiquement le client Prisma
- Si nécessaire, ajoutez `prisma generate` dans votre script de build (déjà fait)

### Erreur "Module not found"
- Vérifiez que `node_modules` est bien dans `.gitignore`
- Cloudflare Pages installera automatiquement les dépendances

## Alternative : Utiliser PostgreSQL (Turso/Neon/Supabase)

Si vous préférez PostgreSQL au lieu de D1 :

1. Créez un compte sur [Turso](https://turso.tech), [Neon](https://neon.tech) ou [Supabase](https://supabase.com)
2. Créez une base de données
3. Modifiez `prisma/schema.prisma` :
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Exécutez les migrations :
   ```bash
   npx prisma migrate deploy
   ```
5. Configurez `DATABASE_URL` dans Cloudflare Pages avec l'URL PostgreSQL

