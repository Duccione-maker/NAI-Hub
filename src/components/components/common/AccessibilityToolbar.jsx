import React, { useState, useEffect } from 'react';
import './AccessibilityToolbar.css';

const AccessibilityToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    contrast: 'normal',
    reducedMotion: false,
    readAloud: false,
    keyboardNavigation: false,
    dyslexicFont: false
  });

  // Applica le impostazioni al DOM
  useEffect(() => {
    // Imposta la classe del font size
    document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xl');
    document.body.classList.add(`font-${settings.fontSize}`);
    
    // Imposta la classe del contrasto
    document.body.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark');
    document.body.classList.add(`contrast-${settings.contrast}`);
    
    // Imposta animazioni ridotte
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    
    // Imposta font per dislessia
    if (settings.dyslexicFont) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }
    
    // Salva le impostazioni nel localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);
  
  // Carica le impostazioni salvate al primo render
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Errore nel caricamento delle impostazioni di accessibilità:', e);
      }
    }
  }, []);
  
  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const resetSettings = () => {
    setSettings({
      fontSize: 'medium',
      contrast: 'normal',
      reducedMotion: false,
      readAloud: false,
      keyboardNavigation: false,
      dyslexicFont: false
    });
  };
  
  return (
    <div className={`accessibility-toolbar ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="accessibility-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Chiudi opzioni di accessibilità" : "Apri opzioni di accessibilità"}
      >
        <span className="accessibility-icon">♿</span>
      </button>
      
      {isOpen && (
        <div className="accessibility-panel" role="dialog" aria-label="Opzioni di accessibilità">
          <h3>Opzioni di accessibilità</h3>
          
          <div className="accessibility-option">
            <label htmlFor="font-size">Dimensione testo:</label>
            <select 
              id="font-size"
              value={settings.fontSize}
              onChange={(e) => handleSettingChange('fontSize', e.target.value)}
            >
              <option value="small">Piccolo</option>
              <option value="medium">Medio</option>
              <option value="large">Grande</option>
              <option value="xl">Extra grande</option>
            </select>
          </div>
          
          <div className="accessibility-option">
            <label htmlFor="contrast">Contrasto:</label>
            <select 
              id="contrast"
              value={settings.contrast}
              onChange={(e) => handleSettingChange('contrast', e.target.value)}
            >
              <option value="normal">Normale</option>
              <option value="high">Alto contrasto</option>
              <option value="dark">Modalità scura</option>
            </select>
          </div>
          
          <div className="accessibility-option">
            <label htmlFor="reduced-motion">
              <input 
                type="checkbox"
                id="reduced-motion"
                checked={settings.reducedMotion}
                onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
              />
              Riduci animazioni
            </label>
          </div>
          
          <div className="accessibility-option">
            <label htmlFor="dyslexic-font">
              <input 
                type="checkbox"
                id="dyslexic-font"
                checked={settings.dyslexicFont}
                onChange={(e) => handleSettingChange('dyslexicFont', e.target.checked)}
              />
              Font per dislessia
            </label>
          </div>
          
          <div className="accessibility-option">
            <label htmlFor="read-aloud">
              <input 
                type="checkbox"
                id="read-aloud"
                checked={settings.readAloud}
                onChange={(e) => handleSettingChange('readAloud', e.target.checked)}
              />
              Leggi ad alta voce (richiede supporto browser)
            </label>
          </div>
          
          <div className="accessibility-option">
            <label htmlFor="keyboard-navigation">
              <input 
                type="checkbox"
                id="keyboard-navigation"
                checked={settings.keyboardNavigation}
                onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
              />
              Abilita navigazione da tastiera
            </label>
          </div>
          
          <button className="reset-settings-btn" onClick={resetSettings}>
            Ripristina impostazioni predefinite
          </button>
          
          <div className="accessibility-help">
            <p>Per assistenza con le opzioni di accessibilità, contatta il supporto.</p>
            <a href="/guida-accessibilita" target="_blank" rel="noopener noreferrer">
              Guida completa all'accessibilità
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityToolbar;