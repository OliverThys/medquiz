export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-sm text-neutral-600">
          <p className="flex items-center justify-center gap-1.5 mb-1">
            Développé avec
            <svg
              className="w-4 h-4 text-orange-500 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            pour <span className="font-semibold text-orange-600">Manon Picca</span>
          </p>
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} MAOLYS. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
