'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/auth';
import { LoginInput, UserCreateInput, User } from '@/types';

const AUTH_KEYS = {
  me: ['me'] as const,
};

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser, setAuthenticated, logout: storeLogout } = useAuthStore();

  // Get current user
  const { data: user, isLoading } = useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: async () => {
      const token = Cookies.get('accessToken');
      if (!token) return null;
      
      try {
        const response = await api.get('/auth/me');
        const userData = response.data.data;
        setUser(userData);
        setAuthenticated(true);
        return userData as User;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post('/auth/login', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      Cookies.set('accessToken', data.accessToken, { expires: 7 });
      Cookies.set('refreshToken', data.refreshToken, { expires: 30 });
      setUser(data.user);
      setAuthenticated(true);
      queryClient.setQueryData(AUTH_KEYS.me, data.user);
      router.push('/dashboard');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: UserCreateInput) => {
      const response = await api.post('/auth/register', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      Cookies.set('accessToken', data.accessToken, { expires: 7 });
      Cookies.set('refreshToken', data.refreshToken, { expires: 30 });
      setUser(data.user);
      setAuthenticated(true);
      queryClient.setQueryData(AUTH_KEYS.me, data.user);
      router.push('/dashboard');
    },
  });

  // Logout
  const logout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    storeLogout();
    queryClient.clear();
    router.push('/login');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};