'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Récupérer le thème depuis localStorage, par défaut light (pas de préférence système)
    const savedTheme = localStorage.getItem('theme') as Theme;

    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);

    // Appliquer le thème au DOM immédiatement
    const htmlElement = document.documentElement;
    if (initialTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    // Forcer la mise à jour du style et du color-scheme
    htmlElement.style.colorScheme = initialTheme;
    document.body.style.colorScheme = initialTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Appliquer le thème au DOM immédiatement
    const htmlElement = document.documentElement;
    if (newTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    // Forcer la mise à jour du style et du color-scheme
    htmlElement.style.colorScheme = newTheme;
    document.body.style.colorScheme = newTheme;
  };

  // Éviter le flash de contenu non stylé
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  // During SSR/prerendering, return default values instead of throwing
  if (context === undefined) {
    return {
      theme: 'light' as Theme,
      toggleTheme: () => {},
    };
  }
  return context;
}

