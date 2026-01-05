# Prompt pour créer MedQuiz - Application de QCM Médical

## Contexte et Objectif

Crée une application web complète appelée **MedQuiz** - une plateforme de QCM interactifs pour réviser des cours de médecine. L'application doit permettre aux étudiants de passer des quiz organisés par catégories et aux administrateurs de créer et gérer des catégories et des QCM.

## Stack Technique

- **Framework**: Next.js 16.1.1 avec App Router (React 19.2.3)
- **Base de données**: SQLite avec Prisma ORM 7.2.0
- **Styling**: Tailwind CSS 4 avec variables CSS personnalisées
- **Langage**: TypeScript 5
- **Authentification**: next-auth 4.24.13 (préparé mais non implémenté dans l'UI)
- **Hachage**: bcryptjs 3.0.3

## Structure de la Base de Données (Prisma Schema)

Crée un schéma Prisma avec les modèles suivants :

### User
- `id` (String, @id, @default(cuid()))
- `email` (String, @unique)
- `name` (String)
- `password` (String)
- `role` (String, @default("student")) // "student" ou "admin"
- `createdAt` (DateTime, @default(now()))
- `updatedAt` (DateTime, @updatedAt)
- Relations: `quizAttempts`, `progress`

### Category
- `id` (String, @id, @default(cuid()))
- `name` (String)
- `description` (String, optionnel)
- `color` (String, @default("#FF6B35")) // Couleur orange par défaut
- `icon` (String, optionnel)
- `createdAt` (DateTime, @default(now()))
- `updatedAt` (DateTime, @updatedAt)
- Relation: `quizzes`

### Quiz
- `id` (String, @id, @default(cuid()))
- `title` (String)
- `description` (String, optionnel)
- `categoryId` (String, relation vers Category)
- `difficulty` (String, @default("medium")) // "easy", "medium", "hard"
- `createdAt` (DateTime, @default(now()))
- `updatedAt` (DateTime, @updatedAt)
- Relations: `category`, `questions`, `quizAttempts`

### Question
- `id` (String, @id, @default(cuid()))
- `quizId` (String, relation vers Quiz)
- `questionText` (String)
- `explanation` (String, optionnel) // Explication de la bonne réponse
- `order` (Int)
- `createdAt` (DateTime, @default(now()))
- `updatedAt` (DateTime, @updatedAt)
- Relations: `quiz`, `answers`, `userAnswers`

### Answer
- `id` (String, @id, @default(cuid()))
- `questionId` (String, relation vers Question)
- `answerText` (String)
- `isCorrect` (Boolean, @default(false))
- `order` (Int)
- `createdAt` (DateTime, @default(now()))
- Relations: `question`, `userAnswers`

### QuizAttempt
- `id` (String, @id, @default(cuid()))
- `userId` (String, relation vers User)
- `quizId` (String, relation vers Quiz)
- `score` (Int) // Nombre de bonnes réponses
- `totalQuestions` (Int) // Nombre total de questions
- `completedAt` (DateTime, @default(now()))
- Relations: `user`, `quiz`, `userAnswers`

### UserAnswer
- `id` (String, @id, @default(cuid()))
- `attemptId` (String, relation vers QuizAttempt)
- `questionId` (String, relation vers Question)
- `answerId` (String, optionnel, relation vers Answer) // null si pas répondu
- `isCorrect` (Boolean)
- `createdAt` (DateTime, @default(now()))
- Relations: `attempt`, `question`, `answer`

### UserProgress
- `id` (String, @id, @default(cuid()))
- `userId` (String, relation vers User, @unique)
- `totalQuizzes` (Int, @default(0))
- `totalQuestions` (Int, @default(0))
- `correctAnswers` (Int, @default(0))
- `streak` (Int, @default(0)) // Nombre de jours consécutifs
- `lastActiveDate` (DateTime, @default(now()))
- `createdAt` (DateTime, @default(now()))
- `updatedAt` (DateTime, @updatedAt)
- Relation: `user`

**Toutes les relations doivent avoir `onDelete: Cascade` pour maintenir l'intégrité référentielle.**

## Design System et Thème

### Couleurs CSS (définies dans globals.css)

```css
:root {
  /* Orange médical - couleur principale */
  --primary-orange: #FF6B35;
  --primary-orange-light: #FF8C61;
  --primary-orange-dark: #E8551E;

  /* Accents médicaux */
  --accent-teal: #4ECDC4;
  --accent-mint: #95E1D3;
  --accent-sky: #5AB9EA;

  /* Neutres */
  --background: #FAFBFC;
  --surface: #FFFFFF;
  --surface-hover: #F5F7FA;
  --foreground: #2D3748;
  --foreground-light: #718096;

  /* Feedback */
  --success: #48BB78;
  --success-light: #C6F6D5;
  --error: #F56565;
  --error-light: #FED7D7;
  --warning: #ED8936;
  --warning-light: #FEEBC8;

  /* Ombres */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### Animations CSS

- `fadeIn`: Animation d'apparition en fondu avec translation verticale
- `slideIn`: Animation de glissement depuis la gauche
- `pulse`: Animation de pulsation

### Typographie

- Police principale: Geist Sans (via next/font)
- Police mono: Geist Mono (via next/font)

## Composants UI à Créer

### 1. Card (`components/ui/Card.tsx`)
Composant de carte avec variantes :
- `Card`: Conteneur principal avec ombre et arrondis
- `CardHeader`: En-tête de carte
- `CardTitle`: Titre de carte
- `CardContent`: Contenu de carte
- Props: `hover` (boolean) pour effet hover, `onClick` (optionnel)

### 2. Button (`components/ui/Button.tsx`)
Bouton avec variantes :
- Variantes: `primary`, `secondary`, `success`, `danger`, `outline`
- Tailles: `sm`, `md`, `lg`
- Styles avec transitions et états hover/focus/disabled

### 3. Input (`components/ui/Input.tsx`)
Champ de saisie avec label :
- `Input`: Champ texte standard
- `TextArea`: Zone de texte multiligne
- Support des labels et placeholders

### 4. Badge (`components/ui/Badge.tsx`)
Badge avec variantes :
- Variantes: `success`, `error`, `warning`
- Affichage de texte avec couleur de fond et texte adaptés

### 5. ProgressBar (`components/ui/ProgressBar.tsx`)
Barre de progression :
- Affiche un pourcentage (0-100)
- Style avec gradient orange
- Animation fluide

## Pages et Routes

### 1. Page d'accueil (`app/page.tsx`)
- **Type**: Server Component
- **Fonctionnalités**:
  - Header avec titre "MedQuiz" et bouton Admin
  - Statistiques: nombre total de QCM, catégories, progression
  - Liste des catégories avec leurs QCM
  - Chaque catégorie affiche:
    - Nom, description, icône, couleur
    - Liste des QCM avec nombre de questions et difficulté
    - Badge de difficulté (Facile/Moyen/Difficile)
  - Si aucune catégorie: message avec lien vers admin

### 2. Page Quiz (`app/quiz/[id]/page.tsx`)
- **Type**: Client Component
- **Fonctionnalités**:
  - Chargement du quiz depuis l'API
  - Affichage question par question avec barre de progression
  - Sélection d'une réponse (boutons cliquables)
  - Bouton "Valider" pour vérifier la réponse
  - Affichage de l'explication après validation
  - Indication visuelle: vert pour correct, rouge pour incorrect
  - Bouton "Question suivante" ou "Voir les résultats"
  - Page de résultats avec:
    - Pourcentage de réussite
    - Nombre de bonnes réponses / total
    - Barre de progression
    - Boutons "Recommencer" et "Retour à l'accueil"
  - Gestion des états: loading, erreur, quiz vide

### 3. Page Admin (`app/admin/page.tsx`)
- **Type**: Server Component
- **Fonctionnalités**:
  - Header avec titre "Administration MedQuiz"
  - Cartes d'action rapide:
    - "Nouvelle catégorie" (lien vers `/admin/categories/new`)
    - "Nouveau QCM" (lien vers `/admin/quizzes/new`)
  - Section Catégories:
    - Liste des catégories avec nombre de QCM
    - Affichage de l'icône et couleur
    - Bouton pour ajouter une catégorie
  - Section QCM récents:
    - Liste des QCM avec catégorie, nombre de questions, date
    - Badge de difficulté
    - Tri par date de mise à jour (plus récent en premier)

### 4. Page Nouvelle Catégorie (`app/admin/categories/new/page.tsx`)
- **Type**: Client Component
- **Fonctionnalités**:
  - Formulaire avec:
    - Nom de la catégorie (obligatoire)
    - Description (optionnel)
    - Couleur (sélecteur ou input couleur)
    - Icône (optionnel, texte/emoji)
  - Validation côté client
  - Soumission via API POST `/api/categories`
  - Redirection vers `/admin` après création

### 5. Page Nouveau QCM (`app/admin/quizzes/new/page.tsx`)
- **Type**: Client Component
- **Fonctionnalités**:
  - Formulaire principal:
    - Titre du QCM (obligatoire)
    - Description (optionnel)
    - Sélection de catégorie (dropdown)
    - Sélection de difficulté (3 boutons: Facile/Moyen/Difficile)
  - Gestion dynamique des questions:
    - Ajout/suppression de questions
    - Pour chaque question:
      - Texte de la question (obligatoire)
      - 4 réponses (obligatoires)
      - Bouton radio pour sélectionner la bonne réponse
      - Explication (optionnel)
  - Validation:
    - Tous les champs obligatoires remplis
    - Au moins une bonne réponse par question
  - Soumission via API POST `/api/quizzes`
  - Redirection vers `/admin` après création

## Routes API

### 1. GET `/api/categories`
- Retourne toutes les catégories
- Utilise Prisma pour récupérer les données

### 2. POST `/api/categories`
- Crée une nouvelle catégorie
- Validation: nom obligatoire
- Retourne la catégorie créée

### 3. GET `/api/quiz/[id]`
- Retourne un quiz avec ses questions et réponses
- Inclut la catégorie
- Questions et réponses triées par `order`
- Gestion d'erreur 404 si quiz non trouvé

### 4. POST `/api/quizzes`
- Crée un nouveau quiz avec questions et réponses
- Validation:
  - Titre, categoryId, questions obligatoires
  - Au moins une question
- Crée le quiz, les questions et les réponses en une transaction
- Retourne le quiz créé avec toutes ses relations

## Configuration Prisma

### `lib/prisma.ts`
- Configuration du client Prisma
- Gestion de la DATABASE_URL:
  - Utilise `process.env.DATABASE_URL` si disponible
  - Sinon, construit le chemin vers `prisma/dev.db`
  - Normalise les chemins Windows (backslashes → slashes)
  - Format SQLite: `file:///chemin/absolu`
- Pattern singleton pour éviter les multiples instances en développement

## Configuration Next.js

### `next.config.ts`
- Configuration standard Next.js

### `tsconfig.json`
- Configuration TypeScript avec paths alias `@/*` pointant vers le dossier racine

### `package.json`
Scripts:
- `dev`: Lance le serveur de développement
- `build`: Build de production
- `start`: Lance le serveur de production
- `lint`: Lint ESLint
- `seed`: Exécute le script de seed Prisma

## Styles Globaux

### `app/globals.css`
- Import Tailwind CSS 4
- Définition des variables CSS (couleurs, ombres, polices)
- Configuration du thème Tailwind inline
- Styles du body avec antialiasing
- Transitions globales
- Scrollbar personnalisée (orange)
- Animations CSS (fadeIn, slideIn, pulse)
- Classes utilitaires d'animation

### `app/layout.tsx`
- Layout racine avec fonts Geist
- Metadata de base
- Application des styles globaux

## Fonctionnalités Spécifiques

### Gestion des Quiz
- Les quiz sont organisés par catégories
- Chaque quiz a un niveau de difficulté (facile/moyen/difficile)
- Les questions sont ordonnées
- Chaque question a 4 réponses, une seule correcte
- Les explications sont affichées après validation

### Interface Utilisateur
- Design moderne avec thème orange médical
- Animations fluides et transitions
- Responsive design (mobile-first)
- États de chargement et erreurs gérés
- Feedback visuel immédiat (couleurs pour correct/incorrect)

### Interface Admin
- Création simple de catégories et QCM
- Validation côté client et serveur
- Gestion dynamique des questions (ajout/suppression)
- Sélection visuelle de la bonne réponse

## Instructions de Développement

1. **Initialisation**:
   - Créer un projet Next.js 16 avec TypeScript
   - Installer les dépendances listées
   - Configurer Prisma avec SQLite

2. **Base de données**:
   - Créer le schéma Prisma complet
   - Générer le client Prisma
   - Créer la migration initiale
   - Optionnel: créer un script de seed

3. **Composants UI**:
   - Créer tous les composants UI dans `components/ui/`
   - Respecter le design system avec les variables CSS
   - Tester les variantes et états

4. **Pages**:
   - Créer toutes les pages dans `app/`
   - Implémenter les Server Components et Client Components selon les besoins
   - Gérer les états de chargement et erreurs

5. **API Routes**:
   - Créer toutes les routes API dans `app/api/`
   - Implémenter la validation et la gestion d'erreurs
   - Utiliser Prisma pour les opérations de base de données

6. **Styling**:
   - Configurer Tailwind CSS 4
   - Définir toutes les variables CSS dans `globals.css`
   - Appliquer les styles selon le design system

7. **Tests**:
   - Tester la création de catégories
   - Tester la création de QCM avec plusieurs questions
   - Tester le passage d'un quiz complet
   - Vérifier la responsivité

## Notes Importantes

- **Pas d'authentification dans l'UI**: Le modèle User existe mais l'authentification n'est pas implémentée dans l'interface. L'application fonctionne sans authentification pour l'instant.
- **SQLite local**: La base de données est SQLite locale dans `prisma/dev.db`
- **Design cohérent**: Tous les composants doivent utiliser les variables CSS définies pour maintenir la cohérence visuelle
- **Accessibilité**: Les composants doivent être accessibles (labels, focus states, etc.)
- **Performance**: Utiliser Server Components quand possible, Client Components uniquement pour l'interactivité

## Résultat Attendu

Une application web complète et fonctionnelle permettant:
- Aux étudiants de naviguer dans les catégories, voir les QCM disponibles, et passer des quiz avec feedback immédiat
- Aux administrateurs de créer des catégories et des QCM complets avec questions, réponses et explications
- Une expérience utilisateur fluide avec un design moderne et professionnel
- Une architecture propre et maintenable avec TypeScript et Prisma

