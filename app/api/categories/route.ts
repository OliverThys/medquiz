import 'server-only';
import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET() {
  try {
    const { env } = getRequestContext();
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
