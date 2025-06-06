// EnhancedSupportoLinguistico.js - Sistema integrato con debug completo
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../contexts/contexts/UserContext';

// IMPORT CORRETTI - dalla cartella SupportoLinguistico esistente
import SupportoLinguistico from '../SupportoLinguistico/SupportoLinguistico';
import '../SupportoLinguistico/SupportoLinguistico.css';

// Import CSS del sistema traduzione
import './TranslationSystem.css';
import './EnhancedSupporto.css';

// === SISTEMA DI TRADUZIONE SEMPLIFICATO INTEGRATO ===
class SimpleTranslationSystem {
  constructor() {
    this.isActive = false;
    this.userLanguage = 'en';
    this.hoverTimeout = null;
    this.currentPopup = null;
    this.personalDictionary = this.loadPersonalDictionary();
    this.isSmartDisabled = false;
  }

  initialize(userContext) {
    console.log('🌍 SimpleTranslationSystem: Initializing...');
    
    if (userContext?.user?.motherLanguage) {
      this.userLanguage = this.mapLanguageCode(userContext.user.motherLanguage);
    }
    
    console.log('🔧 DEBUG INITIALIZE:', {
      userLanguage: this.userLanguage,
      currentPath: window.location.pathname,
      beforeCheckSection: this.isActive
    });
    
    this.checkSectionAndActivate();
    
    console.log('🔧 DEBUG DOPO CHECK:', {
      afterCheckSection: this.isActive,
      willSetupListeners: this.isActive
    });
    
    if (this.isActive) {
      console.log('✅ Chiamando setupEventListeners...');
      this.setupEventListeners();
    } else {
      console.log('❌ NON chiamo setupEventListeners - isActive:', this.isActive);
    }
    
    console.log(`🎯 TranslationSystem: ${this.isActive ? 'ATTIVO' : 'DISATTIVATO'}`);
  }

  checkSectionAndActivate() {
    const currentPath = window.location.pathname;
    
    const isDisabledSection = ['/test-ingresso', '/test-livello', '/esame'].some(section => 
      currentPath.includes(section)
    );
    
    const isActiveSection = ['/dashboard', '/lettura', '/scrittura', '/punteggiatura', '/registri', '/dojo'].some(section => 
      currentPath.includes(section)
    );
    
    console.log('🔧 DEBUG SECTION CHECK:', {
      currentPath,
      isDisabledSection,
      isActiveSection,
      isSmartDisabled: this.isSmartDisabled
    });
    
    this.isActive = isActiveSection && !isDisabledSection && !this.isSmartDisabled;
    
    console.log('🎯 RISULTATO CHECK:', this.isActive);
  }

  setupEventListeners() {
    if (!this.isActive) {
      console.log('❌ Event listeners NON attivati - sistema non attivo');
      return;
    }
    
    console.log('🔧 FORCE SETUP - Attivando listeners...');
    
    // Rimuovi eventuali listener esistenti
    this.removeEventListeners();
    
    // Attiva SUBITO senza delay e con arrow functions
    this.boundHandleMouseOver = (e) => {
      console.log('🖱️ MOUSEOVER CATTURATO!', e.target.tagName);
      this.handleMouseOver(e);
    };
    this.boundHandleMouseOut = (e) => this.handleMouseOut(e);
    this.boundHandleTextSelection = (e) => this.handleTextSelection(e);
    this.boundHandleClickOutside = (e) => this.handleClickOutside(e);
    
    // Attacca i listener con opzioni aggressive
    document.addEventListener('mouseover', this.boundHandleMouseOver, { 
      passive: false, 
      capture: true 
    });
    document.addEventListener('mouseout', this.boundHandleMouseOut, { 
      passive: false, 
      capture: true 
    });
    document.addEventListener('mouseup', this.boundHandleTextSelection, { 
      passive: false 
    });
    document.addEventListener('click', this.boundHandleClickOutside, { 
      passive: false 
    });
    
    console.log('✅ FORCE SETUP COMPLETATO - Listeners attivi con capture=true');
    
    // Test immediato per verificare che funzioni
    setTimeout(() => {
      console.log('🧪 Test auto-trigger...');
      const textElement = document.querySelector('p, div, span');
      if (textElement && textElement.textContent) {
        console.log('📝 Elemento test trovato:', textElement.textContent.slice(0, 30));
        this.handleMouseOver({
          target: textElement,
          clientX: 300,
          clientY: 300
        });
      }
    }, 500);
  }

