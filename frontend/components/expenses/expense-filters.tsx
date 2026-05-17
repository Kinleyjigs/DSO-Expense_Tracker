'use client';

import { useState, useMemo } from 'react';
import { useExpenseStore } from '@/lib/store';
import { CATEGORIES, type ExpenseCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { CalendarIcon, X, Filter, RotateCcw } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

const presetRanges = [
  { label: 'This Month', getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: 'Last Month', getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: 'Last 3 Months', getValue: () => ({ from: startOfMonth(subMonths(new Date(), 2)), to: endOfMonth(new Date()) }) },
  { label: 'Last 6 Months', getValue: () => ({ from: startOfMonth(subMonths(new Date(), 5)), to: endOfMonth(new Date()) }) },
];

export function ExpenseFilters() {
  const { filters, setFilters, resetFilters } = useExpenseStore();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    filters.dateRange ? { from: filters.dateRange.from, to: filters.dateRange.to } : undefined
  );

  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      filters.minAmount !== null ||
      filters.maxAmount !== null ||
      filters.searchQuery !== ''
    );
  }, [filters]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setFilters({ dateRange: { from: range.from, to: range.to } });
    } else if (!range?.from && !range?.to) {
      setFilters({ dateRange: null });
    }
  };

  const handleCategoryToggle = (categoryId: ExpenseCategory) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    setFilters({ categories: newCategories });
  };

  const handleReset = () => {
    resetFilters();
    setDateRange({ from: startOfMonth(subMonths(new Date(), 2)), to: endOfMonth(new Date()) });
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">Filters</CardTitle>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-muted-foreground">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal bg-input/50',
                  !dateRange?.from && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  'Select date range'
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b border-border space-y-2">
                <p className="text-sm font-medium">Quick select</p>
                <div className="flex flex-wrap gap-2">
                  {presetRanges.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const range = preset.getValue();
                        handleDateRangeChange(range);
                      }}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Amount Range */}
        <div className="space-y-2">
          <Label>Amount Range</Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                placeholder="Min"
                value={filters.minAmount ?? ''}
                onChange={(e) => setFilters({ minAmount: e.target.value ? parseFloat(e.target.value) : null })}
                className="pl-7 bg-input/50"
              />
            </div>
            <span className="text-muted-foreground">to</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxAmount ?? ''}
                onChange={(e) => setFilters({ maxAmount: e.target.value ? parseFloat(e.target.value) : null })}
                className="pl-7 bg-input/50"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
              >
                <Checkbox
                  id={category.id}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <label
                  htmlFor={category.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {filters.categories.length > 0 && (
          <div className="space-y-2">
            <Label>Active Category Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.categories.map((catId) => {
                const category = CATEGORIES.find((c) => c.id === catId);
                return (
                  <span
                    key={catId}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {category?.name}
                    <button
                      onClick={() => handleCategoryToggle(catId)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
