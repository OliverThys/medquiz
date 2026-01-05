import { PrismaClient } from '@prisma/client';
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

async function main() {
  console.log('🌱 Starting seed...');

  // Créer des catégories
  const cardiologie = await prisma.category.upsert({
    where: { id: 'cat-cardio' },
    update: {},
    create: {
      id: 'cat-cardio',
      name: 'Cardiologie',
      description: 'Questions sur le système cardiovasculaire',
      color: '#FF6B35',
      icon: '❤️',
    },
  });

  const neurologie = await prisma.category.upsert({
    where: { id: 'cat-neuro' },
    update: {},
    create: {
      id: 'cat-neuro',
      name: 'Neurologie',
      description: 'Questions sur le système nerveux',
      color: '#4ECDC4',
      icon: '🧠',
    },
  });

  console.log('✅ Categories created');

  // Créer un quiz exemple
  const quiz = await prisma.quiz.upsert({
    where: { id: 'quiz-example' },
    update: {},
    create: {
      id: 'quiz-example',
      title: 'Anatomie du cœur',
      description: 'Quiz sur l\'anatomie et la physiologie du cœur',
      categoryId: cardiologie.id,
      difficulty: 'medium',
      questions: {
        create: [
          {
            questionText: 'Quel est le rôle principal du ventricule gauche ?',
            explanation: 'Le ventricule gauche pompe le sang oxygéné vers tout le corps via l\'aorte.',
            order: 1,
            answers: {
              create: [
                {
                  answerText: 'Pomper le sang vers les poumons',
                  isCorrect: false,
                  order: 1,
                },
                {
                  answerText: 'Pomper le sang oxygéné vers tout le corps',
                  isCorrect: true,
                  order: 2,
                },
                {
                  answerText: 'Recevoir le sang des veines',
                  isCorrect: false,
                  order: 3,
                },
                {
                  answerText: 'Filtrer le sang',
                  isCorrect: false,
                  order: 4,
                },
              ],
            },
          },
          {
            questionText: 'Combien de cavités possède le cœur ?',
            explanation: 'Le cœur possède 4 cavités : 2 oreillettes et 2 ventricules.',
            order: 2,
            answers: {
              create: [
                {
                  answerText: '2',
                  isCorrect: false,
                  order: 1,
                },
                {
                  answerText: '3',
                  isCorrect: false,
                  order: 2,
                },
                {
                  answerText: '4',
                  isCorrect: true,
                  order: 3,
                },
                {
                  answerText: '5',
                  isCorrect: false,
                  order: 4,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  console.log('✅ Quiz created');
  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