  removeEventListeners() {
    if (this.boundHandleMouseOver) {
      document.removeEventListener('mouseover', this.boundHandleMouseOver);
      document.removeEventListener('mouseout', this.boundHandleMouseOut);
      document.removeEventListener('mouseup', this.boundHandleTextSelection);
      document.removeEventListener('click', this.boundHandleClickOutside);
      console.log('🗑️ Event listeners rimossi');
    }
  }

  handleMouseOver(event) {
    console.log('🖱️ HOVER DEBUG:', {
      target: event.target,
      tagName: event.target.tagName,
      textContent: event.target.textContent?.slice(0, 30),
      isActive: this.isActive,
      isValidElement: this.isValidTextElement(event.target),
      classList: event.target.classList.toString()
    });
    
    if (!this.isActive || this.isSmartDisabled) {
      console.log('❌ Sistema non attivo:', { isActive: this.isActive, isSmartDisabled: this.isSmartDisabled });
      return;
    }
    
    const element = event.target;
    if (!this.isValidTextElement(element)) {
      console.log('❌ Elemento non valido');
      return;
    }
    
    const word = this.getWordFromElement(element);
    console.log('📝 Parola estratta:', word);
    
    if (!word || word.length < 3) {
      console.log('❌ Parola troppo corta:', word);
      return;
    }
    
    clearTimeout(this.hoverTimeout);
    this.hoverTimeout = setTimeout(() => {
      console.log('🌍 Avvio traduzione per:', word);
      this.showHoverTranslation(word, event.clientX, event.clientY);
    }, 800);
  }

  handleMouseOut(event) {
    clearTimeout(this.hoverTimeout);
    setTimeout(() => {
      if (this.currentPopup && !this.currentPopup.matches(':hover')) {
        this.hideCurrentPopup();
      }
    }, 300);
  }

  handleTextSelection(event) {
    if (!this.isActive || this.isSmartDisabled) return;
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length < 3) return;
    
    console.log('📝 Testo selezionato:', selectedText);
    
