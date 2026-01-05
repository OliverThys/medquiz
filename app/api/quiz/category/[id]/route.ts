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

    // Get category
    const categoryResult = await env.DB.prepare(
      'SELECT * FROM categories WHERE id = ?'
    ).bind(id).first();

    if (!categoryResult) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Get all quizzes for this category
    const quizzesResult = await env.DB.prepare(
      'SELECT id FROM quizzes WHERE categoryId = ?'
    ).bind(id).all();

    const quizzes = quizzesResult.results || [];

    // Get all questions from all quizzes
    const allQuestions = [];
    for (const quiz of quizzes) {
      const questionsResult = await env.DB.prepare(
        'SELECT * FROM questions WHERE quizId = ? ORDER BY [order] ASC'
      ).bind(quiz.id).all();

      for (const question of (questionsResult.results || [])) {
        const answersResult = await env.DB.prepare(
          'SELECT * FROM answers WHERE questionId = ? ORDER BY [order] ASC'
        ).bind(question.id).all();

        allQuestions.push({
          ...question,
          answers: answersResult.results || [],
        });
      }
    }

    // Create virtual quiz with all questions
    const virtualQuiz = {
      id: `category-${categoryResult.id}`,
      title: `${categoryResult.name} - Toutes les questions`,
      description: `Quiz complet avec toutes les questions de ${categoryResult.name}`,
      difficulty: 'medium',
      category: {
        id: categoryResult.id,
        name: categoryResult.name,
        color: categoryResult.color,
      },
      questions: allQuestions,
    };

    return NextResponse.json(virtualQuiz);
  } catch (error) {
    console.error('Error fetching category quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
