// Helper to get database connection (D1 in production, Prisma in development)
export function getDb(request: any) {
  // In Cloudflare Pages production, use D1
  if (request?.cloudflare?.env?.DB) {
    return {
      type: 'd1' as const,
      db: request.cloudflare.env.DB,
    };
  }

  // In development or if D1 is not available, use Prisma
  const { prisma } = require('./prisma');
  return {
    type: 'prisma' as const,
    db: prisma,
  };
}
