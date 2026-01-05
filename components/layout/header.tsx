'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/50 bg-stone-50/95 backdrop-blur supports-[backdrop-filter]:bg-stone-50/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-stone-800">
                Med<span className="text-orange-500">Quiz</span>
              </span>
              <span className="text-lg text-stone-500 italic flex items-center gap-2.5" style={{ fontFamily: "var(--font-handwriting)" }}>
                <span className="text-lg font-medium">pour Manon et Elisa</span>
                <svg
                  className="w-5 h-5 text-orange-500 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  style={{ transform: 'skewX(-10deg) translateX(-5px)' }}
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-orange-100/60 text-orange-600'
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-100/60'
              }`}
            >
              Accueil
            </Link>
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname?.startsWith('/admin')
                  ? 'bg-orange-100/60 text-orange-600'
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-100/60'
              }`}
            >
              Administration
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

