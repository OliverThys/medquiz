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

// Créer la catégorie pour Elisa (à personnaliser selon sa spécialité)
console.log('📝 Creating category for Elisa...');
sqlContent += `INSERT OR REPLACE INTO categories (id, name, description, color, icon, createdAt, updatedAt)
VALUES ('cat-elisa', 'Spécialité Elisa', 'Questions de la spécialité d''Elisa', '#E91E63', '💊', datetime('now'), datetime('now'));

`;

// Organiser les questions par quiz (à adapter selon le nombre de questions)
// Pour l'instant, structure de base avec quiz par tranche de 50 questions
const totalQuestions = data.questions.length;
const quizzesPerBatch = 50;
const quizzes: any[] = [];

// Créer des quiz par batch de 50 questions
const numBatches = Math.ceil(totalQuestions / quizzesPerBatch);
for (let i = 0; i < numBatches; i++) {
  const start = i * quizzesPerBatch;
  const end = Math.min((i + 1) * quizzesPerBatch, totalQuestions);

  quizzes.push({
    id: `quiz-elisa-${i + 1}`,
    title: `Spécialité Elisa - Module ${i + 1}`,
    description: `Questions ${start + 1} à ${end}`,
    questions: data.questions.slice(start, end),
  });
}

// Ajouter un quiz avec toutes les questions mélangées
quizzes.push({
  id: 'quiz-elisa-all',
  title: 'Spécialité Elisa - Toutes les questions (Mélangées)',
  description: `Toutes les ${totalQuestions} questions mélangées pour une révision complète`,
  questions: [...data.questions].sort(() => Math.random() - 0.5), // Mélanger
});

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
