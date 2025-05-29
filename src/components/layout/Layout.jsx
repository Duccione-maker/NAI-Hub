import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import useUserProfile from '../../hooks/useUserProfile';

/**
 * Layout principale dell'applicazione
 * Include Header, Footer e gestisce il controllo degli accessi
 */
const Layout = () => {
  const { userProfile, loading } = useUserProfile();

  // Mostra un loader durante il caricamento del profilo
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Reindirizza all'onboarding se l'utente non ha un livello
  if (!userProfile || !userProfile.level) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;