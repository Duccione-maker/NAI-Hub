import api from './api';

/**
 * Servizio per le interazioni con l'AI
 */
const aiService = {
  /**
   * Valuta la risposta dell'utente a un testo
   * @param {string} text - Testo originale
   * @param {string} userResponse - Risposta dell'utente
   * @param {string} type - Tipo di valutazione ('reading', 'writing', 'onboarding')
   * @returns {Promise<Object>} Risultato della valutazione
   */
  evaluateResponse: async (text, userResponse, type) => {
    return api.post('ai/evaluate', {
      text,
      userResponse,
      type
    });
  },

  /**
   * Ottiene suggerimenti personalizzati per l'apprendimento
   * @param {string} level - Livello dell'utente (A1, A2, B1, etc.)
   * @param {Array} [interests] - Interessi dell'utente (opzionale)
   * @param {Array} [learningHistory] - Storico dell'apprendimento (opzionale)
   * @returns {Promise<Object>} Suggerimenti
   */
  getSuggestions: async (level, interests = [], learningHistory = []) => {
    return api.post('ai/suggest', {
      level,
      interests,
      learningHistory
    });
  },

  /**
   * Valuta il test di livello iniziale
   * @param {Array|string} responses - Risposte dell'utente al test
   * @returns {Promise<Object>} Livello valutato e feedback
   */
  evaluateOnboarding: async (responses) => {
    return api.post('ai/evaluate', {
      userResponse: responses,
      type: 'onboarding'
    });
  }
};

export default aiService;