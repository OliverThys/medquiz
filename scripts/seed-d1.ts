import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Lire le fichier JSON
const jsonPath = path.join(process.cwd(), 'ressources', 'questions-nephrologie.json');
const jsonData = fs.readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(jsonData);

console.log('🌱 Starting D1 seed for nephrology questions...');
console.log(`📚 Found ${data.questions.length} questions to import`);

// Fonction pour échapper les chaînes SQL
function escapeSQL(str: string): string {
  return str.replace(/'/g, "''").replace(/\n/g, ' ');
}

// Créer la catégorie Néphrologie
console.log('📝 Creating category...');
const categorySQL = `
INSERT OR REPLACE INTO categories (id, name, description, color, icon, createdAt, updatedAt)
VALUES ('cat-nephro', 'Néphrologie', 'Questions sur le fonctionnement et les maladies des reins', '#5AB9EA', '🫘', datetime('now'), datetime('now'));
`;

execSync(`wrangler d1 execute medquiz-db --remote --command="${categorySQL.replace(/\n/g, ' ').trim()}"`, { stdio: 'inherit' });

// Organiser les questions par quiz
const quizzes = [
  {
    id: 'quiz-nephro-1',
    title: 'Néphrologie - Introduction et Anatomie',
    description: 'Questions sur les bases de la néphrologie, anatomie et physiologie rénale',
    questions: data.questions.slice(0, 50),
  },
  {
    id: 'quiz-nephro-2',
    title: 'Néphrologie - Physiologie et Filtration',
    description: 'Questions sur la physiologie rénale, filtration glomérulaire et transport',
    questions: data.questions.slice(50, 100),
  },
  {
    id: 'quiz-nephro-3',
    title: 'Néphrologie - Glomérulopathies',
    description: 'Questions sur les glomérulopathies et syndromes néphrotiques/néphritiques',
    questions: data.questions.slice(100, 150),
  },
  {
    id: 'quiz-nephro-4',
    title: 'Néphrologie - Néphropathies Tubulo-Interstitielles',
    description: 'Questions sur les néphropathies tubulo-interstitielles aiguës et chroniques',
    questions: data.questions.slice(150, 200),
  },
  {
    id: 'quiz-nephro-5',
    title: 'Néphrologie - Néphropathie Diabétique',
    description: 'Questions sur la néphropathie diabétique et son traitement',
    questions: data.questions.slice(200, 250),
  },
  {
    id: 'quiz-nephro-6',
    title: 'Néphrologie - Néphropathies Vasculaires et Vascularites',
    description: 'Questions sur les néphropathies vasculaires et les vascularites',
    questions: data.questions.slice(250, 300),
  },
  {
    id: 'quiz-nephro-7',
    title: 'Néphrologie - Insuffisance Rénale et Dialyse',
    description: 'Questions sur l\'insuffisance rénale aiguë et chronique, dialyse',
    questions: data.questions.slice(300, 350),
  },
  {
    id: 'quiz-nephro-8',
    title: 'Néphrologie - Transplantation et Troubles Métaboliques',
    description: 'Questions sur la transplantation rénale, troubles hydro-électrolytiques et acido-basiques',
    questions: data.questions.slice(350, 400),
  },
  {
    id: 'quiz-nephro-all',
    title: 'Néphrologie - Toutes les questions (Mélangées)',
    description: 'Toutes les 400 questions de néphrologie mélangées pour une révision complète',
    questions: data.questions.sort(() => Math.random() - 0.5), // Mélanger
  },
];

// Créer les quizzes et questions
for (const quizData of quizzes) {
  console.log(`\n📝 Creating quiz: ${quizData.title} (${quizData.questions.length} questions)`);
  
  // Déterminer la difficulté
  const difficulties = quizData.questions.map((q: any) => q.difficulty);
  const easyCount = difficulties.filter((d: string) => d === 'easy').length;
  const mediumCount = difficulties.filter((d: string) => d === 'medium').length;
  const hardCount = difficulties.filter((d: string) => d === 'hard').length;
  
  let mainDifficulty = 'medium';
  if (hardCount > easyCount && hardCount > mediumCount) {
    mainDifficulty = 'hard';
  } else if (easyCount > mediumCount && easyCount > hardCount) {
    mainDifficulty = 'easy';
  }

  // Créer le quiz
  const quizSQL = `
INSERT OR REPLACE INTO quizzes (id, title, description, categoryId, difficulty, createdAt, updatedAt)
VALUES ('${quizData.id}', '${escapeSQL(quizData.title)}', '${escapeSQL(quizData.description)}', 'cat-nephro', '${mainDifficulty}', datetime('now'), datetime('now'));
`;

  execSync(`wrangler d1 execute medquiz-db --remote --command="${quizSQL.replace(/\n/g, ' ').trim()}"`, { stdio: 'inherit' });

  // Supprimer les anciennes questions
  execSync(`wrangler d1 execute medquiz-db --remote --command="DELETE FROM questions WHERE quizId = '${quizData.id}';"`, { stdio: 'inherit' });

  // Créer les questions et réponses
  for (let i = 0; i < quizData.questions.length; i++) {
    const q = quizData.questions[i];
    const questionId = `${quizData.id}-q${i + 1}`;
    
    const fullExplanation = q.sourceReference 
      ? `${q.explanation} (Référence: ${q.sourceReference})`
      : q.explanation;

    // Créer la question
    const questionSQL = `
INSERT INTO questions (id, quizId, questionText, explanation, "order", createdAt, updatedAt)
VALUES ('${questionId}', '${quizData.id}', '${escapeSQL(q.questionText)}', '${escapeSQL(fullExplanation)}', ${i + 1}, datetime('now'), datetime('now'));
`;

    execSync(`wrangler d1 execute medquiz-db --remote --command="${questionSQL.replace(/\n/g, ' ').trim()}"`, { stdio: 'inherit' });

    // Créer les réponses
    for (let j = 0; j < q.answers.length; j++) {
      const answer = q.answers[j];
      const answerId = `${questionId}-a${j + 1}`;
      
      const answerSQL = `
INSERT INTO answers (id, questionId, answerText, isCorrect, "order", createdAt)
VALUES ('${answerId}', '${questionId}', '${escapeSQL(answer.answerText)}', ${answer.isCorrect ? 1 : 0}, ${j + 1}, datetime('now'));
`;

      execSync(`wrangler d1 execute medquiz-db --remote --command="${answerSQL.replace(/\n/g, ' ').trim()}"`, { stdio: 'inherit' });
    }
  }

  console.log(`✅ Quiz "${quizData.title}" created with ${quizData.questions.length} questions`);
}

console.log('\n🎉 All nephrology questions imported successfully!');
console.log(`📊 Total: ${data.questions.length} questions across ${quizzes.length} quizzes`);

