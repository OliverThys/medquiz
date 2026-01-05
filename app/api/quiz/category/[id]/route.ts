import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Récupérer la catégorie avec tous ses quizzes et questions
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        quizzes: {
          include: {
            questions: {
              include: {
                answers: {
                  orderBy: {
                    order: 'asc',
                  },
                },
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Combiner toutes les questions de tous les quizzes de la catégorie
    const allQuestions = category.quizzes.flatMap(quiz => quiz.questions);

    // Créer un quiz virtuel avec toutes les questions
    const virtualQuiz = {
      id: `category-${category.id}`,
      title: `${category.name} - Toutes les questions`,
      description: `Quiz complet avec toutes les questions de ${category.name}`,
      difficulty: 'medium',
      category: {
        id: category.id,
        name: category.name,
        color: category.color,
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
