import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD TOKEN & USER
  // =========================

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken) {
      setToken(savedToken);
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${savedToken}`;
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user', e);
      }
    }
  }, []);

  const register = async (data) => {
    setLoading(true);
    try {
      return await authAPI.register(data);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    setLoading(true);

    try {
      const res = await authAPI.login(data);

      // Support both flat response (e.g., {token, role}) and nested response (e.g., {token, user: {role}})
      const token = res.data?.token;
      const userData = res.data?.user || res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(token);
      setUser(userData);

      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${token}`;

      return userData;

    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    delete axios.defaults.headers.common[
      'Authorization'
    ];
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'ADMIN',
        isDriver: user?.role === 'DRIVER',
        register,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =========================
// CUSTOM HOOK
// =========================

export const useAuth = () =>
  useContext(AuthContext);