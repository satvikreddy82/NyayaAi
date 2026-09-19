import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Footer } from '../components/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-6">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};
