import React, { createContext, useContext, useState } from 'react';
import { loginUser as apiLogin, signupUser as apiSignup } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lumina_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    if (res.success) {
      setUser(res.user);
      localStorage.setItem('lumina_user', JSON.stringify(res.user));
      localStorage.setItem('lumina_token', res.token);
      closeAuthModal();
      return { success: true };
    } else {
      return { success: false, error: res.error };
    }
  };

  const signup = async (name, email, password) => {
    const res = await apiSignup(name, email, password);
    if (res.success) {
      setUser(res.user);
      localStorage.setItem('lumina_user', JSON.stringify(res.user));
      localStorage.setItem('lumina_token', res.token);
      closeAuthModal();
      return { success: true };
    } else {
      return { success: false, error: res.error };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lumina_user');
    localStorage.removeItem('lumina_token');
  };

  return (
    <AuthContext.Provider value={{ user, isModalOpen, openAuthModal, closeAuthModal, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
