'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Account, AccountCreateInput } from '@/types';
import axios from 'axios'; // for type checking

const ACCOUNTS_KEY = 'accounts';

export const useAccounts = () => {
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: [ACCOUNTS_KEY],
    queryFn: async () => {
      const response = await api.get('/accounts');
      // Convert balance from string to number for every account
      return (response.data.data as Account[]).map(acc => ({
        ...acc,
        balance: Number(acc.balance)
      }));
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AccountCreateInput) => {
      try {
        const response = await api.post('/accounts', data);
        return response.data.data;
      } catch (error) {
        // Enhance error logging
        if (axios.isAxiosError(error) && error.response) {
          console.error('Create account failed:', {
            status: error.response.status,
            data: error.response.data,
          });
        }
        throw error;
      }
    },
    onSuccess: (newAccount) => {
      // Immediately update the cache with converted balance
      queryClient.setQueryData([ACCOUNTS_KEY], (old: Account[] | undefined) => {
        const converted = { ...newAccount, balance: Number(newAccount.balance) };
        return old ? [...old, converted] : [converted];
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AccountCreateInput> }) => {
      console.log('Updating account:', { id, data }); // Log payload
      try {
        const response = await api.patch(`/accounts/${id}`, data);
        console.log('Update response:', response.data);
        return response.data.data;
      } catch (error) {
        // Enhanced error logging
        if (axios.isAxiosError(error) && error.response) {
          console.error('Update account failed:', {
            status: error.response.status,
            data: error.response.data,
          });
        }
        throw error;
      }
    },
    onSuccess: (updatedAccount) => {
      queryClient.setQueryData([ACCOUNTS_KEY], (old: Account[] | undefined) => {
        if (!old) return [updatedAccount];
        return old.map(acc =>
          acc.id === updatedAccount.id
            ? { ...updatedAccount, balance: Number(updatedAccount.balance) }
            : acc
        );
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await api.delete(`/accounts/${id}`);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Delete account failed:', {
            status: error.response.status,
            data: error.response.data,
          });
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_KEY] });
    },
  });

  return {
    accounts,
    isLoading,
    createAccount: createMutation.mutateAsync,
    updateAccount: updateMutation.mutateAsync,
    deleteAccount: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};