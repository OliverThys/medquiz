'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json() as { categories: any[], _globalTotalQuestions: number };
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const totalQuizzes = categories.reduce((sum, cat) => sum + cat.quizzes.length, 0);
  // Nombre de questions codé en dur à 400
  const totalQuestions = 400;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-700 flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center flex-1">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-stone-200">Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-700 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-50 mb-4">
            Révision Médicale <span className="text-orange-500">Interactive</span>
          </h1>
          <p className="text-lg text-stone-200 max-w-2xl mx-auto">
            Testez vos connaissances avec des QCM adaptés à votre niveau
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-orange-500 mb-1">{categories.length}</div>
              <div className="text-sm text-stone-200">Catégories</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-orange-500 mb-1">{totalQuizzes}</div>
              <div className="text-sm text-stone-200">QCM disponibles</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-orange-500 mb-1">{totalQuestions}</div>
              <div className="text-sm text-stone-200">Questions totales</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <Card className="text-center animate-scale-in">
            <CardContent className="py-16">
              <div className="text-stone-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-stone-200 mb-6">Aucune catégorie disponible pour le moment.</p>
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
                    <h2 className="text-2xl font-bold text-stone-50">{category.name}</h2>
                    {category.description && (
                      <p className="text-sm text-stone-200">{category.description}</p>
                    )}
                  </div>
                </div>

                {/* Quizzes Grid */}
                {category.quizzes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...category.quizzes].sort((a: any, b: any) => {
                      // Mettre le quiz "test complet 400 questions" en premier
                      const aIsComprehensive = a.title.toLowerCase().includes('toutes les questions') ||
                                              a.title.toLowerCase().includes('mélangées') ||
                                              a.title.toLowerCase().includes('400') ||
                                              a.title.toLowerCase().includes('test complet');
                      const bIsComprehensive = b.title.toLowerCase().includes('toutes les questions') ||
                                              b.title.toLowerCase().includes('mélangées') ||
                                              b.title.toLowerCase().includes('400') ||
                                              b.title.toLowerCase().includes('test complet');
                      if (aIsComprehensive && !bIsComprehensive) return -1;
                      if (!aIsComprehensive && bIsComprehensive) return 1;
                      return 0;
                    }).map((quiz: any) => {
                      const isComprehensiveQuiz = quiz.title.toLowerCase().includes('toutes les questions') ||
                                                  quiz.title.toLowerCase().includes('mélangées') ||
                                                  quiz.title.toLowerCase().includes('400') ||
                                                  quiz.title.toLowerCase().includes('test complet');

                      return (
                        <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
                          <Card hover className={`h-full ${isComprehensiveQuiz ? 'border-orange-500 border-2' : ''}`}>
                            <CardContent className="py-5">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-stone-50 line-clamp-2 flex-1">
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
                              <p className="text-sm text-stone-200 mb-4 line-clamp-2">{quiz.description}</p>
                            )}
                            <div className="flex items-center text-xs text-stone-400">
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
                    <CardContent className="text-center py-8 text-stone-400">
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
