import React from 'react';
import PortKnockingApp from './PortKnocker';
import ThemeProvider from './ThemeContext';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PortKnockingApp />
    </ThemeProvider>
  );
};
