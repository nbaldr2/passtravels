import React, { createContext, useContext, ReactNode } from 'react';
import { View } from 'react-native';

interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: { fontSize: number; fontWeight: 'bold' | 'normal'; lineHeight: number };
    h2: { fontSize: number; fontWeight: 'bold' | 'normal'; lineHeight: number };
    body: { fontSize: number; fontWeight: 'bold' | 'normal'; lineHeight: number };
    caption: { fontSize: number; fontWeight: 'bold' | 'normal'; lineHeight: number };
  };
}

const defaultTheme: Theme = {
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    accent: '#ec4899',
    border: '#334155',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: 'bold', lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: 'bold', lineHeight: 32 },
    body: { fontSize: 16, fontWeight: 'normal', lineHeight: 24 },
    caption: { fontSize: 14, fontWeight: 'normal', lineHeight: 20 },
  },
};

const ThemeContext = createContext<Theme>(defaultTheme);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      <View style={{ flex: 1, backgroundColor: defaultTheme.colors.background }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);