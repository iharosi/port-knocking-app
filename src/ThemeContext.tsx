import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';
import { lightTheme, darkTheme } from './themes';

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (window.electronTheme) {
      const handleThemeChange = (event: any, isDark: boolean) => {
        setIsDarkMode(isDark);
      };

      window.electronTheme.onThemeChanged(handleThemeChange);

      // Cleanup listener on unmount
      return () => {
        window.electronTheme.removeThemeListener();
      };
    } else {
      console.error('window.electronTheme is not defined');
    }
  }, []);

  const theme: Theme = isDarkMode ? darkTheme : lightTheme;

  // Set CSS variables based on the theme
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--background-color', theme.palette.background.default);
    root.style.setProperty('--text-color', theme.palette.text.primary);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
