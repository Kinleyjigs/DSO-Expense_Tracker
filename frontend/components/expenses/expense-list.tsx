'use client';

import { useState, useMemo } from 'react';
import { useExpenseStore } from '@/lib/store';
import { CATEGORIES, type Expense } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseForm } from './expense-form';
import { format } from 'date-fns';
import {
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  UtensilsCrossed,
  Car,
  Film,
  ShoppingBag,
  Zap,
  Heart,
  GraduationCap,
  Plane,
  CreditCard,
  MoreHorizontal,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  UtensilsCrossed: <UtensilsCrossed className="h-4 w-4" />,
  Car: <Car className="h-4 w-4" />,
  Film: <Film className="h-4 w-4" />,
  ShoppingBag: <ShoppingBag className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  Heart: <Heart className="h-4 w-4" />,
  GraduationCap: <GraduationCap className="h-4 w-4" />,
  Plane: <Plane className="h-4 w-4" />,
  CreditCard: <CreditCard className="h-4 w-4" />,
  MoreHorizontal: <MoreHorizontal className="h-4 w-4" />,
};

type SortField = 'date' | 'amount' | 'description' | 'category';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export function ExpenseList() {
  const expenses = useExpenseStore((state) => state.expenses);
  const deleteExpense = useExpenseStore((state) => state.deleteExpense);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(query) ||
          e.category.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [expenses, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedExpenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = filteredAndSortedExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteExpense(deleteId);
      setDeleteId(null);
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  return (
    <>
      <Card className="bg-card/50 border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-semibold">All Expenses</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredAndSortedExpenses.length} total expenses
            </p>
          </div>
          <ExpenseForm />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 bg-input/50"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                  <TableHead className="text-muted-foreground">
                    <SortButton field="date">Date</SortButton>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <SortButton field="description">Description</SortButton>
                  </TableHead>
                  <TableHead className="text-muted-foreground">
                    <SortButton field="category">Category</SortButton>
                  </TableHead>
                  <TableHead className="text-muted-foreground text-right">
                    <SortButton field="amount">Amount</SortButton>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedExpenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? 'No expenses match your search' : 'No expenses yet'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedExpenses.map((expense) => {
                    const category = CATEGORIES.find((c) => c.id === expense.category);
                    return (
                      <TableRow key={expense.id} className="hover:bg-secondary/20">
                        <TableCell className="font-medium">
                          {format(new Date(expense.date), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="p-1.5 rounded"
                              style={{ backgroundColor: `color-mix(in oklch, ${category?.color || 'var(--muted)'} 20%, transparent)` }}
                            >
                              <div style={{ color: category?.color }}>
                                {iconMap[category?.icon || 'MoreHorizontal']}
                              </div>
                            </div>
                            <span className="text-sm">{category?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${expense.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingExpense(expense)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteId(expense.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingExpense && (
        <ExpenseForm
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          trigger={<span className="hidden" />}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
