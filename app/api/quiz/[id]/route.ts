import 'server-only';
import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Access D1 database from Cloudflare binding
    const { env } = getRequestContext();
    if (!env?.DB) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Get quiz
    const quizResult = await env.DB.prepare(
      'SELECT * FROM quizzes WHERE id = ?'
    ).bind(id).first();

    if (!quizResult) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Get category
    const categoryResult = await env.DB.prepare(
      'SELECT id, name, color FROM categories WHERE id = ?'
    ).bind(quizResult.categoryId).first();

    // Get questions
    const questionsResult = await env.DB.prepare(
      'SELECT * FROM questions WHERE quizId = ? ORDER BY [order] ASC'
    ).bind(id).all();

    // Get answers for all questions
    const questions = await Promise.all(
      (questionsResult.results || []).map(async (question: any) => {
        const answersResult = await env.DB.prepare(
          'SELECT * FROM answers WHERE questionId = ? ORDER BY [order] ASC'
        ).bind(question.id).all();

        return {
          ...question,
          answers: answersResult.results || [],
        };
      })
    );

    const quiz = {
      ...quizResult,
      category: categoryResult,
      questions,
    };

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
