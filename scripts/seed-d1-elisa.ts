import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Lire le fichier JSON
const jsonPath = path.join(process.cwd(), 'ressources', 'questions-elisa.json');
const jsonData = fs.readFileSync(jsonPath, 'utf-8');
const data = JSON.parse(jsonData);

console.log('🌱 Starting D1 seed for Elisa questions...');
console.log(`📚 Found ${data.questions.length} questions to import`);

// Fonction pour échapper les chaînes SQL
function escapeSQL(str: string): string {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\n/g, ' ').replace(/\r/g, '');
}

// Créer un fichier SQL temporaire
const sqlFile = path.join(process.cwd(), 'scripts', 'seed-d1-elisa-temp.sql');
let sqlContent = '';

// Créer la catégorie Communication
console.log('📝 Creating category for Communication...');
sqlContent += `INSERT OR REPLACE INTO categories (id, name, description, color, icon, createdAt, updatedAt)
VALUES ('cat-elisa', 'Communication', 'Théories et approches de la communication', '#9C27B0', '💬', datetime('now'), datetime('now'));

`;

// Organiser les questions par quiz selon les catégories du cours
const quizzes = [
  {
    id: 'quiz-elisa-1',
    title: 'Communication - Introduction et Métaphores',
    description: 'Introduction à la communication, métaphores mécaniste/organiste (Winkin)',
    questions: data.questions.slice(0, 5), // E001-E005
  },
  {
    id: 'quiz-elisa-2',
    title: 'Communication - Théorie Mathématique de Shannon',
    description: 'Théorie mathématique de l\'information, schéma de Shannon, bit, bruit et redondance',
    questions: data.questions.slice(5, 10), // E006-E010
  },
  {
    id: 'quiz-elisa-3',
    title: 'Communication - Théories Fonctionnalistes',
    description: 'Lasswell, École de Francfort, Lazarsfeld, Katz, gatekeeping, agenda-setting, spirale du silence',
    questions: data.questions.slice(10, 19), // E011-E019
  },
  {
    id: 'quiz-elisa-4',
    title: 'Communication - Théories Structurales',
    description: 'Saussure (langue/parole, arbitraire du signe), Jakobson (6 fonctions), Barthes (dénotation/connotation, mythologies)',
    questions: data.questions.slice(19, 25), // E020-E025
  },
  {
    id: 'quiz-elisa-5',
    title: 'Communication - Approches Narratologiques',
    description: 'Propp (31 fonctions, 7 rôles), Greimas (schéma actantiel), Eco (lector in fabula, lecteur modèle)',
    questions: data.questions.slice(25, 30), // E026-E030
  },
  {
    id: 'quiz-elisa-6',
    title: 'Communication - École de Palo Alto',
    description: 'Les 5 axiomes de la communication, interactions symétriques/complémentaires, digital/analogique',
    questions: data.questions.slice(30, 36), // E031-E036
  },
  {
    id: 'quiz-elisa-7',
    title: 'Communication - Sémiotique Pragmatique',
    description: 'Benveniste (histoire/discours), déictiques, Austin (actes de langage), Lakoff & Johnson (métaphores conceptuelles), Birdwhistell (kinésique), Hall (proxémique), embrayage, énoncé/énonciation, inférences',
    questions: [
      ...data.questions.slice(36, 43), // E037-E042
      ...data.questions.slice(50, 59), // E051-E059
    ],
  },
  {
    id: 'quiz-elisa-8',
    title: 'Communication - Transmédia et Culture de Convergence',
    description: 'Jenkins (transmédia storytelling, pro-sumer, culture participative, intelligence collective), critiques et limites',
    questions: [
      ...data.questions.slice(43, 48), // E043-E047
      ...data.questions.slice(61, 70), // E062-E070
    ],
  },
  {
    id: 'quiz-elisa-9',
    title: 'Communication - Repositionnements et Anthropologie',
    description: 'Morin (rumeur d\'Orléans), Cultural Studies, anthropologie de la communication',
    questions: [
      ...data.questions.slice(47, 51), // E048-E050
      ...data.questions.slice(59, 62), // E060-E061
    ],
  },
  {
    id: 'quiz-elisa-all',
    title: 'Communication - Toutes les questions (Mélangées)',
    description: `Toutes les ${data.questions.length} questions de communication mélangées pour une révision complète`,
    questions: [...data.questions].sort(() => Math.random() - 0.5), // Mélanger
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

  // Supprimer les anciennes questions et le quiz
  sqlContent += `DELETE FROM questions WHERE quizId = '${quizData.id}';\n`;
  sqlContent += `DELETE FROM answers WHERE questionId IN (SELECT id FROM questions WHERE quizId = '${quizData.id}');\n`;
  sqlContent += `DELETE FROM quizzes WHERE id = '${quizData.id}';\n`;

  // Créer le quiz
  sqlContent += `INSERT INTO quizzes (id, title, description, categoryId, difficulty, createdAt, updatedAt)
VALUES ('${quizData.id}', '${escapeSQL(quizData.title)}', '${escapeSQL(quizData.description)}', 'cat-elisa', '${mainDifficulty}', datetime('now'), datetime('now'));

`;

  // Créer les questions et réponses
  for (let i = 0; i < quizData.questions.length; i++) {
    const q = quizData.questions[i];
    const questionId = `${quizData.id}-q${i + 1}`;

    const fullExplanation = q.sourceReference
      ? `${q.explanation} (Référence: ${q.sourceReference})`
      : q.explanation;

    // Créer la question
    sqlContent += `INSERT INTO questions (id, quizId, questionText, explanation, [order], createdAt, updatedAt)
VALUES ('${questionId}', '${quizData.id}', '${escapeSQL(q.questionText)}', '${escapeSQL(fullExplanation)}', ${i + 1}, datetime('now'), datetime('now'));

`;

    // Créer les réponses
    for (let j = 0; j < q.answers.length; j++) {
      const answer = q.answers[j];
      const answerId = `${questionId}-a${j + 1}`;

      sqlContent += `INSERT INTO answers (id, questionId, answerText, isCorrect, [order], createdAt)
VALUES ('${answerId}', '${questionId}', '${escapeSQL(answer.answerText)}', ${answer.isCorrect ? 1 : 0}, ${j + 1}, datetime('now'));

`;
    }
  }

  console.log(`✅ Quiz "${quizData.title}" prepared with ${quizData.questions.length} questions`);
}

// Écrire le fichier SQL
fs.writeFileSync(sqlFile, sqlContent, 'utf-8');
console.log(`\n📄 SQL file generated: ${sqlFile}`);

// Exécuter le fichier SQL
console.log('🚀 Executing SQL file on D1...');
execSync(`wrangler d1 execute medquiz-db --remote --file="${sqlFile}"`, { stdio: 'inherit' });

// Supprimer le fichier temporaire
fs.unlinkSync(sqlFile);

console.log('\n🎉 All Elisa questions imported successfully!');
console.log(`📊 Total: ${data.questions.length} questions across ${quizzes.length} quizzes`);
