import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Construire le chemin vers prisma/dev.db
  const path = require('path');
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  
  // Normaliser les chemins Windows (backslashes → slashes)
  const normalizedPath = dbPath.replace(/\\/g, '/');
  
  // Format SQLite: file:///chemin/absolu (3 slashes pour chemin absolu)
  return `file:///${normalizedPath}`;
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

