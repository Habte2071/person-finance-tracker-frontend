'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { DashboardStats, MonthlyData, CategorySummary, RecentTransaction } from '@/types';
import { useAuth } from './useAuth'; // Import useAuth

export const useDashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth(); // Get auth state

  const { data: stats, isLoading: isStatsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard', 'stats', user?.id], // Include user.id in key
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data.data as DashboardStats;
    },
    enabled: !!user && !isAuthLoading, // Only fetch when user is authenticated
    staleTime: 30 * 1000, // 30 seconds
  });

  const { data: monthlyTrend, isLoading: isTrendLoading, error: trendError } = useQuery({
    queryKey: ['dashboard', 'trend', user?.id],
    queryFn: async () => {
      const response = await api.get('/dashboard/monthly-trend?months=6');
      return response.data.data as MonthlyData[];
    },
    enabled: !!user && !isAuthLoading,
    staleTime: 30 * 1000,
  });

  const { data: expenseByCategory, isLoading: isCategoryLoading, error: categoryError } = useQuery({
    queryKey: ['dashboard', 'expenses', user?.id],
    queryFn: async () => {
      const response = await api.get('/dashboard/expense-by-category');
      return response.data.data as CategorySummary[];
    },
    enabled: !!user && !isAuthLoading,
    staleTime: 30 * 1000,
  });

  const { data: recentTransactions, isLoading: isRecentLoading, error: recentError } = useQuery({
    queryKey: ['dashboard', 'recent', user?.id],
    queryFn: async () => {
      const response = await api.get('/dashboard/recent-transactions?limit=5');
      return response.data.data as RecentTransaction[];
    },
    enabled: !!user && !isAuthLoading,
    staleTime: 30 * 1000,
  });

  // Debug logging
  if (statsError) console.error('Dashboard stats error:', statsError);
  if (trendError) console.error('Dashboard trend error:', trendError);
  if (categoryError) console.error('Dashboard category error:', categoryError);
  if (recentError) console.error('Dashboard recent error:', recentError);

  return {
    stats,
    monthlyTrend,
    expenseByCategory,
    recentTransactions,
    isLoading: isAuthLoading || isStatsLoading || isTrendLoading || isCategoryLoading || isRecentLoading,
    errors: {
      stats: statsError,
      trend: trendError,
      category: categoryError,
      recent: recentError,
    },
  };
};