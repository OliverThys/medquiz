import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Base de données locale désactivée en production - utilisation de D1 Cloudflare
// En développement, Prisma est activé pour utiliser la base SQLite locale
const DATABASE_DISABLED = process.env.NODE_ENV === 'production';

// Créer un mock Prisma qui retourne des valeurs vides
function createMockPrisma(): PrismaClient {
  const mockModel = {
    findMany: () => Promise.resolve([]),
    findUnique: () => Promise.resolve(null),
    findFirst: () => Promise.resolve(null),
    create: () => Promise.resolve(null),
    update: () => Promise.resolve(null),
    delete: () => Promise.resolve(null),
    deleteMany: () => Promise.resolve({ count: 0 }),
    upsert: () => Promise.resolve(null),
    count: () => Promise.resolve(0),
  };

  return {
    category: mockModel as any,
    quiz: mockModel as any,
    question: mockModel as any,
    answer: mockModel as any,
    user: mockModel as any,
    quizAttempt: mockModel as any,
    userAnswer: mockModel as any,
    userProgress: mockModel as any,
    $disconnect: () => Promise.resolve(),
    $connect: () => Promise.resolve(),
  } as any as PrismaClient;
}

// Créer un wrapper qui intercepte les erreurs de connexion
function createPrismaWithErrorHandling(): PrismaClient {
  let prismaInstance: PrismaClient | null = null;

  const getPrisma = () => {
    if (!prismaInstance) {
      try {
        prismaInstance = new PrismaClient({
          datasources: {
            db: {
              url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
            },
          },
        });
      } catch (error) {
        console.warn('Prisma client initialization failed');
        return null;
      }
    }
    return prismaInstance;
  };

  // Créer un proxy pour intercepter toutes les méthodes
  return new Proxy({} as PrismaClient, {
    get(_target, prop: string) {
      if (DATABASE_DISABLED) {
        const mock = createMockPrisma();
        return (mock as any)[prop];
      }

      const prisma = getPrisma();
      if (!prisma) {
        const mock = createMockPrisma();
        return (mock as any)[prop];
      }

      const value = (prisma as any)[prop];
      if (typeof value === 'function') {
        return async (...args: any[]) => {
          try {
            return await value.apply(prisma, args);
          } catch (error: any) {
            // Intercepter les erreurs de connexion à la base de données
            if (
              error?.code === 'P1001' || 
              error?.code === 14 || 
              error?.message?.includes('Unable to open the database file') ||
              error?.message?.includes('Error querying the database')
            ) {
              console.warn('Database connection error intercepted, returning empty result');
              // Retourner des valeurs vides selon le type de requête
              const methodName = prop.toString();
              if (methodName.includes('findMany') || methodName.includes('findFirst')) {
                return [];
              }
              if (methodName.includes('findUnique')) {
                return null;
              }
              if (methodName.includes('count') || methodName.includes('deleteMany')) {
                return { count: 0 };
              }
              return null;
            }
            throw error;
          }
        };
      }
      return value;
    },
  });
}

export const prisma = createPrismaWithErrorHandling();

if (process.env.NODE_ENV !== 'production' && !DATABASE_DISABLED) {
  globalForPrisma.prisma = prisma as PrismaClient;
}