    this.hideCurrentPopup();
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    this.showTranslationButton(selectedText, rect.right + 10, rect.top);
  }

  handleClickOutside(event) {
    if (!event.target.closest('.translation-popup') && 
        !event.target.closest('.translation-button')) {
      this.hideCurrentPopup();
    }
  }

  isValidTextElement(element) {
    const invalidTags = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'];
    if (invalidTags.includes(element.tagName)) {
      console.log('❌ Tag non valido:', element.tagName);
      return false;
    }
    
    if (element.closest('.translation-popup') || 
        element.closest('.supporto-linguistico-widget') ||
        element.closest('.translation-button')) {
      console.log('❌ Elemento del sistema di traduzione');
      return false;
    }
    
    const hasText = element.textContent && element.textContent.trim().length > 0;
    if (!hasText) {
      console.log('❌ Nessun testo');
    }
    
    return hasText;
  }

  getWordFromElement(element) {
    const textContent = element.textContent;
    if (!textContent) return null;
    
    const words = textContent.split(/\s+/);
    const validWord = words.find(word => word.length > 2) || null;
    console.log('🔍 Parole trovate:', words, '-> Scelta:', validWord);
    return validWord;
  }

  async showHoverTranslation(word, x, y) {
    try {
      console.log('🌍 Trying to translate:', word);
      
      const cachedTranslation = this.getCachedTranslation(word);
      if (cachedTranslation) {
        console.log('📚 Traduzione da cache:', cachedTranslation);
        this.displayTranslationPopup(word, cachedTranslation, x, y, 'cache');
        return;
      }
      
      const translation = this.getMockTranslation(word);
      if (translation) {
        console.log('🎭 Traduzione mock:', translation);
        this.displayTranslationPopup(word, translation, x, y, 'mock');
        this.saveToPersonalDictionary(word, translation);
      }
    } catch (error) {
      console.error('❌ Errore traduzione hover:', error);
    }
  }

  showTranslationButton(text, x, y) {
    const existingButton = document.querySelector('.translation-button');
    if (existingButton) existingButton.remove();
    
    console.log('🌍 Creando pulsante traduzione per:', text);
    
    const button = document.createElement('button');
    button.className = 'translation-button';
    button.innerHTML = '🌍 Traduci';
    button.style.position = 'fixed';
    button.style.left = `${Math.min(x, window.innerWidth - 100)}px`;
    button.style.top = `${Math.max(y - 30, 10)}px`;
    button.style.zIndex = '10000';
    
    button.onclick = async () => {
      button.innerHTML = '⏳ Traducendo...';
      button.disabled = true;
      
      try {
        const translation = this.getMockTranslation(text);
        if (translation) {
          this.displayTranslationPopup(text, translation, x, y - 50, 'selection');
          this.saveToPersonalDictionary(text, translation);
        }
      } catch (error) {
        console.error('❌ Errore traduzione selezione:', error);
      } finally {
        button.remove();
      }
    };
    
    document.body.appendChild(button);
    
    setTimeout(() => {
      if (button.parentNode) button.remove();
    }, 5000);
  }

  getMockTranslation(text) {
    const mockTranslations = {
      'casa': 'house',
      'libro': 'book', 
      'scuola': 'school',
      'insegnante': 'teacher',
      'studiare': 'to study',
      'imparare': 'to learn',
      'difficile': 'difficult',
      'facile': 'easy',
      'ciao': 'hello',
      'grazie': 'thank you',
      'prego': 'you\'re welcome',
      'famiglia': 'family',
      'amico': 'friend',
      'lavoro': 'work',
      'mangiare': 'to eat',
      'bere': 'to drink',
      'dormire': 'to sleep',
      'tempo': 'time',
      'oggi': 'today',
      'domani': 'tomorrow',
      'ieri': 'yesterday',
      'mare': 'sea',
      'acqua': 'water',
      'sabbia': 'sand',
      'pranzo': 'lunch',
      'mangiato': 'eaten',
      'costruito': 'built',
      'castelli': 'castles',
      'nuotato': 'swam',
      'giornata': 'day',
      'perfetta': 'perfect',
      'sono': 'I am',
      'andato': 'went',
      'con': 'with',
      'mia': 'my',
      'era': 'was',
      'calda': 'hot',
      'pulita': 'clean',
      'abbiamo': 'we have',
      'per': 'for',
      'buon': 'good',
      'gelato': 'ice cream',
      'stata': 'been',
      'una': 'a/an',
      'gatto': 'cat',
      'dorme': 'sleeps',
      'divano': 'sofa',
      'molto': 'very',
      'pigro': 'lazy',
      'piace': 'likes',
      'stare': 'to stay',
      'caldo': 'warm',
      'sua': 'his/her',
      'padrona': 'owner',
      'porta': 'brings',
      'sempre': 'always',
      'del': 'of the',
      'cibo': 'food',
      'lui': 'he',
      'miagola': 'meows',
      'quando': 'when',
      'ha': 'has',
      'fame': 'hunger',
      'tutti': 'everyone',
      'in': 'in',
      'lo': 'him',
      'amano': 'love',
      'bello': 'beautiful',
      'grande': 'big',
      'piccolo': 'small',
      'nuovo': 'new',
      'vecchio': 'old'
    };
    
    const lowerText = text.toLowerCase();
    return mockTranslations[lowerText] || `[Traduzione: ${text}]`;
  }

  displayTranslationPopup(originalText, translation, x, y, source) {
    console.log('🎪 Creando popup:', { originalText, translation, x, y, source });
    
    this.hideCurrentPopup();
    
    const popup = document.createElement('div');
    popup.className = 'translation-popup';
    popup.innerHTML = `
      <div class="translation-popup-header">
        <span class="original-text">${originalText}</span>
        <button class="popup-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="translation-text">${translation}</div>
      <div class="translation-actions">
        <button class="play-audio" onclick="simpleTranslationSystem.playAudio('${originalText}', 'it')">🔊 IT</button>
        <button class="save-word" onclick="simpleTranslationSystem.saveToPersonalDictionary('${originalText}', '${translation}')">💾</button>
      </div>
      <div class="translation-source">${source === 'cache' ? '📚 Salvato' : '🌐 Mock'}</div>
    `;
    
    popup.style.position = 'fixed';
    popup.style.left = `${Math.min(x, window.innerWidth - 250)}px`;
    popup.style.top = `${Math.max(y - 100, 10)}px`;
    popup.style.zIndex = '10001';
    
    document.body.appendChild(popup);
    this.currentPopup = popup;
    
    console.log('✅ Popup creato e aggiunto al DOM');
    
    setTimeout(() => {
      if (popup.parentNode && !popup.matches(':hover')) {
        popup.remove();
      }
    }, 8000);
  }

  hideCurrentPopup() {
    if (this.currentPopup) {
      this.currentPopup.remove();
      this.currentPopup = null;
    }
    
    const buttons = document.querySelectorAll('.translation-button');
    buttons.forEach(btn => btn.remove());
  }

  playAudio(text, language) {
    console.log('🔊 Playing audio:', text, language);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'it' ? 'it-IT' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  }

  loadPersonalDictionary() {
    try {
      return JSON.parse(localStorage.getItem('translation_personal_dictionary') || '{}');
    } catch {
      return {};
    }
  }

  saveToPersonalDictionary(original, translation) {
    this.personalDictionary[original.toLowerCase()] = {
      translation,
      addedAt: new Date().toISOString(),
      usageCount: (this.personalDictionary[original.toLowerCase()]?.usageCount || 0) + 1
    };
    
    localStorage.setItem('translation_personal_dictionary', JSON.stringify(this.personalDictionary));
    console.log(`💾 Salvato: ${original} → ${translation}`);
  }

  getCachedTranslation(word) {
    const entry = this.personalDictionary[word.toLowerCase()];
    return entry ? entry.translation : null;
  }

  getPersonalDictionary() {
    return this.personalDictionary;
  }

  getMostTranslatedWords(limit = 10) {
    return Object.entries(this.personalDictionary)
      .sort(([,a], [,b]) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, limit)
      .map(([word, data]) => ({ word, count: data.usageCount || 0 }));
  }

  enableSmartDisable() {
    this.isSmartDisabled = true;
    this.removeEventListeners();
    this.hideCurrentPopup();
    console.log('🎯 Smart Disable attivato');
  }

  disableSmartDisable() {
    this.isSmartDisabled = false;
    if (this.isActive) {
      this.setupEventListeners();
    }
    console.log('✅ Smart Disable disattivato');
  }

  mapLanguageCode(userLanguageCode) {
    const languageMap = {
      'al': 'sq', 'ko': 'sq', 'hi': 'hi', 'ar': 'ar',
      'zh': 'zh', 'ro': 'ro', 'es': 'es', 'pt': 'pt', 'uk': 'uk'
    };
    return languageMap[userLanguageCode] || 'en';
  }
}

