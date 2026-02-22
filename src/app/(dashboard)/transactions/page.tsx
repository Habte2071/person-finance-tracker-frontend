'use client';

import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories } from '@/hooks/useCategories';
import { formatCurrency, formatDate } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { TransactionType } from '@/types';

// Define filter state type
type FilterState = {
  type: TransactionType | undefined;
  accountId: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  page: number | undefined;
};

export default function TransactionsPage() {
  const [filters, setFilters] = useState<FilterState>({
    type: undefined,
    accountId: undefined,
    startDate: undefined,
    endDate: undefined,
    page: undefined,
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();

  const { transactions, meta, isLoading, createTransaction, deleteTransaction } = useTransactions(filters);
  const { accounts } = useAccounts();
  const { categories } = useCategories();

  // Reset filters to default (all undefined)
  const resetFilters: FilterState = {
    type: undefined,
    accountId: undefined,
    startDate: undefined,
    endDate: undefined,
    page: undefined,
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast({ title: 'Transaction deleted' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete transaction',
        variant: 'destructive',
      });
    }
  };

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'expense':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <ArrowUpDown className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-800';
      case 'expense':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              {/* Hide text on extra small screens, show only icon */}
              <span className="hidden sm:inline">Add Transaction</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm
              accounts={accounts || []}
              categories={categories || []}
              onSuccess={() => {
                setIsCreateOpen(false);
                toast({ title: 'Transaction created successfully' });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-xs">Type</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => setFilters({ ...filters, type: value as TransactionType })}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Account</Label>
              <Select
                value={filters.accountId}
                onValueChange={(value) => setFilters({ ...filters, accountId: value })}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All accounts" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">From</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full sm:w-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">To</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full sm:w-[150px]"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setFilters(resetFilters)}
              className="w-full sm:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="whitespace-nowrap">{formatDate(transaction.transaction_date)}</TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{transaction.description}</TableCell>
                    <TableCell>
                      {transaction.category_name && (
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: transaction.category_color }}
                          />
                          <span className="truncate max-w-[100px]">{transaction.category_name}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{transaction.account_name}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(transaction.type)} variant="secondary">
                        <span className="flex items-center gap-1">
                          {getTypeIcon(transaction.type)}
                          {transaction.type}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-semibold whitespace-nowrap ${
                      transaction.type === 'income' ? 'text-green-600' : 
                      transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: meta.totalPages }, (_, i) => (
            <Button
              key={i}
              variant={meta.page === i + 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilters({ ...filters, page: i + 1 })}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function TransactionForm({
  accounts,
  categories,
  onSuccess,
}: {
  accounts: any[];
  categories: any[];
  onSuccess: () => void;
}) {
  const { createTransaction } = useTransactions();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [formData, setFormData] = useState({
    account_id: '',
    category_id: undefined as string | undefined,
    type: 'expense' as TransactionType,
    amount: '',
    description: '',
    transaction_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({ title: 'Please enter a valid positive amount', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await createTransaction({
        ...formData,
        category_id: formData.category_id || undefined,
        amount: amountNum,
      });
      onSuccess();
      setFormData({
        account_id: '',
        category_id: undefined,
        type: 'expense',
        amount: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      setType('expense');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to create transaction',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={type}
            onValueChange={(value) => {
              setType(value as TransactionType);
              setFormData({ ...formData, type: value as TransactionType, category_id: undefined });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Account</Label>
          <Select
            value={formData.account_id}
            onValueChange={(value) => setFormData({ ...formData, account_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Input
          type="date"
          required
          value={formData.transaction_date}
          onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Notes (Optional)</Label>
        <Input
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Transaction'}
      </Button>
    </form>
  );
}