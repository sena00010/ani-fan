"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'purple' | 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    border: string;
    hover: string;
  };
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'purple',
  setTheme: () => {},
  colors: {
    primary: '',
    secondary: '',
    background: '',
    surface: '',
    text: '',
    textSecondary: '',
    accent: '',
    border: '',
    hover: '',
  },
});

const themeColors = {
  purple: {
    primary: 'from-purple-500 to-pink-500',
    secondary: 'from-blue-500 to-purple-500',
    background: 'from-slate-900 via-purple-900 to-slate-900',
    surface: 'bg-white/10',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    accent: 'from-purple-500 to-pink-500',
    border: 'border-white/20',
    hover: 'hover:bg-white/20',
  },
  dark: {
    primary: 'from-gray-800 to-gray-900',
    secondary: 'from-gray-700 to-gray-800',
    background: 'from-gray-900 via-gray-800 to-gray-900',
    surface: 'bg-gray-800/80',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    accent: 'from-gray-600 to-gray-700',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700/50',
  },
  light: {
    primary: 'from-amber-500 to-yellow-500',
    secondary: 'from-amber-400 to-yellow-400',
    background: 'from-amber-50 via-yellow-50 to-amber-100',
    surface: 'bg-white/98',
    text: 'text-gray-900',
    textSecondary: 'text-gray-700',
    accent: 'from-amber-500 to-yellow-500',
    border: 'border-amber-200/80',
    hover: 'hover:bg-amber-50/80',
  },
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('purple');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme && ['purple', 'dark', 'light'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const colors = themeColors[theme];

  const value = {
    theme,
    setTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
