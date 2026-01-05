import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  // DATABASE_URL doit être défini dans les variables d'environnement
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Pendant le build, on peut utiliser une valeur par défaut pour éviter les erreurs
  // Cette valeur sera remplacée en production par la vraie DATABASE_URL
  if (process.env.NODE_ENV === 'production' || typeof process === 'undefined' || !process.cwd) {
    // Edge Runtime ou production - doit utiliser DATABASE_URL
    // Pendant le build, on retourne une valeur placeholder qui ne sera pas utilisée
    return 'file:./placeholder.db';
  }

  // Développement local uniquement (Node.js runtime)
  try {
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const normalizedPath = dbPath.replace(/\\/g, '/');
    return `file:///${normalizedPath}`;
  } catch {
    return 'file:./placeholder.db';
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

