'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Answer {
  id: string;
  answerText: string;
  isCorrect: boolean;
  order: number;
}

interface Question {
  id: string;
  questionText: string;
  explanation: string | null;
  order: number;
  answers: Answer[];
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  questions: Question[];
}

// Fonction pour mélanger un tableau
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, { answerId: string; isCorrect: boolean }>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const resolvedParams = await params;
        const response = await fetch(`/api/quiz/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json() as Quiz;

          // Mélanger les questions et les réponses
          const shuffledQuestions = shuffleArray(data.questions);
          const questionsWithShuffledAnswers = shuffledQuestions.map((question: Question) => ({
            ...question,
            answers: shuffleArray(question.answers),
          }));

          setQuiz({
            ...data,
            questions: questionsWithShuffledAnswers,
          });
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [params]);

  const handleValidate = () => {
    if (!selectedAnswerId || !quiz) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedAnswer = currentQuestion.answers.find(a => a.id === selectedAnswerId);
    const isCorrect = selectedAnswer?.isCorrect || false;

    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: {
        answerId: selectedAnswerId,
        isCorrect,
      },
    });

    setIsValidated(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswerId(null);
      setIsValidated(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswerId(null);
    setIsValidated(false);
    setUserAnswers({});
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center flex-1">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-stone-600">Chargement du quiz...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center flex-1">
          <p className="text-stone-600 mb-6">Quiz non trouvé</p>
          <Link href="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (showResults) {
    const correctCount = Object.values(userAnswers).filter(ua => ua.isCorrect).length;
    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl flex-1">
          <Card className="animate-scale-in">
            <CardContent className="py-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center border-4 border-orange-200">
                  <span className="text-4xl font-bold text-orange-600">{percentage}%</span>
                </div>
                <h2 className="text-2xl font-bold text-stone-900 mb-2">Quiz terminé !</h2>
                <p className="text-stone-600">
                  {correctCount} bonne{correctCount > 1 ? 's' : ''} réponse{correctCount > 1 ? 's' : ''} sur {totalQuestions}
                </p>
              </div>

              <Progress value={percentage} className="mb-8 h-3" />

              <div className="space-y-4 mb-8">
                {quiz.questions.map((question, index) => {
                  const userAnswer = userAnswers[question.id];
                  const isCorrect = userAnswer?.isCorrect || false;

                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-lg border-2 ${
                        isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {isCorrect ? (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-stone-900 mb-2">
                            Question {index + 1}: {question.questionText}
                          </p>
                          {question.explanation && (
                            <p className="text-sm text-stone-600 bg-white p-3 rounded-lg border border-stone-200">
                              {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 justify-center">
                <Button onClick={handleRestart}>Recommencer</Button>
                <Link href="/">
                  <Button variant="outline">Retour à l'accueil</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  // Calculer le score actuel
  const correctAnswersCount = Object.values(userAnswers).filter(ua => ua.isCorrect).length;
  const answeredQuestionsCount = Object.keys(userAnswers).length;
  const currentPercentage = answeredQuestionsCount > 0
    ? Math.round((correctAnswersCount / answeredQuestionsCount) * 100)
    : 0;

    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Header />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-3xl flex-1">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-stone-600">
                Question {currentQuestionIndex + 1} sur {quiz.questions.length}
              </span>
              {answeredQuestionsCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full border border-orange-200">
                  <span className="text-sm font-semibold text-orange-700">
                    {correctAnswersCount}/{answeredQuestionsCount}
                  </span>
                  <span className="text-xs text-orange-600">
                    ({currentPercentage}%)
                  </span>
                </div>
              )}
            </div>
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
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="animate-fade-in">
          <CardContent className="py-6 sm:py-8">
            <h2 className="text-lg sm:text-xl font-semibold text-stone-900 mb-4 sm:mb-6">
              {currentQuestion.questionText}
            </h2>

            <div className="space-y-3 mb-6">
              {currentQuestion.answers.map((answer) => {
                const isSelected = selectedAnswerId === answer.id;
                const showCorrect = isValidated && answer.isCorrect;
                const showIncorrect = isValidated && isSelected && !answer.isCorrect;

                return (
                  <button
                    key={answer.id}
                    onClick={() => !isValidated && setSelectedAnswerId(answer.id)}
                    disabled={isValidated}
                    className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-50'
                        : showIncorrect
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-stone-200 hover:border-orange-300 bg-white'
                    } ${isValidated ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        showCorrect
                          ? 'border-green-500 bg-green-500'
                          : showIncorrect
                          ? 'border-red-500 bg-red-500'
                          : isSelected
                          ? 'border-orange-500'
                          : 'border-stone-300'
                      }`}>
                        {(showCorrect || showIncorrect) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {showCorrect ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            )}
                          </svg>
                        )}
                        {isSelected && !isValidated && (
                          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                        )}
                      </div>
                      <span className={`flex-1 ${
                        showCorrect ? 'text-green-900' : showIncorrect ? 'text-red-900' : 'text-stone-900'
                      }`}>
                        {answer.answerText}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {isValidated && currentQuestion.explanation && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-medium text-orange-900 mb-1">Explication</p>
                <p className="text-sm text-orange-800">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="flex justify-end">
              {!isValidated ? (
                <Button onClick={handleValidate} disabled={!selectedAnswerId}>
                  Valider
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {currentQuestionIndex < quiz.questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
