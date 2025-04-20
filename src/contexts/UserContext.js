import React, { useContext } from 'react';

export const UserContext = React.createContext();

export const UserProvider = ({ children, value }) => {
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Nuovo hook che mancava
export const useUser = () => {
  return useContext(UserContext);
};

export default UserContext;