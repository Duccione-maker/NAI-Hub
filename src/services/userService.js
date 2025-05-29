import api from './api';

/**
 * Servizio per la gestione degli utenti e dei profili
 */
const userService = {
  /**
   * Ottiene il profilo dell'utente corrente
   * @returns {Promise<Object>} Dati del profilo utente
   */
  getProfile: async () => {
    return api.get('user/profile');
  },

  /**
   * Aggiorna il profilo dell'utente
   * @param {Object} profileData - Dati da aggiornare (level, progress, etc.)
   * @returns {Promise<Object>} Profilo aggiornato
   */
  updateProfile: async (profileData) => {
    return api.put('user/profile', profileData);
  },

  /**
   * Ottiene lo storico dei progressi dell'utente
   * @returns {Promise<Array>} Array di oggetti progresso
   */
  getProgress: async () => {
    return api.get('user/progress');
  },

  /**
   * Registra un nuovo progresso per l'utente
   * @param {Object} progressData - Dati del progresso (activity, score, etc.)
   * @returns {Promise<Object>} Oggetto progresso creato
   */
  saveProgress: async (progressData) => {
    return api.post('user/progress', progressData);
  },

  /**
   * Aggiorna il livello dell'utente in base all'assessment
   * @param {string} level - Nuovo livello (A1, A2, B1, etc.)
   * @returns {Promise<Object>} Profilo aggiornato
   */
  updateLevel: async (level) => {
    return api.put('user/profile', { level });
  }
};

export default userService;