// Funzione per recuperare il profilo utente
export const getUserProfile = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/user/profile');
    if (!response.ok) {
      throw new Error('Errore nel recupero del profilo utente');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Funzione per recuperare le statistiche dell'utente
export const getUserStats = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/user/stats');
    if (!response.ok) {
      throw new Error('Errore nel recupero delle statistiche utente');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
};

// Funzione per recuperare le attività recenti
export const getRecentActivities = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/user/recent-activities');
    if (!response.ok) {
      throw new Error('Errore nel recupero delle attività recenti');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
};

/**
 * Aggiorna il profilo dell'utente
 * @param {Object} updatedProfile - Il profilo aggiornato
 * @returns {Promise<Object>} - Il profilo aggiornato dal server
 */
export const updateUserProfile = async (updatedProfile) => {
  try {
    const response = await fetch('http://localhost:3001/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProfile)
    });
    
    if (!response.ok) {
      throw new Error('Errore nell\'aggiornamento del profilo utente');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del profilo:', error);
    
    // Fallback: salva nel localStorage per test e sviluppo
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    
    // Per ora restituiamo il profilo aggiornato per non bloccare l'esperienza utente
    return updatedProfile;
  }
};