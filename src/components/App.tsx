import { FC } from 'react';
import { PortKnockingApp } from './PortKnocker';
import { ThemeProvider } from '../providers/ThemeProvider';

export const App: FC = () => {
  return (
    <ThemeProvider>
      <PortKnockingApp />
    </ThemeProvider>
  );
};
