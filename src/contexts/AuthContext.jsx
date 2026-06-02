import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper: extract a display name from whatever shape the backend returns
  const extractName = (data) => {
    if (!data) return null;
    // Try all common field names the backend might use
    return (
      data.username ||
      data.first_name ||
      data.firstName ||
      data.name?.split(' ')[0] ||
      data.email?.split('@')[0] ||
      null
    );
  };

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

      // Support both flat {token, role, ...} and nested {token, user: {...}}
      const token = res.data?.token;
      let userData = res.data?.user || res.data;

      // If the login response has no name fields, fetch the full profile
      if (token && !extractName(userData)) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const meRes = await authAPI.me();
          if (meRes.data) {
            userData = { ...userData, ...meRes.data };
          }
        } catch {
          // /auth/me failed — proceed with what we have
        }
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(token);
      setUser(userData);

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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
        displayName: extractName(user) || 'there',
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