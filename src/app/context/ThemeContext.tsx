import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { withViewTransition } from '../../lib/viewTransition';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle('light', theme === 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio_theme');
      if (saved === 'dark' || saved === 'light') setThemeState(saved);
    } catch { /* Storage is optional. */ }
    setPreferencesLoaded(true);
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    applyThemeClass(theme);
    try { localStorage.setItem('portfolio_theme', theme); } catch { /* Storage is optional. */ }
  }, [theme, preferencesLoaded]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    // The class is applied inside the transition so the new snapshot is already themed.
    withViewTransition(() => { applyThemeClass(next); setThemeState(next); });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
