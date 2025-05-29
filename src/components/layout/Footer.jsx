import React from 'react';

/**
 * Componente Footer dell'applicazione
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              &copy; {currentYear} NAI-Hub - Piattaforma di apprendimento dell'italiano
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a
              href="#terms"
              className="text-sm text-gray-400 hover:text-white"
            >
              Termini di servizio
            </a>
            <a
              href="#privacy"
              className="text-sm text-gray-400 hover:text-white"
            >
              Privacy
            </a>
            <a
              href="#help"
              className="text-sm text-gray-400 hover:text-white"
            >
              Aiuto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;