// Istanza globale
const simpleTranslationSystem = new SimpleTranslationSystem();

// Esponi globalmente per i pulsanti
window.simpleTranslationSystem = simpleTranslationSystem;

const EnhancedSupportoLinguistico = ({ currentSection, isTestMode = false }) => {
  const { user } = useContext(UserContext) || {};
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const [personalDictionary, setPersonalDictionary] = useState({});
  const [mostUsedWords, setMostUsedWords] = useState([]);

  useEffect(() => {
    console.log('🔍 DEBUG COMPLETO:', {
      isTestMode,
      user,
      currentSection,
      pathname: window.location.pathname,
      isSystemActive: simpleTranslationSystem.isActive,
      isSmartDisabled: simpleTranslationSystem.isSmartDisabled
    });
    
    if (!isTestMode && user) {
      simpleTranslationSystem.initialize({ user });
      loadTranslationData();
    }
    
    return () => {
      if (simpleTranslationSystem) {
        simpleTranslationSystem.removeEventListeners();
      }
    };
  }, [user, isTestMode, currentSection]);

  const loadTranslationData = () => {
    setPersonalDictionary(simpleTranslationSystem.getPersonalDictionary());
    setMostUsedWords(simpleTranslationSystem.getMostTranslatedWords(5));
  };

  const toggleWidget = () => {
    setIsWidgetVisible(!isWidgetVisible);
    if (!isWidgetVisible) {
      loadTranslationData();
    }
  };

  const closeWidget = () => {
    setIsWidgetVisible(false);
  };

  if (isTestMode || !user) {
    return null;
  }

  return (
    <div className="enhanced-supporto-container">
      {/* Indicatore stato */}
      <div className={`translation-status ${simpleTranslationSystem.isActive && !simpleTranslationSystem.isSmartDisabled ? 'active' : 'inactive'}`}>
        <div className="status-indicator">
          {simpleTranslationSystem.isActive && !simpleTranslationSystem.isSmartDisabled ? (
            <>
              <span className="status-dot active"></span>
              <span className="status-text">Traduzione attiva</span>
            </>
          ) : (
            <>
              <span className="status-dot inactive"></span>
              <span className="status-text">Traduzione disattiva</span>
            </>
          )}
        </div>
        
        {simpleTranslationSystem.isActive && !simpleTranslationSystem.isSmartDisabled && (
          <div className="usage-hint">
            💡 Passa il mouse su una parola o seleziona del testo per tradurre
          </div>
        )}
      </div>

      {/* Widget avanzato */}
      {isWidgetVisible && (
        <div className="enhanced-supporto-widget">
          <SupportoLinguistico 
            onClose={closeWidget} 
            currentSection={currentSection} 
          />
          
          {/* Pannello statistiche */}
          <div className="translation-stats-panel">
            <h4>📊 Le tue statistiche</h4>
            
            {mostUsedWords.length > 0 && (
              <div className="most-used-section">
                <h5>🔥 Parole più cercate</h5>
                <div className="words-list">
                  {mostUsedWords.map(({ word, count }) => (
                    <div key={word} className="word-stat">
                      <span className="word">{word}</span>
                      <span className="count">{count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {Object.keys(personalDictionary).length > 0 && (
              <div className="personal-dict-section">
                <h5>💾 Dizionario Personale ({Object.keys(personalDictionary).length})</h5>
                <div className="dict-preview">
                  {Object.entries(personalDictionary).slice(0, 3).map(([word, data]) => (
                    <div key={word} className="dict-item">
                      <span className="word">{word}</span>
                      <span className="translation">{data.translation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="advanced-controls">
              <button 
                className="control-btn"
                onClick={() => simpleTranslationSystem.isSmartDisabled 
                  ? simpleTranslationSystem.disableSmartDisable() 
                  : simpleTranslationSystem.enableSmartDisable()}
              >
                🎯 {simpleTranslationSystem.isSmartDisabled ? 'Riattiva' : 'Modalità Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pulsante trigger */}
      <button 
        className={`enhanced-trigger-button ${Object.keys(personalDictionary).length > 0 ? 'has-stats' : ''}`}
        onClick={toggleWidget}
        title="Supporto Linguistico Avanzato"
      >
        <span className="trigger-icon">🌍</span>
        <span className="trigger-text">Supporto</span>
        {Object.keys(personalDictionary).length > 0 && (
          <span className="stats-badge">
            {Object.keys(personalDictionary).length}
          </span>
        )}
      </button>
    </div>
  );
};

export default EnhancedSupportoLinguistico;