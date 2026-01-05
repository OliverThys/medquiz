# Guide étape par étape - Déploiement Cloudflare Pages

## 📋 ÉTAPE 1 : Préparer votre code sur GitHub/GitLab

### 1.1 Initialiser Git (dans votre terminal)

```bash
cd C:\Users\olive\Desktop\QCManon
git init
git add .
git commit -m "Initial commit - MedQuiz app"
```

### 1.2 Créer un dépôt sur GitHub

1. Allez sur https://github.com/new
2. Nommez votre dépôt (ex: `medquiz` ou `qc-manon`)
3. **Ne cochez PAS** "Initialize with README"
4. Cliquez sur **Create repository**

### 1.3 Connecter et pousser votre code

GitHub vous donnera des commandes. Utilisez celles-ci (remplacez VOTRE_USERNAME et VOTRE_REPO) :

```bash
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git branch -M main
git push -u origin main
```

**OU** si vous préférez GitLab :
- Allez sur https://gitlab.com/projects/new
- Créez un nouveau projet
- Suivez les instructions pour pousser votre code

---

## 📋 ÉTAPE 2 : Créer la base de données D1 dans Cloudflare

### 2.1 Dans l'interface Cloudflare

1. Dans le menu de gauche, cliquez sur **Workers & Pages**
2. Cliquez sur **D1** dans le sous-menu
3. Cliquez sur **Create database**
4. Nommez-la : `medquiz-db`
5. Sélectionnez une région (choisissez la plus proche de vous)
6. Cliquez sur **Create**

### 2.2 Noter l'ID de la base de données

Après création, vous verrez votre base de données. **Copiez l'ID** (c'est une longue chaîne de caractères).

### 2.3 Mettre à jour wrangler.toml

Ouvrez `wrangler.toml` et remplacez `VOTRE_DATABASE_ID_ICI` par l'ID que vous venez de copier.

---

## 📋 ÉTAPE 3 : Migrer votre schéma vers D1

### 3.1 Installer Wrangler CLI (dans votre terminal)

```bash
npm install -g wrangler
```

### 3.2 Se connecter à Cloudflare

```bash
wrangler login
```

Cela ouvrira votre navigateur pour vous connecter.

### 3.3 Appliquer les migrations

```bash
# Aller dans le dossier prisma
cd prisma

# Appliquer chaque migration (remplacez les noms de fichiers par les vôtres)
wrangler d1 execute medquiz-db --file=./migrations/20260104232627_init/migration.sql
wrangler d1 execute medquiz-db --file=./migrations/20260104233455_add_course_reference/migration.sql
wrangler d1 execute medquiz-db --file=./migrations/20260104233930_add_reference_to_question/migration.sql

# Revenir au dossier racine
cd ..
```

### 3.4 Obtenir l'URL de connexion D1

```bash
wrangler d1 info medquiz-db
```

**Copiez l'URL** qui ressemble à quelque chose comme : `file:./dev.db?__db_name=medquiz-db-xxxxx`

---

## 📋 ÉTAPE 4 : Créer le projet Pages dans Cloudflare

### 4.1 Dans l'interface Cloudflare

1. Dans le menu de gauche, cliquez sur **Workers & Pages**
2. Cliquez sur **Create application**
3. Cliquez sur l'onglet **Pages**
4. Cliquez sur **Connect to Git**

### 4.2 Connecter votre dépôt Git

1. Autorisez Cloudflare à accéder à votre compte GitHub/GitLab
2. Sélectionnez votre dépôt (medquiz ou le nom que vous avez choisi)
3. Cliquez sur **Begin setup**

### 4.3 Configurer le build

Remplissez les champs suivants :

- **Project name** : `medquiz` (ou le nom que vous voulez)
- **Production branch** : `main` (ou `master` selon votre dépôt)
- **Framework preset** : Sélectionnez **Next.js**
- **Build command** : `npm run build`
- **Build output directory** : `.next`
- **Root directory** : `/` (laissez vide ou mettez `/`)

### 4.4 Cliquer sur **Save and Deploy**

⚠️ **Ne vous inquiétez pas si le premier déploiement échoue**, c'est normal car les variables d'environnement ne sont pas encore configurées.

---

## 📋 ÉTAPE 5 : Configurer les variables d'environnement

### 5.1 Dans Cloudflare Pages

1. Allez dans votre projet Pages (cliquez dessus)
2. Cliquez sur l'onglet **Settings**
3. Dans le menu de gauche, cliquez sur **Environment variables**

### 5.2 Ajouter les variables

Cliquez sur **Add variable** pour chaque variable suivante :

#### Variable 1 : DATABASE_URL
- **Variable name** : `DATABASE_URL`
- **Value** : Collez l'URL D1 que vous avez copiée à l'étape 3.4
- **Environment** : Cochez **Production** et **Preview**
- Cliquez sur **Save**

#### Variable 2 : NEXTAUTH_SECRET
- **Variable name** : `NEXTAUTH_SECRET`
- **Value** : Générez un secret (voir ci-dessous)
- **Environment** : Cochez **Production** et **Preview**
- Cliquez sur **Save**

**Pour générer NEXTAUTH_SECRET**, dans votre terminal :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Copiez le résultat et collez-le comme valeur.

#### Variable 3 : NEXTAUTH_URL
- **Variable name** : `NEXTAUTH_URL`
- **Value** : `https://votre-projet.pages.dev` (remplacez `votre-projet` par le nom de votre projet Pages)
- **Environment** : Cochez **Production** et **Preview**
- Cliquez sur **Save**

**Pour trouver votre URL** : Dans l'onglet **Deployments** de votre projet Pages, vous verrez l'URL en haut de la page.

---

## 📋 ÉTAPE 6 : Redéployer

### 6.1 Déclencher un nouveau déploiement

1. Allez dans l'onglet **Deployments**
2. Cliquez sur les **3 points** (⋯) à côté du dernier déploiement
3. Cliquez sur **Retry deployment**

**OU** faites un nouveau commit et poussez-le :

```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

### 6.2 Vérifier le déploiement

1. Attendez que le build se termine (vous verrez un indicateur de progression)
2. Si c'est vert ✅, cliquez sur **Visit site**
3. Votre application devrait être accessible !

---

## 📋 ÉTAPE 7 : Seed la base de données (optionnel)

Si vous voulez ajouter des données initiales :

### 7.1 Modifier temporairement DATABASE_URL localement

Créez un fichier `.env.local` avec :
```
DATABASE_URL="file:./dev.db?__db_name=medquiz-db-xxxxx"
```
(Utilisez l'URL D1 que vous avez copiée)

### 7.2 Exécuter le seed

```bash
npm run seed:nephro
```

---

## ✅ Vérification finale

Votre application devrait maintenant être accessible à l'adresse :
`https://votre-projet.pages.dev`

Elle fonctionnera même si votre PC est éteint !

---

## 🆘 En cas de problème

### Le build échoue
- Vérifiez les logs dans l'onglet **Deployments** > cliquez sur le déploiement > **View build log**
- Vérifiez que toutes les variables d'environnement sont bien configurées

### Erreur de base de données
- Vérifiez que les migrations ont bien été appliquées (étape 3.3)
- Vérifiez que DATABASE_URL est correct dans les variables d'environnement

### Erreur Prisma
- Le script `postinstall` devrait générer automatiquement le client Prisma
- Si ça ne fonctionne pas, vérifiez les logs de build

