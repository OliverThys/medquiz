import type { CloudflareEnv } from '@cloudflare/next-on-pages';

/**
 * Helper pour accéder à l'environnement Cloudflare (D1) depuis une requête
 * Compatible avec @cloudflare/next-on-pages
 * 
 * Pour @cloudflare/next-on-pages, l'environnement est injecté dans le contexte
 * de la requête via les propriétés globales en runtime edge
 */
export function getCloudflareEnv(): CloudflareEnv | null {
  // Dans @cloudflare/next-on-pages, les bindings sont injectés dans globalThis
  // via le runtime Cloudflare Workers
  if (typeof globalThis !== 'undefined') {
    // Essayer différentes méthodes d'accès selon la version de @cloudflare/next-on-pages
    const env = (globalThis as any).__env || 
                (globalThis as any).__CLOUDFLARE_ENV__ ||
                (globalThis as any).env;
    
    if (env && env.DB) {
      return env as CloudflareEnv;
    }
  }

  // Alternative: accès via process.env (si injecté)
  if (typeof process !== 'undefined' && (process.env as any).DB) {
    return { DB: (process.env as any).DB } as CloudflareEnv;
  }

  return null;
}

/**
 * Helper pour obtenir la base de données D1
 * 
 * Note: Pour @cloudflare/next-on-pages, D1 est accessible via le contexte
 * de la requête injecté par le runtime Cloudflare Workers
 */
export function getD1Database(): D1Database | null {
  const env = getCloudflareEnv();
  return env?.DB || null;
}

/**
 * Helper pour obtenir D1 depuis une requête (méthode alternative)
 * Utilise le contexte de la requête si disponible
 * 
 * Pour @cloudflare/next-on-pages, l'environnement est accessible via:
 * - request.cloudflare.env (méthode recommandée)
 * - request.cf.env (alternative)
 * - globalThis.__env (injecté par le runtime)
 */
export function getD1FromRequest(request?: Request): D1Database | null {
  // Méthode 1: Via request.cloudflare.env (comme dans lib/db.ts)
  if (request) {
    const reqAny = request as any;
    if (reqAny.cloudflare?.env?.DB) {
      return reqAny.cloudflare.env.DB as D1Database;
    }
    // Méthode 2: Via request.cf.env
    if (reqAny.cf?.env?.DB) {
      return reqAny.cf.env.DB as D1Database;
    }
    // Méthode 3: Via request.env
    if (reqAny.env?.DB) {
      return reqAny.env.DB as D1Database;
    }
  }

  // Méthode 4: Via globalThis (injecté par le runtime Cloudflare)
  const db = getD1Database();
  if (db) return db;

  return null;
}

