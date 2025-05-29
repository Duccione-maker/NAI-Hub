import React from 'react';
import './SupportoButton.css';

const SupportoButton = ({ isVisible, toggleVisibility, currentLanguage = 'it' }) => {
  // Traduzioni per il pulsante in diverse lingue
  const translations = {
    it: '🌍 Supporto Linguistico',
    en: '🌍 Language Support',
    es: '🌍 Soporte Lingüístico',
    fr: '🌍 Support Linguistique',
    de: '🌍 Sprachunterstützung',
    // Aggiungi altre lingue supportate dalla piattaforma
  };

  const buttonText = translations[currentLanguage] || translations.it;

  return (
    <button 
      className={`supporto-button ${isVisible ? 'active' : ''}`} 
      onClick={toggleVisibility}
      aria-label="Toggle language support"
    >
      {buttonText}
    </button>
  );
};

export default SupportoButton;