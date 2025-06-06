// TranslationSystem.js - Sistema di traduzione avanzato
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../contexts/contexts/UserContext';
import './TranslationSystem.css';

// Configurazione Google Translate API
const GOOGLE_TRANSLATE_CONFIG = {
  apiKey: process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY || 'YOUR_API_KEY_HERE',
  endpoint: 'https://translation.googleapis.com/language/translate/v2'
};

// Sezioni dove il supporto è ATTIVO (non durante test)
const ACTIVE_SECTIONS = [
  '/lettura-assistita',
  '/esercizi',
  '/scrittura', 
  '/punteggiatura',
  '/registri',
  '/biblioteca',
  '/dashboard'
];

// Sezioni dove il supporto è DISATTIVATO (test di valutazione)
const DISABLED_SECTIONS = [
  '/test-ingresso',
  '/test-livello',
  '/esame',
  '/valutazione'
];

class TranslationSystem {
  constructor() {
    this.isActive = false;
    this.userLanguage = 'en'; // Default fallback
    this.hoverTimeout = null;
    this.currentPopup = null;
    this.personalDictionary = this.loadPersonalDictionary();
    this.usageStats = this.loadUsageStats();
    this.isSmartDisabled = false;
  }

  // === SISTEMA DI ATTIVAZIONE INTELLIGENTE ===
  
  initialize(userContext) {
    console.log('🌍 TranslationSystem: Initializing...');
    
    // Ottieni lingua utente dal contesto
    if (userContext?.user?.motherLanguage) {
      this.userLanguage = this.mapLanguageCode(userContext.user.motherLanguage);
    }
    
    // Verifica se siamo in una sezione appropriata
    this.checkSectionAndActivate();
    
    // Ascolta cambiamenti di routing
    this.setupRouteListener();
    
    // Setup event listeners
    if (this.isActive) {
      this.setupEventListeners();
    }
    
    console.log(`🎯 TranslationSystem: ${this.isActive ? 'ATTIVO' : 'DISATTIVATO'} per sezione corrente`);
  }

  checkSectionAndActivate() {
    const currentPath = window.location.pathname;
    
    // Verifica se siamo in una sezione dove il supporto deve essere disattivato
    const isDisabledSection = DISABLED_SECTIONS.some(section => 
      currentPath.includes(section)
    );
    
    // Verifica se siamo in una sezione attiva
    const isActiveSection = ACTIVE_SECTIONS.some(section => 
      currentPath.includes(section)
    );
    
    // Attiva solo se siamo in sezione appropriata E non disabilitata
    this.isActive = isActiveSection && !isDisabledSection && !this.isSmartDisabled;
    
    console.log(`📍 Sezione: ${currentPath}, Attivo: ${this.isActive}`);
  }

