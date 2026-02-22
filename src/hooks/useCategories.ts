'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Category, CategoryCreateInput } from '@/types';

const CATEGORIES_KEY = 'categories';

export const useCategories = (type?: 'income' | 'expense') => {
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: [CATEGORIES_KEY, type],
    queryFn: async () => {
      const params = type ? `?type=${type}` : '';
      const response = await api.get(`/categories${params}`);
      return response.data.data as Category[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CategoryCreateInput) => {
      const response = await api.post('/categories', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CategoryCreateInput> }) => {
      const response = await api.patch(`/categories/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });

  return {
    categories,
    isLoading,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
  };
};