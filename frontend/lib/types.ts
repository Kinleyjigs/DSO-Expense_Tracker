// Re-export API types
export type {
  User,
  Category,
  CategoryWithStats,
  Expense,
  CreateExpenseData,
  CreateCategoryData,
  ExpenseFilters,
  ExpenseStats,
} from './api';

// Default categories
export const CATEGORIES = [
  {
    id: '1',
    name: 'Food & Dining',
    icon: 'UtensilsCrossed',
    color: '#FF6B6B',
  },
  {
    id: '2',
    name: 'Transportation',
    icon: 'Car',
    color: '#4ECDC4',
  },
  {
    id: '3',
    name: 'Entertainment',
    icon: 'Music',
    color: '#45B7D1',
  },
  {
    id: '4',
    name: 'Shopping',
    icon: 'ShoppingBag',
    color: '#F7DC6F',
  },
  {
    id: '5',
    name: 'Health',
    icon: 'Heart',
    color: '#BB8FCE',
  },
  {
    id: '6',
    name: 'Utilities',
    icon: 'Lightbulb',
    color: '#85C1E2',
  },
  {
    id: '7',
    name: 'Education',
    icon: 'BookOpen',
    color: '#82E0AA',
  },
  {
    id: '8',
    name: 'Work',
    icon: 'Briefcase',
    color: '#F5B041',
  },
  {
    id: '9',
    name: 'Subscriptions',
    icon: 'CreditCard',
    color: '#D7BDE2',
  },
  {
    id: '10',
    name: 'Other',
    icon: 'MoreHorizontal',
    color: '#BDC3C7',
  },
];
