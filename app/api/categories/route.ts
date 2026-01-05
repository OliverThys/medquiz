import 'server-only';
import { NextResponse } from 'next/server';
import { getD1FromRequest } from '@/lib/cloudflare';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const DB = getD1FromRequest(request);
    if (!DB) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Get all categories
    const categoriesResult = await DB.prepare(
      'SELECT * FROM categories ORDER BY createdAt DESC'
    ).all();

    const categories = await Promise.all(
      (categoriesResult.results || []).map(async (category: any) => {
        // Get quizzes for this category
        const quizzesResult = await DB.prepare(
          'SELECT * FROM quizzes WHERE categoryId = ? ORDER BY updatedAt DESC'
        ).bind(category.id).all();

        // Get question count for each quiz
        const quizzes = await Promise.all(
          (quizzesResult.results || []).map(async (quiz: any) => {
            const countResult = await DB.prepare(
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

        // Get total unique questions count for this category (to avoid double counting)
        // Compter directement toutes les questions uniques de cette catégorie
        const totalQuestionsResult = await DB.prepare(
          `SELECT COUNT(DISTINCT q.id) as count 
           FROM questions q 
           INNER JOIN quizzes qu ON q.quizId = qu.id 
           WHERE qu.categoryId = ?`
        ).bind(category.id).first();

        return {
          ...category,
          quizzes,
          _totalQuestions: Number(totalQuestionsResult?.count) || 0,
        };
      })
    );

    // Calculer le total global de toutes les questions uniques (toutes catégories confondues)
    const globalTotalResult = await DB.prepare(
      `SELECT COUNT(DISTINCT q.id) as count 
       FROM questions q 
       INNER JOIN quizzes qu ON q.quizId = qu.id`
    ).first();
    
    const globalTotal = Number(globalTotalResult?.count) || 0;

    return NextResponse.json({
      categories,
      _globalTotalQuestions: globalTotal,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
