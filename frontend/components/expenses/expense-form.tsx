'use client';

import { useState } from 'react';
import { useExpenseStore, categoryIcons } from '@/lib/store';
import type { Expense, Category } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Plus, CalendarIcon, Loader2 } from 'lucide-react';

interface ExpenseFormProps {
  expense?: Expense;
  onClose?: () => void;
  trigger?: React.ReactNode;
}

export function ExpenseForm({ expense, onClose, trigger }: ExpenseFormProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(expense?.amount.toString() || '');
  const [description, setDescription] = useState(expense?.description || '');
  const [categoryId, setCategoryId] = useState(expense?.categoryId || '');
  const [date, setDate] = useState<Date>(expense?.date ? new Date(expense.date) : new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { addExpense, updateExpense, categories } = useExpenseStore();

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategoryId('');
    setDate(new Date());
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }
    if (!categoryId) {
      setError('Please select a category');
      return;
    }

    setIsSubmitting(true);

    let success = false;
    if (expense) {
      success = await updateExpense(expense.id, {
        amount: parseFloat(amount),
        description: description.trim(),
        categoryId,
        date: date.toISOString(),
      });
    } else {
      success = await addExpense({
        amount: parseFloat(amount),
        description: description.trim(),
        categoryId,
        date: date.toISOString(),
      });
    }

    setIsSubmitting(false);
    
    if (success) {
      resetForm();
      setOpen(false);
      onClose?.();
    } else {
      setError('Failed to save expense. Please try again.');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogDescription>
            {expense ? 'Update the expense details below.' : 'Enter the details of your expense below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 bg-input/50"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What was this expense for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-input/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="bg-input/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <span className="flex items-center gap-2">
                        <span>{categoryIcons[cat.icon] || '📁'}</span>
                        <span>{cat.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal bg-input/50',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : expense ? (
                'Update'
              ) : (
                'Add Expense'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
