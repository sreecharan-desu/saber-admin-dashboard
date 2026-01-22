
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'recruiter' | 'admin';
  photo_url?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('saber_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.error('Failed to fetch user', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken: string) => {
    localStorage.setItem('saber_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('saber_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
