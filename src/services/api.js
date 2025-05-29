/**
 * Servizio di base per le chiamate API
 */
const API_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Wrapper per fetch con gestione degli errori e headers comuni
 * @param {string} endpoint - Endpoint API senza il prefisso /api
 * @param {Object} options - Opzioni fetch
 * @returns {Promise<any>} - Risposta JSON
 */
export async function fetchApi(endpoint, options = {}) {
  // Imposta gli headers di default
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Costruisci l'URL completo
  const url = `${API_URL}/${endpoint}`;

  try {
    // Esegui la chiamata fetch
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Verifica se la risposta è ok (status 200-299)
    if (!response.ok) {
      // Prova a ottenere il messaggio di errore dal JSON se disponibile
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      } catch (jsonError) {
        // Se non puoi analizzare il JSON, usa un errore generico
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }

    // Per richieste HEAD o DELETE potrebbe non esserci un body
    if (options.method === 'HEAD' || response.status === 204) {
      return null;
    }

    // Altrimenti, restituisci il JSON
    return await response.json();
  } catch (error) {
    // Cattura errori di rete o altri errori
    console.error('API call failed:', error);
    throw error;
  }
}

/**
 * Metodi helper per diverse tipologie di chiamate
 */
export const api = {
  get: (endpoint, options = {}) => 
    fetchApi(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, data, options = {}) => 
    fetchApi(endpoint, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  
  put: (endpoint, data, options = {}) => 
    fetchApi(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  
  delete: (endpoint, options = {}) => 
    fetchApi(endpoint, { ...options, method: 'DELETE' }),
};

export default api;