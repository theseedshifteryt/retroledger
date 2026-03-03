import React from 'react';
import {
  Utensils, Home, Car, Zap, Music, ShoppingBag,
  Heart, Wifi, Smartphone, GraduationCap, Dumbbell,
  Plane, Gift, Coffee, DollarSign, CreditCard,
  PiggyBank, Target, TrendingUp, Calendar, Bell,
  Search, Plus, Check, AlertTriangle, Star,
  LayoutDashboard, Wallet, Receipt, Flag,
} from 'lucide-react-native';

const iconMap: Record<string, any> = {
  'utensils': Utensils,
  'home': Home,
  'car': Car,
  'zap': Zap,
  'music': Music,
  'shopping-bag': ShoppingBag,
  'heart': Heart,
  'wifi': Wifi,
  'smartphone': Smartphone,
  'graduation-cap': GraduationCap,
  'dumbbell': Dumbbell,
  'plane': Plane,
  'gift': Gift,
  'coffee': Coffee,
  'dollar-sign': DollarSign,
  'credit-card': CreditCard,
  'piggy-bank': PiggyBank,
  'target': Target,
  'trending-up': TrendingUp,
  'calendar': Calendar,
  'bell': Bell,
  'search': Search,
  'plus': Plus,
  'check': Check,
  'alert-triangle': AlertTriangle,
  'star': Star,
  'dashboard': LayoutDashboard,
  'wallet': Wallet,
  'receipt': Receipt,
  'flag': Flag,
};

interface CategoryIconProps {
  name: string;
  size?: number;
  color?: string;
}

export function CategoryIcon({ name, size = 18, color = '#2C2416' }: CategoryIconProps) {
  const IconComponent = iconMap[name] || DollarSign;
  return <IconComponent size={size} color={color} strokeWidth={2} />;
}

export const availableIcons = Object.keys(iconMap);
