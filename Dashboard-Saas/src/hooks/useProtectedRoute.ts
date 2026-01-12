import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useProtectedRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
};
