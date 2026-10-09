import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<User>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
  isAdmin: boolean;
  isTeamMember: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('devcraft_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('devcraft_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await authService.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem('devcraft_token');
          setToken(null);
          setUser(null);
        }
      } catch (_err) {
        localStorage.removeItem('devcraft_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const login = async (data: { email: string; password: string }): Promise<User> => {
    const res = await authService.login(data);
    if (res.success && res.token && res.user) {
      localStorage.setItem('devcraft_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Login failed. Please check your credentials.');
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<User> => {
    const res = await authService.register(data);
    if (res.success && res.token && res.user) {
      localStorage.setItem('devcraft_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error(res.message || 'Registration failed.');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (_e) {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('devcraft_token');
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isTeamMember = user?.role === 'ADMIN' || user?.role === 'TEAM_MEMBER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAdmin,
        isTeamMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
