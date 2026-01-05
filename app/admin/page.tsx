'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animation de progression au chargement
    const timer = setTimeout(() => setProgress(65), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-orange-50/20 to-neutral-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-1 flex items-center justify-center">
        <div className="max-w-3xl w-full">
          <Card className="animate-scale-in shadow-xl">
            <CardContent className="py-12 sm:py-16 text-center">
              {/* Icône de construction avec animation */}
              <div className="mb-8 flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-spin-slow"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ animation: 'spin 3s linear infinite' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  {/* Badge animé */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Titre avec gradient */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-neutral-900 via-orange-600 to-neutral-900 bg-clip-text text-transparent">
                Administration
              </h1>

              {/* Badge "En développement" */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-100 border border-orange-300 rounded-full mb-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-semibold text-orange-700">En cours de développement</span>
              </div>

              <p className="text-base sm:text-lg text-neutral-600 mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed px-4">
                Cette section est actuellement en construction. Elle permettra bientôt de gérer les catégories, quiz et questions de manière intuitive.
              </p>

              {/* Barre de progression animée et stylisée */}
              <div className="mb-10 max-w-md mx-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-neutral-600">Progression</span>
                  <span className="text-xs font-bold text-orange-600">{progress}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transition-all duration-1000 ease-out relative shadow-lg"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="mt-2 flex gap-1 justify-center">
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></div>
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>

              {/* Fonctionnalités à venir - Améliorées */}
              <div className="mb-2">
                <h2 className="text-xs sm:text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">
                  Fonctionnalités à venir
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10 max-w-2xl mx-auto">
                <div className="group p-4 sm:p-5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-lg hover:-translate-y-1 duration-200">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-900 mb-1">Gestion des Quiz</h3>
                  <p className="text-xs sm:text-sm text-neutral-600">Créer et modifier vos QCM facilement</p>
                </div>

                <div className="group p-4 sm:p-5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-lg hover:-translate-y-1 duration-200">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-900 mb-1">Catégories</h3>
                  <p className="text-xs sm:text-sm text-neutral-600">Organiser vos quiz par thème médical</p>
                </div>

                <div className="group p-4 sm:p-5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-lg hover:-translate-y-1 duration-200">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-900 mb-1">Banque de Questions</h3>
                  <p className="text-xs sm:text-sm text-neutral-600">Gérer et enrichir votre base</p>
                </div>

                <div className="group p-4 sm:p-5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-lg hover:-translate-y-1 duration-200">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-neutral-900 mb-1">Statistiques</h3>
                  <p className="text-xs sm:text-sm text-neutral-600">Analyser les performances</p>
                </div>
              </div>

              {/* Informations supplémentaires */}
              <div className="mb-8 p-4 bg-neutral-100 rounded-lg border border-neutral-200 max-w-lg mx-auto">
                <p className="text-xs text-neutral-600 leading-relaxed">
                  <span className="font-semibold text-orange-600">Note :</span> Cette interface permettra de gérer l'intégralité du contenu pédagogique. Vous pourrez ajouter, modifier et supprimer des quiz en toute simplicité.
                </p>
              </div>

              {/* Bouton retour amélioré */}
              <Link href="/">
                <Button variant="primary" size="lg" className="shadow-lg hover:shadow-xl">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Retour à l'accueil
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