  setupRouteListener() {
    // Ascolta cambiamenti di URL per riattivare/disattivare
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      setTimeout(() => this.checkSectionAndActivate(), 100);
    };
    
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      setTimeout(() => this.checkSectionAndActivate(), 100);
    };
    
    window.addEventListener('popstate', () => {
      setTimeout(() => this.checkSectionAndActivate(), 100);
    });
  }

  // === HOVER TRANSLATION ===
  
  setupEventListeners() {
    if (!this.isActive) return;
    
    // Hover su parole
    document.addEventListener('mouseover', this.handleMouseOver.bind(this));
    document.addEventListener('mouseout', this.handleMouseOut.bind(this));
    
    // Selection + traduzione
    document.addEventListener('mouseup', this.handleTextSelection.bind(this));
    
    // Click fuori per chiudere popup
    document.addEventListener('click', this.handleClickOutside.bind(this));
    
    console.log('✅ TranslationSystem: Event listeners attivati');
  }

  removeEventListeners() {
    document.removeEventListener('mouseover', this.handleMouseOver.bind(this));
    document.removeEventListener('mouseout', this.handleMouseOut.bind(this));
    document.removeEventListener('mouseup', this.handleTextSelection.bind(this));
    document.removeEventListener('click', this.handleClickOutside.bind(this));
    
    console.log('❌ TranslationSystem: Event listeners rimossi');
  }

  handleMouseOver(event) {
    if (!this.isActive || this.isSmartDisabled) return;
    
    const element = event.target;
    
    // Verifica se è un elemento di testo valido
    if (!this.isValidTextElement(element)) return;
    
    // Ottieni la parola sotto il mouse
    const word = this.getWordUnderMouse(element, event);
    if (!word || word.length < 2) return;
    
    // Debounce per evitare troppi hover
    clearTimeout(this.hoverTimeout);
    this.hoverTimeout = setTimeout(() => {
      this.showHoverTranslation(word, event.clientX, event.clientY);
    }, 500); // 500ms delay
  }

  handleMouseOut(event) {
    clearTimeout(this.hoverTimeout);
    
    // Nascondi popup dopo un delay (per permettere di entrarci)
    setTimeout(() => {
      if (this.currentPopup && !this.currentPopup.matches(':hover')) {
        this.hideCurrentPopup();
      }
    }, 300);
  }

  isValidTextElement(element) {
    // Evita elementi di input, bottoni, ecc.
    const invalidTags = ['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'];
    if (invalidTags.includes(element.tagName)) return false;
    
    // Evita elementi del sistema di traduzione stesso
    if (element.closest('.translation-popup') || 
        element.closest('.supporto-linguistico-widget') ||
        element.closest('.translation-button')) return false;
    
    // Deve contenere testo
    return element.textContent && element.textContent.trim().length > 0;
  }

  getWordUnderMouse(element, event) {
    const textContent = element.textContent;
    if (!textContent) return null;
    
    // Semplificato: prendi la prima parola del contenuto
    // In una versione avanzata si userebbe document.caretRangeFromPoint
    const words = textContent.split(/\s+/);
    return words.find(word => word.length > 2) || null;
  }

  async showHoverTranslation(word, x, y) {
    try {
      // Verifica cache/dizionario personale prima
      const cachedTranslation = this.getCachedTranslation(word);
      if (cachedTranslation) {
        this.displayTranslationPopup(word, cachedTranslation, x, y, 'cache');
        return;
      }
      
      // Chiama Google Translate API
      const translation = await this.translateWithGoogle(word);
      if (translation) {
        this.displayTranslationPopup(word, translation, x, y, 'api');
        
        // Salva nel dizionario personale
        this.saveToPersonalDictionary(word, translation);
        
        // Aggiorna statistiche
        this.updateUsageStats(word);
      }
    } catch (error) {
      console.error('❌ Errore traduzione hover:', error);
    }
  }

  // === SELECTION TRANSLATION ===
  
  handleTextSelection(event) {
    if (!this.isActive || this.isSmartDisabled) return;
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText.length < 2) return;
    
    // Rimuovi eventuali popup esistenti
    this.hideCurrentPopup();
    
    // Mostra pulsante "Traduci" vicino alla selezione
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    this.showTranslationButton(selectedText, rect.right + 10, rect.top);
  }

  showTranslationButton(text, x, y) {
    // Rimuovi pulsante esistente
    const existingButton = document.querySelector('.translation-button');
    if (existingButton) existingButton.remove();
    
    // Crea nuovo pulsante
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
        const translation = await this.translateWithGoogle(text);
        if (translation) {
          this.displayTranslationPopup(text, translation, x, y - 50, 'selection');
          this.saveToPersonalDictionary(text, translation);
          this.updateUsageStats(text);
        }
      } catch (error) {
        console.error('❌ Errore traduzione selezione:', error);
      } finally {
        button.remove();
      }
    };
    
    document.body.appendChild(button);
    
    // Rimuovi automaticamente dopo 5 secondi
    setTimeout(() => {
      if (button.parentNode) button.remove();
    }, 5000);
  }

  // === GOOGLE TRANSLATE API ===
  
  async translateWithGoogle(text) {
    try {
      if (!GOOGLE_TRANSLATE_CONFIG.apiKey || GOOGLE_TRANSLATE_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
        // Fallback a mock per testing
        return this.getMockTranslation(text);
      }
      
      const response = await fetch(`${GOOGLE_TRANSLATE_CONFIG.endpoint}?key=${GOOGLE_TRANSLATE_CONFIG.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'it',
          target: this.userLanguage,
          format: 'text'
        })
      });
      
      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      return data.data.translations[0].translatedText;
      
    } catch (error) {
      console.error('❌ Google Translate API Error:', error);
      return this.getMockTranslation(text);
    }
  }

  getMockTranslation(text) {
    // Traduzioni mock per testing
    const mockTranslations = {
      'casa': 'house',
      'libro': 'book', 
      'scuola': 'school',
      'insegnante': 'teacher',
      'studiare': 'to study',
      'imparare': 'to learn',
      'difficile': 'difficult',
      'facile': 'easy'
    };
    
    return mockTranslations[text.toLowerCase()] || `[Mock: ${text}]`;
  }

  // === POPUP DISPLAY ===
  
  displayTranslationPopup(originalText, translation, x, y, source) {
    // Rimuovi popup esistente
    this.hideCurrentPopup();
    
    // Crea popup
    const popup = document.createElement('div');
    popup.className = 'translation-popup';
    popup.innerHTML = `
      <div class="translation-popup-header">
        <span class="original-text">${originalText}</span>
        <button class="popup-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="translation-text">${translation}</div>
      <div class="translation-actions">
        <button class="play-audio" onclick="translationSystem.playAudio('${originalText}', 'it')">🔊 IT</button>
        <button class="play-audio" onclick="translationSystem.playAudio('${translation}', '${this.userLanguage}')">🔊 ${this.userLanguage.toUpperCase()}</button>
        <button class="save-word" onclick="translationSystem.saveToPersonalDictionary('${originalText}', '${translation}')">💾</button>
      </div>
      <div class="translation-source">${source === 'cache' ? '📚 Dizionario' : '🌐 Google Translate'}</div>
    `;
    
    // Posiziona popup
    popup.style.position = 'fixed';
    popup.style.left = `${Math.min(x, window.innerWidth - 250)}px`;
    popup.style.top = `${Math.max(y - 100, 10)}px`;
    popup.style.zIndex = '10001';
    
    document.body.appendChild(popup);
    this.currentPopup = popup;
    
    // Auto-remove dopo 8 secondi
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
    
    // Rimuovi anche eventuali pulsanti traduzione
    const buttons = document.querySelectorAll('.translation-button');
    buttons.forEach(btn => btn.remove());
  }

  handleClickOutside(event) {
    if (!event.target.closest('.translation-popup') && 
        !event.target.closest('.translation-button')) {
      this.hideCurrentPopup();
    }
  }

  // === AUDIO PRONUNCIATION ===
  
  playAudio(text, language) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'it' ? 'it-IT' : `${language}-${language.toUpperCase()}`;
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      console.warn('⚠️ Speech Synthesis non supportato');
    }
  }

  // === PERSONAL DICTIONARY ===
  
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
    console.log(`💾 Salvato in dizionario: ${original} → ${translation}`);
  }

  getCachedTranslation(word) {
    const entry = this.personalDictionary[word.toLowerCase()];
    return entry ? entry.translation : null;
  }

  // === USAGE ANALYTICS ===
  
  loadUsageStats() {
    try {
      return JSON.parse(localStorage.getItem('translation_usage_stats') || '{}');
    } catch {
      return {};
    }
  }

  updateUsageStats(word) {
    const today = new Date().toDateString();
    
    if (!this.usageStats[today]) {
      this.usageStats[today] = {};
    }
    
    this.usageStats[today][word] = (this.usageStats[today][word] || 0) + 1;
    
    localStorage.setItem('translation_usage_stats', JSON.stringify(this.usageStats));
  }

  // === SMART DISABLE ===
  
  showSmartDisablePrompt() {
    if (this.isSmartDisabled) return;
    
    const popup = document.createElement('div');
    popup.className = 'smart-disable-prompt';
    popup.innerHTML = `
      <div class="prompt-content">
        <h3>🎯 Modalità Test</h3>
        <p>Vuoi disattivare il supporto linguistico per testare le tue competenze?</p>
        <div class="prompt-actions">
          <button onclick="translationSystem.enableSmartDisable(); this.parentElement.parentElement.parentElement.remove()">
            ✅ Sì, disattiva
          </button>
          <button onclick="this.parentElement.parentElement.parentElement.remove()">
            ❌ No, mantieni attivo
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
      if (popup.parentNode) popup.remove();
    }, 10000);
  }

  enableSmartDisable() {
    this.isSmartDisabled = true;
    this.removeEventListeners();
    this.hideCurrentPopup();
    
    console.log('🎯 Smart Disable attivato - Supporto linguistico disabilitato');
    
    // Mostra indicatore
    this.showDisabledIndicator();
  }

  disableSmartDisable() {
    this.isSmartDisabled = false;
    if (this.isActive) {
      this.setupEventListeners();
    }
    
    const indicator = document.querySelector('.disabled-indicator');
    if (indicator) indicator.remove();
    
    console.log('✅ Smart Disable disattivato - Supporto linguistico riattivato');
  }

  showDisabledIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'disabled-indicator';
    indicator.innerHTML = `
      <span>🎯 Modalità Test Attiva</span>
      <button onclick="translationSystem.disableSmartDisable(); this.parentElement.remove()">
        Riattiva Supporto
      </button>
    `;
    
    document.body.appendChild(indicator);
  }

  // === UTILITY ===
  
  mapLanguageCode(userLanguageCode) {
    const languageMap = {
      'al': 'sq',    // Albanese
      'ko': 'sq',    // Kosovaro (usa albanese)
      'hi': 'hi',    // Hindi
      'ar': 'ar',    // Arabo
      'zh': 'zh',    // Cinese
      'ro': 'ro',    // Rumeno
      'es': 'es',    // Spagnolo
      'pt': 'pt',    // Portoghese
      'uk': 'uk'     // Ucraino
    };
    
    return languageMap[userLanguageCode] || 'en';
  }

  // === API PUBBLICA ===
  
  getPersonalDictionary() {
    return this.personalDictionary;
  }

  getUsageStats() {
    return this.usageStats;
  }

  getMostTranslatedWords(limit = 10) {
    const allWords = {};
    
    Object.values(this.usageStats).forEach(dayStats => {
      Object.entries(dayStats).forEach(([word, count]) => {
        allWords[word] = (allWords[word] || 0) + count;
      });
    });
    
    return Object.entries(allWords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([word, count]) => ({ word, count }));
  }
}

// Istanza globale
const translationSystem = new TranslationSystem();

// Export per uso in altri componenti
export { TranslationSystem, translationSystem };
export default TranslationSystem;