import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

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
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

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