'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export const useUser = () => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: { first_name?: string; last_name?: string; currency?: string }) => {
      const response = await api.patch('/users/profile', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error: any) => {
      console.error('Update profile error:', error.response?.data || error.message);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      console.log('🔐 Sending password change request:', { currentPassword, newPassword });
      const response = await api.post('/users/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('✅ Password change success:', data);
    },
    onError: (error: any) => {
      console.error('❌ Password change error:', error.response?.data || error.message);
    },
  });

  return {
    updateProfile: updateMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  };
};