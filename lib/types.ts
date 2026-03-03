export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
  recurring: boolean;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  limit: number;
  spent: number;
  color: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  recurrence: 'weekly' | 'monthly' | 'yearly';
  paid: boolean;
  reminder: boolean;
}

export interface Goal {
  id: string;
  name: string;
  type: 'short-term' | 'long-term';
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  contributions: Contribution[];
  milestones: number[];
}

export interface Contribution {
  id: string;
  amount: number;
  date: string;
}

export interface UserProfile {
  name: string;
  currency: string;
  monthlyIncome: number;
  onboardingComplete: boolean;
}
