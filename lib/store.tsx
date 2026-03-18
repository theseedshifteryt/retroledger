import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserProfile, Expense, BudgetCategory, Bill, Goal, Contribution } from '@/lib/types';

// Generate simple unique IDs
let idCounter = 0;
const generateId = () => `id_${Date.now()}_${++idCounter}`;

interface AppState {
  profile: UserProfile;
  expenses: Expense[];
  categories: BudgetCategory[];
  bills: Bill[];
  goals: Goal[];
}

interface AppContextType extends AppState {
  updateProfile: (profile: Partial<UserProfile>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<BudgetCategory, 'id'>) => void;
  updateCategory: (id: string, category: Partial<BudgetCategory>) => void;
  deleteCategory: (id: string) => void;
  addBill: (bill: Omit<Bill, 'id'>) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  toggleBillPaid: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'contributions' | 'milestones'>) => void;
  addContribution: (goalId: string, amount: number) => void;
  deleteGoal: (id: string) => void;
}

const defaultCategories: BudgetCategory[] = [
  { id: 'cat_1', name: 'Food', icon: 'utensils', limit: 400, spent: 235, color: '#E8A87C' },
  { id: 'cat_2', name: 'Rent', icon: 'home', limit: 1200, spent: 1200, color: '#C9B8E8' },
  { id: 'cat_3', name: 'Transport', icon: 'car', limit: 200, spent: 120, color: '#A8D5BA' },
  { id: 'cat_4', name: 'Utilities', icon: 'zap', limit: 150, spent: 98, color: '#E8A0BF' },
  { id: 'cat_5', name: 'Entertainment', icon: 'music', limit: 100, spent: 67, color: '#E8A87C' },
  { id: 'cat_6', name: 'Shopping', icon: 'shopping-bag', limit: 200, spent: 145, color: '#C9B8E8' },
];

const defaultExpenses: Expense[] = [
  { id: 'exp_1', amount: 45.50, category: 'Food', date: '2025-01-15', note: 'Grocery shopping', recurring: false },
  { id: 'exp_2', amount: 1200, category: 'Rent', date: '2025-01-01', note: 'Monthly rent', recurring: true },
  { id: 'exp_3', amount: 35, category: 'Transport', date: '2025-01-14', note: 'Gas station', recurring: false },
  { id: 'exp_4', amount: 12.99, category: 'Entertainment', date: '2025-01-13', note: 'Streaming subscription', recurring: true },
  { id: 'exp_5', amount: 67.80, category: 'Utilities', date: '2025-01-10', note: 'Electric bill', recurring: true },
  { id: 'exp_6', amount: 89.00, category: 'Shopping', date: '2025-01-12', note: 'New headphones', recurring: false },
  { id: 'exp_7', amount: 23.50, category: 'Food', date: '2025-01-11', note: 'Restaurant lunch', recurring: false },
  { id: 'exp_8', amount: 55.00, category: 'Transport', date: '2025-01-09', note: 'Uber rides', recurring: false },
];

const defaultBills: Bill[] = [
  { id: 'bill_1', name: 'Rent', amount: 1200, dueDate: '2025-02-01', recurrence: 'monthly', paid: false, reminder: true },
  { id: 'bill_2', name: 'Electric', amount: 85, dueDate: '2025-01-25', recurrence: 'monthly', paid: false, reminder: true },
  { id: 'bill_3', name: 'Internet', amount: 65, dueDate: '2025-01-28', recurrence: 'monthly', paid: true, reminder: true },
  { id: 'bill_4', name: 'Phone Plan', amount: 45, dueDate: '2025-01-20', recurrence: 'monthly', paid: true, reminder: false },
  { id: 'bill_5', name: 'Streaming', amount: 12.99, dueDate: '2025-01-22', recurrence: 'monthly', paid: false, reminder: true },
  { id: 'bill_6', name: 'Insurance', amount: 150, dueDate: '2025-02-05', recurrence: 'monthly', paid: false, reminder: true },
];

