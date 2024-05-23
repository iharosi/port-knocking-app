import { FC } from 'react';
import PortKnockingApp from './PortKnocker';
import ThemeProvider from '../providers/ThemeContext';

export const App: FC = () => {
  return (
    <ThemeProvider>
      <PortKnockingApp />
    </ThemeProvider>
  );
};
