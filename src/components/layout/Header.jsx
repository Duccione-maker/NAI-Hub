import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useUserProfile from '../../hooks/useUserProfile';

/**
 * Componente Header dell'applicazione
 */
const Header = () => {
  const location = useLocation();
  const { userProfile } = useUserProfile();
  
  // Determina se un link è attivo
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo e nome app */}
          <Link to="/dashboard" className="text-xl font-bold">
            NAI-Hub
          </Link>
          
          {/* Navigazione principale */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/dashboard"
                  className={`hover:text-blue-200 ${
                    isActive('/dashboard') ? 'font-bold' : ''
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/lettura"
                  className={`hover:text-blue-200 ${
                    isActive('/lettura') ? 'font-bold' : ''
                  }`}
                >
                  Lettura
                </Link>
              </li>
              <li>
                <Link
                  to="/scrittura"
                  className={`hover:text-blue-200 ${
                    isActive('/scrittura') ? 'font-bold' : ''
                  }`}
                >
                  Scrittura
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Info profilo */}
          <div className="flex items-center space-x-3">
            {userProfile && (
              <div className="text-sm">
                <span className="opacity-75">Livello:</span>{' '}
                <span className="font-bold">{userProfile.level}</span>
              </div>
            )}
            
            {/* Pulsante menu mobile (non implementato completamente) */}
            <button
              className="md:hidden p-1 rounded hover:bg-blue-700"
              aria-label="Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;