# MedQuiz - Application de QCM Médical

Application web complète pour créer et passer des quiz médicaux interactifs.

## 🚀 Technologies

- **Next.js 16.1.1** avec App Router
- **React 19.2.3**
- **TypeScript 5**
- **Prisma 7.2.0** avec SQLite
- **Tailwind CSS 4**

## 📦 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer la base de données :
```bash
npx prisma generate
npx prisma migrate dev --name init
```

3. (Optionnel) Remplir la base de données avec des données d'exemple :
```bash
npm run seed
```

4. Lancer le serveur de développement :
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🎯 Fonctionnalités

### Pour les étudiants
- Naviguer dans les catégories de QCM
- Passer des quiz interactifs
- Recevoir un feedback immédiat sur les réponses
- Voir les explications après chaque question
- Consulter les résultats détaillés à la fin du quiz

### Pour les administrateurs
- Créer des catégories avec couleurs et icônes personnalisées
- Créer des QCM complets avec questions, réponses et explications
- Gérer les niveaux de difficulté (Facile, Moyen, Difficile)
- Visualiser les catégories et QCM créés

## 📁 Structure du projet

```
├── app/
│   ├── api/              # Routes API
│   ├── admin/            # Pages d'administration
│   ├── quiz/             # Pages de quiz
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Page d'accueil
│   └── globals.css       # Styles globaux
├── components/
│   └── ui/               # Composants UI réutilisables
├── lib/
│   └── prisma.ts         # Client Prisma
└── prisma/
    ├── schema.prisma     # Schéma de base de données
    └── seed.ts           # Script de seed
```

## 🎨 Design System

L'application utilise un design system cohérent avec :
- Couleur principale : Orange médical (#FF6B35)
- Accents : Teal, Mint, Sky
- Animations fluides et transitions
- Design responsive (mobile-first)

## 📝 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build de production
- `npm run start` - Lance le serveur de production
- `npm run lint` - Lint ESLint
- `npm run seed` - Remplit la base de données avec des données d'exemple

## 🔧 Configuration

La base de données SQLite est stockée dans `prisma/dev.db`. Si vous souhaitez utiliser une autre base de données, configurez la variable d'environnement `DATABASE_URL` dans un fichier `.env`.

## 📚 Base de données

Le schéma Prisma inclut :
- **User** : Utilisateurs (préparé pour l'authentification future)
- **Category** : Catégories de QCM
- **Quiz** : QCM avec difficulté
- **Question** : Questions avec explications
- **Answer** : Réponses (une seule correcte par question)
- **QuizAttempt** : Tentatives de quiz (pour statistiques futures)
- **UserAnswer** : Réponses des utilisateurs
- **UserProgress** : Progression des utilisateurs

## 🎓 Utilisation

1. **Créer une catégorie** : Allez dans Administration → Nouvelle catégorie
2. **Créer un QCM** : Allez dans Administration → Nouveau QCM
3. **Passer un quiz** : Cliquez sur un QCM depuis la page d'accueil

## 📄 Licence

Ce projet est créé pour un usage éducatif.

