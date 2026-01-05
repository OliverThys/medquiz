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
    // Mode sombre désactivé - forcer toujours le mode clair
    setTheme('light');
    
    // Forcer la suppression de la classe dark et du mode sombre
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('dark');
    htmlElement.style.colorScheme = 'light';
    document.body.style.colorScheme = 'light';
    
    // Supprimer le thème dark du localStorage s'il existe
    if (localStorage.getItem('theme') === 'dark') {
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    // Mode sombre désactivé - ne rien faire
    // const newTheme = theme === 'light' ? 'dark' : 'light';
    // setTheme(newTheme);
    // localStorage.setItem('theme', newTheme);
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

