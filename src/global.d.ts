declare global {
  interface Window {
    electronTheme: {
      onThemeChanged: (callback: (event: any, isDark: boolean) => void) => void;
      removeThemeListener: () => void;
    };
  }
}

export {};
