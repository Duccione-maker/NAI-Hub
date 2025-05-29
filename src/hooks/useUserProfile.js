import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import userService from '../services/userService';

// Crea un context per il profilo utente
const UserProfileContext = createContext();

/**
 * Provider per il contesto del profilo utente
 */
export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carica il profilo utente
  const loadUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const profile = await userService.getProfile();
      setUserProfile(profile);
    } catch (err) {
      console.error('Errore nel caricamento del profilo:', err);
      setError('Impossibile caricare il profilo utente');
    } finally {
      setLoading(false);
    }
  }, []);

  // Aggiorna il profilo utente
  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await userService.updateProfile(profileData);
      setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error('Errore nell\'aggiornamento del profilo:', err);
      setError('Impossibile aggiornare il profilo utente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carica il profilo al primo render
  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  // Fornisce il context
  const value = {
    userProfile,
    setUserProfile,
    loading,
    error,
    loadUserProfile,
    updateProfile
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};

/**
 * Hook per accedere al profilo utente
 * @returns {Object} Profilo utente e funzioni di utilità
 */
const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  
  if (!context) {
    throw new Error('useUserProfile deve essere utilizzato all\'interno di un UserProfileProvider');
  }
  
  return context;
};

export default useUserProfile;