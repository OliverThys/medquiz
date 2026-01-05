import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  // En production (Edge Runtime), DATABASE_URL doit être défini
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // En développement local uniquement (Node.js runtime)
  if (typeof process !== 'undefined' && process.cwd) {
    try {
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
      const normalizedPath = dbPath.replace(/\\/g, '/');
      return `file:///${normalizedPath}`;
    } catch {
      // Si path n'est pas disponible (Edge Runtime), on utilise une valeur par défaut
    }
  }

  // Fallback pour Edge Runtime - doit être configuré via DATABASE_URL
  throw new Error('DATABASE_URL environment variable is required in Edge Runtime');
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

