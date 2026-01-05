import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Access D1 database from Cloudflare binding
    const env = (request as any).cloudflare?.env;
    if (!env?.DB) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Get all categories
    const categoriesResult = await env.DB.prepare(
      'SELECT * FROM categories ORDER BY createdAt DESC'
    ).all();

    const categories = await Promise.all(
      (categoriesResult.results || []).map(async (category: any) => {
        // Get quizzes for this category
        const quizzesResult = await env.DB.prepare(
          'SELECT * FROM quizzes WHERE categoryId = ? ORDER BY updatedAt DESC'
        ).bind(category.id).all();

        // Get question count for each quiz
        const quizzes = await Promise.all(
          (quizzesResult.results || []).map(async (quiz: any) => {
            const countResult = await env.DB.prepare(
              'SELECT COUNT(*) as count FROM questions WHERE quizId = ?'
            ).bind(quiz.id).first();

            return {
              ...quiz,
              _count: {
                questions: countResult?.count || 0,
              },
            };
          })
        );

        return {
          ...category,
          quizzes,
        };
      })
    );

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
