'use client'

import { FC, ReactNode } from 'react';

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Add your header/navigation here if needed */}
      {children}
      {/* Add your footer here if needed */}
    </div>
  );
};

export default HomeLayout;