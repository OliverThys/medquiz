'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-semibold text-lg text-neutral-900">
              Med<span className="text-orange-500">Quiz</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Accueil
            </Link>
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname?.startsWith('/admin')
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Administration
            </Link>
          </nav>

          {/* CTA Button */}
          <Link
            href="/admin/quizzes/new"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm hover:shadow"
          >
            Nouveau QCM
          </Link>
        </div>
      </div>
    </header>
  );
}
