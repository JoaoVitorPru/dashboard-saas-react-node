import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se há token salvo no localStorage
    const token = localStorage.getItem('authToken');
    setAuthState({
      isAuthenticated: !!token,
      isLoading: false,
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login(email, password);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userEmail', response.user.email);
      setAuthState({ isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setAuthState({ isAuthenticated: false, isLoading: false });
    navigate('/login');
  };

  return {
    ...authState,
    login,
    logout,
  };
};
