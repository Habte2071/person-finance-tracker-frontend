'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Budget, BudgetCreateInput } from '@/types';

const BUDGETS_KEY = 'budgets';

export const useBudgets = () => {
  const queryClient = useQueryClient();

  const { data: budgets, isLoading } = useQuery({
    queryKey: [BUDGETS_KEY],
    queryFn: async () => {
      const response = await api.get('/budgets');
      return response.data.data as Budget[];
    },
  });

  const { data: alerts } = useQuery({
    queryKey: [BUDGETS_KEY, 'alerts'],
    queryFn: async () => {
      const response = await api.get('/budgets/alerts');
      return response.data.data as Budget[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: BudgetCreateInput) => {
      const response = await api.post('/budgets', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGETS_KEY] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BudgetCreateInput> }) => {
      const response = await api.patch(`/budgets/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGETS_KEY] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/budgets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BUDGETS_KEY] });
    },
  });

  return {
    budgets,
    alerts,
    isLoading,
    createBudget: createMutation.mutateAsync,
    updateBudget: updateMutation.mutateAsync,
    deleteBudget: deleteMutation.mutateAsync,
  };
};