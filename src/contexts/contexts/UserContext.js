import React, { createContext, useContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children, value }) => {
  const [defaultUser] = useState({
    name: 'Studente',
    level: 'A1',
    preferredLanguage: 'it'
  });

  const contextValue = value || {
    userProfile: defaultUser,
    setUserProfile: () => {},
    loading: false
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    return {
      userProfile: { name: 'Studente', level: 'A1', preferredLanguage: 'it' },
      setUserProfile: () => {},
      loading: false
    };
  }
  return context;
};