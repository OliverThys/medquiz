import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  const normalizedPath = dbPath.replace(/\\/g, '/');
  return `file:///${normalizedPath}`;
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});

interface Answer {
  answerText: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  questionText: string;
  difficulty: string;
  answers: Answer[];
  explanation: string;
  sourceReference: string;
}

interface QuestionsData {
  questions: Question[];
}

async function main() {
  console.log('🌱 Starting nephrology questions import...');

  // Lire le fichier JSON
  const jsonPath = path.join(process.cwd(), 'ressources', 'questions-nephrologie.json');
  const jsonData = fs.readFileSync(jsonPath, 'utf-8');
  const data: QuestionsData = JSON.parse(jsonData);

  console.log(`📚 Found ${data.questions.length} questions to import`);

  // Créer ou récupérer la catégorie Néphrologie
  const nephrologie = await prisma.category.upsert({
    where: { id: 'cat-nephro' },
    update: {},
    create: {
      id: 'cat-nephro',
      name: 'Néphrologie',
      description: 'Questions sur le fonctionnement et les maladies des reins',
      color: '#5AB9EA',
      icon: '🫘',
    },
  });

  console.log('✅ Category created/updated');

  // Fonction pour mélanger un tableau (Fisher-Yates)
  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Organiser les questions par thème approximatif basé sur leur contenu
  const quizzes = [
    {
      id: 'quiz-nephro-1',
      title: 'Néphrologie - Introduction et Anatomie',
      description: 'Questions sur les bases de la néphrologie, anatomie et physiologie rénale',
      questions: data.questions.slice(0, 50), // Q001-Q050
    },
    {
      id: 'quiz-nephro-2',
      title: 'Néphrologie - Physiologie et Filtration',
      description: 'Questions sur la physiologie rénale, filtration glomérulaire et transport',
      questions: data.questions.slice(50, 100), // Q051-Q100
    },
    {
      id: 'quiz-nephro-3',
      title: 'Néphrologie - Glomérulopathies',
      description: 'Questions sur les glomérulopathies et syndromes néphrotiques/néphritiques',
      questions: data.questions.slice(100, 150), // Q101-Q150
    },
    {
      id: 'quiz-nephro-4',
      title: 'Néphrologie - Néphropathies Tubulo-Interstitielles',
      description: 'Questions sur les néphropathies tubulo-interstitielles aiguës et chroniques',
      questions: data.questions.slice(150, 200), // Q151-Q200
    },
    {
      id: 'quiz-nephro-5',
      title: 'Néphrologie - Néphropathie Diabétique',
      description: 'Questions sur la néphropathie diabétique et son traitement',
      questions: data.questions.slice(200, 250), // Q201-Q250
    },
    {
      id: 'quiz-nephro-6',
      title: 'Néphrologie - Néphropathies Vasculaires et Vascularites',
      description: 'Questions sur les néphropathies vasculaires et les vascularites',
      questions: data.questions.slice(250, 300), // Q251-Q300
    },
    {
      id: 'quiz-nephro-7',
      title: 'Néphrologie - Insuffisance Rénale et Dialyse',
      description: 'Questions sur l\'insuffisance rénale aiguë et chronique, dialyse',
      questions: data.questions.slice(300, 350), // Q301-Q350
    },
    {
      id: 'quiz-nephro-8',
      title: 'Néphrologie - Transplantation et Troubles Métaboliques',
      description: 'Questions sur la transplantation rénale, troubles hydro-électrolytiques et acido-basiques',
      questions: data.questions.slice(350, 400), // Q351-Q400
    },
    {
      id: 'quiz-nephro-all',
      title: 'Néphrologie - Toutes les questions (Mélangées)',
      description: 'Toutes les 400 questions de néphrologie mélangées pour une révision complète',
      questions: shuffleArray(data.questions), // Toutes les questions mélangées
    },
  ];

  // Créer les quizzes et leurs questions
  for (const quizData of quizzes) {
    console.log(`\n📝 Creating quiz: ${quizData.title} (${quizData.questions.length} questions)`);

    // Déterminer la difficulté principale du quiz
    const difficulties = quizData.questions.map(q => q.difficulty);
    const easyCount = difficulties.filter(d => d === 'easy').length;
    const mediumCount = difficulties.filter(d => d === 'medium').length;
    const hardCount = difficulties.filter(d => d === 'hard').length;
    
    let mainDifficulty = 'medium';
    if (hardCount > easyCount && hardCount > mediumCount) {
      mainDifficulty = 'hard';
    } else if (easyCount > mediumCount && easyCount > hardCount) {
      mainDifficulty = 'easy';
    }

    const quiz = await prisma.quiz.upsert({
      where: { id: quizData.id },
      update: {
        title: quizData.title,
        description: quizData.description,
        difficulty: mainDifficulty,
      },
      create: {
        id: quizData.id,
        title: quizData.title,
        description: quizData.description,
        categoryId: nephrologie.id,
        difficulty: mainDifficulty,
      },
    });

    // Supprimer les anciennes questions si elles existent
    await prisma.question.deleteMany({
      where: { quizId: quiz.id },
    });

    // Créer les questions
    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      
      // Ajouter la référence source à l'explication si elle existe
      const fullExplanation = q.sourceReference 
        ? `${q.explanation} (Référence: ${q.sourceReference})`
        : q.explanation;

      await prisma.question.create({
        data: {
          questionText: q.questionText,
          explanation: fullExplanation,
          order: i + 1,
          quizId: quiz.id,
          answers: {
            create: q.answers.map((answer, idx) => ({
              answerText: answer.answerText,
              isCorrect: answer.isCorrect,
              order: idx + 1,
            })),
          },
        },
      });
    }

    console.log(`✅ Quiz "${quizData.title}" created with ${quizData.questions.length} questions`);
  }

  console.log('\n🎉 All nephrology questions imported successfully!');
  console.log(`📊 Total: ${data.questions.length} questions across ${quizzes.length} quizzes`);
}

main()
  .catch((e) => {
    console.error('❌ Error during import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

