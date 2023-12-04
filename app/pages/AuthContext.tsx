// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Initialisation du contexte avec des valeurs par défaut
const AuthContext = createContext({
  isLoggedIn: false,
  signIn: () => {},
  signOut: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const signIn = () => setIsLoggedIn(true);
  const signOut = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
