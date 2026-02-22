import { format, parseISO } from 'date-fns';

export const formatCurrency = (amount: number, currency: string = 'ETB'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: string | Date, formatStr: string = 'MMM dd, yyyy'): string => {
  if (typeof date === 'string') {
    return format(parseISO(date), formatStr);
  }
  return format(date, formatStr);
};

export const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100) / 100}%`;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};