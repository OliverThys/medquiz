import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  // DATABASE_URL doit être défini dans les variables d'environnement
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Pendant le build ou en Edge Runtime, on utilise une valeur placeholder
  // Cette valeur sera remplacée en production par la vraie DATABASE_URL
  // On vérifie si on est en Edge Runtime en testant la disponibilité de process.cwd
  const isEdgeRuntime = typeof process === 'undefined' || 
                        typeof process.cwd !== 'function' ||
                        process.env.NODE_ENV === 'production';

  if (isEdgeRuntime) {
    return 'file:./placeholder.db';
  }

  // Développement local uniquement (Node.js runtime)
  // On utilise une approche dynamique pour éviter les erreurs en Edge Runtime
  try {
    // Vérifier si on peut accéder à process.cwd de manière sûre
    if (typeof process !== 'undefined' && typeof process.cwd === 'function') {
      const path = require('path');
      const cwd = process.cwd();
      const dbPath = path.join(cwd, 'prisma', 'dev.db');
      const normalizedPath = dbPath.replace(/\\/g, '/');
      return `file:///${normalizedPath}`;
    }
  } catch {
    // Ignorer les erreurs
  }

  return 'file:./placeholder.db';
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

