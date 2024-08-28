'use client';
import { useTheme } from '@/app/components/theme/themeProvider';  

const AppearanceSettings = () => {
  const { theme, toggleTheme } = useTheme();

  const updateTheme = async (newTheme: 'dark' | 'light') => {
    try {
      await fetch('/api/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    toggleTheme();
    updateTheme(newTheme);
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-blue-700 light:text-blue-500">Appearance Settings</h1>
      <div className="flex flex-col">
        <label className="text-lg font-semibold text-blue-700 light:text-blue-500">Display Options:</label>
        <div className="flex space-x-5">
          <button
            className={`rounded-md mt-2 p-1 text-lg hover:font-semibold ${
              theme === 'dark'
                ? 'bg-gray-900 text-blue-500 border border-blue-900 hover:bg-gray-800'
                : 'bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300'
            }`}
            onClick={handleThemeChange}
          >
            Dark Mode
          </button>
          <button
            className={`rounded-md mt-2 p-1 hover:font-semibold ${
              theme === 'light'
                ? 'bg-blue-500 text-white border border-blue-500 hover:bg-blue-600'
                : 'bg-blue-200 text-blue-700 border border-blue-300 hover:bg-blue-300'
            }`}
            onClick={handleThemeChange}
          >
            Light Mode
          </button>
        </div>
      </div>
    </>
  );
}

export default AppearanceSettings;