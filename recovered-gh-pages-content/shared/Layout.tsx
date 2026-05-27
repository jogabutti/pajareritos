import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode | React.ReactNode[];
}

const LayoutContainer: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-root">
      <Header />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
};

export { LayoutContainer as Layout };
