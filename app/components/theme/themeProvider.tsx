import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

type Theme = 'dark' | 'light';
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch('/api/theme');
        if (response.ok) {
          const data = await response.json();
          setTheme(data.theme as Theme);
        }
      } catch (error) {
        console.error('Failed to fetch theme:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTheme();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (error) {
      console.error('Failed to update theme:', error);
    } finally {
      setLoading(false);
    }
  }, [theme]);

  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  if (loading) {
    return <div className='text-blue-500 font-extrabold text-center m-20'>Loading...</div>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}