const defaultGoals: Goal[] = [
  {
    id: 'goal_1', name: 'Emergency Fund', type: 'short-term', targetAmount: 5000, currentAmount: 2750,
    deadline: '2025-06-30',
    contributions: [
      { id: 'c1', amount: 500, date: '2024-11-01' },
      { id: 'c2', amount: 750, date: '2024-12-01' },
      { id: 'c3', amount: 1000, date: '2025-01-01' },
      { id: 'c4', amount: 500, date: '2025-01-15' },
    ],
    milestones: [25, 50],
  },
  {
    id: 'goal_2', name: 'Vacation Trip', type: 'short-term', targetAmount: 3000, currentAmount: 900,
    deadline: '2025-08-15',
    contributions: [
      { id: 'c5', amount: 400, date: '2024-12-15' },
      { id: 'c6', amount: 500, date: '2025-01-10' },
    ],
    milestones: [25],
  },
  {
    id: 'goal_3', name: 'New Car Down Payment', type: 'long-term', targetAmount: 15000, currentAmount: 4500,
    deadline: '2026-12-31',
    contributions: [
      { id: 'c7', amount: 2000, date: '2024-06-01' },
      { id: 'c8', amount: 1500, date: '2024-09-01' },
      { id: 'c9', amount: 1000, date: '2025-01-01' },
    ],
    milestones: [25],
  },
];

const initialState: AppState = {
  profile: {
    name: 'User',
    currency: '$',
    monthlyIncome: 4500,
    onboardingComplete: true,
    numberFormat: 'us',
  },
  expenses: defaultExpenses,
  categories: defaultCategories,
  bills: defaultBills,
  goals: defaultGoals,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const updateProfile = useCallback((profile: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, ...profile } }));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: generateId() };
    setState(prev => {
      const newCategories = prev.categories.map(cat =>
        cat.name === expense.category
          ? { ...cat, spent: cat.spent + expense.amount }
          : cat
      );
      return {
        ...prev,
        expenses: [newExpense, ...prev.expenses],
        categories: newCategories,
      };
    });
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => e.id === id ? { ...e, ...updates } : e),
    }));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setState(prev => {
      const expense = prev.expenses.find(e => e.id === id);
      const newCategories = expense
        ? prev.categories.map(cat =>
            cat.name === expense.category
              ? { ...cat, spent: Math.max(0, cat.spent - expense.amount) }
              : cat
          )
        : prev.categories;
      return {
        ...prev,
        expenses: prev.expenses.filter(e => e.id !== id),
        categories: newCategories,
      };
    });
  }, []);

  const addCategory = useCallback((category: Omit<BudgetCategory, 'id'>) => {
    setState(prev => ({
      ...prev,
      categories: [...prev.categories, { ...category, id: generateId() }],
    }));
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<BudgetCategory>) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
    }));
  }, []);

  const addBill = useCallback((bill: Omit<Bill, 'id'>) => {
    setState(prev => ({
      ...prev,
      bills: [...prev.bills, { ...bill, id: generateId() }],
    }));
  }, []);

  const updateBill = useCallback((id: string, updates: Partial<Bill>) => {
    setState(prev => ({
      ...prev,
      bills: prev.bills.map(b => b.id === id ? { ...b, ...updates } : b),
    }));
  }, []);

  const deleteBill = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      bills: prev.bills.filter(b => b.id !== id),
    }));
  }, []);

  const toggleBillPaid = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      bills: prev.bills.map(b => b.id === id ? { ...b, paid: !b.paid } : b),
    }));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'contributions' | 'milestones'>) => {
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: generateId(), contributions: [], milestones: [] }],
    }));
  }, []);

  const addContribution = useCallback((goalId: string, amount: number) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => {
        if (g.id !== goalId) return g;
        const newAmount = g.currentAmount + amount;
        const percentage = (newAmount / g.targetAmount) * 100;
        const milestoneThresholds = [25, 50, 75, 100];
        const newMilestones = milestoneThresholds.filter(m => percentage >= m && !g.milestones.includes(m));
        return {
          ...g,
          currentAmount: newAmount,
          contributions: [...g.contributions, { id: generateId(), amount, date: new Date().toISOString().split('T')[0] }],
          milestones: [...g.milestones, ...newMilestones],
        };
      }),
    }));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        updateProfile,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        updateCategory,
        deleteCategory,
        addBill,
        updateBill,
        deleteBill,
        toggleBillPaid,
        addGoal,
        addContribution,
        deleteGoal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
