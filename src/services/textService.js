import api from './api';

/**
 * Servizio per la gestione dei testi e delle risorse di apprendimento
 */
const textService = {
  /**
   * Ottiene la lista dei testi disponibili
   * @param {string} [level] - Filtra per livello (opzionale)
   * @returns {Promise<Array>} Lista di testi
   */
  getTexts: async (level) => {
    const endpoint = level ? `text/list?level=${level}` : 'text/list';
    return api.get(endpoint);
  },

  /**
   * Ottiene un testo specifico per ID
   * @param {number|string} id - ID del testo
   * @returns {Promise<Object>} Dati completi del testo
   */
  getText: async (id) => {
    return api.get(`text/${id}`);
  },

  /**
   * Aggiunge un nuovo testo
   * @param {Object} textData - Dati del testo (title, content, level, etc.)
   * @returns {Promise<Object>} Testo creato
   */
  addText: async (textData) => {
    return api.post('text', textData);
  },
  
  /**
   * Ottiene testi suggeriti per il livello dell'utente
   * @param {string} level - Livello dell'utente (A1, A2, B1, etc.)
   * @param {Array} [interests] - Interessi dell'utente (opzionale)
   * @returns {Promise<Array>} Testi suggeriti
   */
  getSuggestedTexts: async (level, interests = []) => {
    return api.get(`text/list?level=${level}&suggested=true`);
  }
};

export default textService;