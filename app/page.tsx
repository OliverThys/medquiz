import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        quizzes: {
          include: {
            _count: {
              select: {
                questions: true,
              },
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function HomePage() {
  const categories = await getCategories();
  const totalQuizzes = categories.reduce((sum, cat) => sum + cat.quizzes.length, 0);
  const totalQuestions = categories.reduce(
    (sum, cat) => sum + cat.quizzes.reduce((qSum, quiz) => qSum + (quiz._count?.questions || 0), 0),
    0
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Révision Médicale <span className="text-orange-500">Interactive</span>
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Testez vos connaissances avec des QCM adaptés à votre niveau
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-orange-500 mb-1">{categories.length}</div>
              <div className="text-sm text-neutral-600">Catégories</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-orange-500 mb-1">{totalQuizzes}</div>
              <div className="text-sm text-neutral-600">QCM disponibles</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-orange-500 mb-1">{totalQuestions}</div>
              <div className="text-sm text-neutral-600">Questions totales</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <Card className="text-center animate-scale-in">
            <CardContent className="py-16">
              <div className="text-neutral-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-neutral-600 mb-6">Aucune catégorie disponible pour le moment.</p>
              <Link
                href="/admin/categories/new"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
              >
                Créer une catégorie
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => (
              <div key={category.id} className="animate-fade-in">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <svg
                      className="w-6 h-6"
                      style={{ color: category.color }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">{category.name}</h2>
                    {category.description && (
                      <p className="text-sm text-neutral-600">{category.description}</p>
                    )}
                  </div>
                </div>

                {/* Quizzes Grid */}
                {category.quizzes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.quizzes.map((quiz) => {
                      const isComprehensiveQuiz = quiz.title.toLowerCase().includes('toutes les questions') ||
                                                  quiz.title.toLowerCase().includes('mélangées');

                      return (
                        <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
                          <Card hover className={`h-full ${isComprehensiveQuiz ? 'bg-gradient-to-br from-orange-50 to-white border-orange-200' : ''}`}>
                            <CardContent className="py-5">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-neutral-900 line-clamp-2 flex-1">
                                {quiz.title}
                              </h3>
                              <Badge
                                variant={
                                  quiz.difficulty === 'easy'
                                    ? 'success'
                                    : quiz.difficulty === 'hard'
                                    ? 'error'
                                    : 'warning'
                                }
                              >
                                {quiz.difficulty === 'easy' ? 'Facile' : quiz.difficulty === 'hard' ? 'Difficile' : 'Moyen'}
                              </Badge>
                            </div>
                            {quiz.description && (
                              <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{quiz.description}</p>
                            )}
                            <div className="flex items-center text-xs text-neutral-500">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {quiz._count?.questions || 0} question{(quiz._count?.questions || 0) > 1 ? 's' : ''}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8 text-neutral-500">
                      Aucun quiz disponible dans cette catégorie
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
