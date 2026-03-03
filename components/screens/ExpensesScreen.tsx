import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { WindowCard } from '@/components/ui/WindowCard';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroInput } from '@/components/ui/RetroInput';
import { DialogPopup } from '@/components/ui/DialogPopup';
import { RetroDropdown } from '@/components/ui/RetroDropdown';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { useAppContext } from '@/lib/store';
import { Search, Trash2, Edit2 } from 'lucide-react-native';

export function ExpensesScreen() {
  const { expenses, categories, addExpense, deleteExpense, profile } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // New expense form state
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newCatDropdownOpen, setNewCatDropdownOpen] = useState(false);

  const categoryNames = categories.map(c => c.name);
  const categoryMap = Object.fromEntries(categories.map(c => [c.name, c]));

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch = e.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterCategory === 'All' || e.category === filterCategory;
      return matchesSearch && matchesFilter;
    });
  }, [expenses, searchQuery, filterCategory]);

  // Category breakdown for donut chart
  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    expenses.forEach(e => {
      breakdown[e.category] = (breakdown[e.category] || 0) + e.amount;
    });
    return Object.entries(breakdown)
      .map(([name, amount]) => ({
        name,
        amount,
        color: categoryMap[name]?.color || '#E8A87C',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, categoryMap]);

  const totalExpenses = categoryBreakdown.reduce((sum, c) => sum + c.amount, 0);

  const handleAddExpense = () => {
    if (!newAmount || !newCategory) return;
    addExpense({
      amount: parseFloat(newAmount),
      category: newCategory,
      date: new Date().toISOString().split('T')[0],
      note: newNote || 'Expense',
      recurring: false,
    });
    setNewAmount('');
    setNewCategory('');
    setNewNote('');
    setShowAddDialog(false);
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: '#F5EFE0' }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Quick Entry Card */}
      <WindowCard title="➕ Quick Add Expense" className="mb-4" titleColor="#E8A87C">
        <View className="flex-row gap-2">
          <View className="flex-1">
            <RetroInput
              value={newAmount}
              onChangeText={setNewAmount}
              placeholder="Amount"
              keyboardType="decimal-pad"
            />
          </View>
          <View className="flex-1">
            <RetroDropdown
              value={newCategory}
              options={categoryNames}
              onSelect={setNewCategory}
              isOpen={newCatDropdownOpen}
              onToggle={() => setNewCatDropdownOpen(!newCatDropdownOpen)}
            />
          </View>
        </View>
        <RetroInput
          value={newNote}
          onChangeText={setNewNote}
          placeholder="Note (optional)"
        />
        <RetroButton
          title="Add Expense"
          onPress={handleAddExpense}
          variant="primary"
          disabled={!newAmount || !newCategory}
        />
      </WindowCard>

      {/* Search & Filter */}
      <WindowCard title="🔍 Search & Filter" className="mb-4" titleColor="#C9B8E8">
        <View className="flex-row items-center gap-2 mb-3">
          <View
            className="flex-1 flex-row items-center rounded-md px-3"
            style={{
              borderWidth: 2,
              borderColor: '#2C2416',
              backgroundColor: '#FFFFFF',
            }}
          >
            <Search size={16} color="#7A6A52" strokeWidth={2} />
            <View className="flex-1">
              <RetroInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search expenses..."
              />
            </View>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {['All', ...categoryNames].map(cat => (
              <Pressable
                key={cat}
                onPress={() => setFilterCategory(cat)}
                className="px-3 py-1.5 rounded-md"
                style={{
                  borderWidth: 1.5,
                  borderColor: filterCategory === cat ? '#E8A87C' : '#2C2416',
                  backgroundColor: filterCategory === cat ? '#E8A87C' : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'SpaceGrotesk_500Medium',
                    fontSize: 12,
                    color: filterCategory === cat ? '#FFFFFF' : '#2C2416',
                  }}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </WindowCard>

      {/* Graphical Breakdown */}
      <WindowCard title="🍩 Spending Breakdown" className="mb-4" titleColor="#E8A0BF">
        {/* Simple flat donut representation using bars */}
        <View className="mb-3">
          <View
            className="flex-row rounded-md overflow-hidden"
            style={{ height: 24, borderWidth: 1.5, borderColor: '#2C2416' }}
          >
            {categoryBreakdown.map((cat, i) => {
              const width = totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0;
              return (
                <View
                  key={cat.name}
                  style={{
                    width: `${width}%`,
                    backgroundColor: cat.color,
                    borderRightWidth: i < categoryBreakdown.length - 1 ? 1 : 0,
                    borderRightColor: '#2C2416',
                  }}
                />
              );
            })}
          </View>
        </View>
        {/* Legend */}
        <View className="flex-row flex-wrap gap-3">
          {categoryBreakdown.map(cat => (
            <View key={cat.name} className="flex-row items-center gap-1.5">
              <View
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: cat.color, borderWidth: 1, borderColor: '#2C2416' }}
              />
              <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 11, color: '#2C2416' }}>
                {cat.name}
              </Text>
              <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 11, color: '#7A6A52' }}>
                {profile.currency}{cat.amount.toFixed(0)}
              </Text>
            </View>
          ))}
        </View>
      </WindowCard>

      {/* Expense History */}
      <WindowCard title="📜 Expense History" titleColor="#E8A87C">
        {filteredExpenses.length === 0 ? (
          <Text
            style={{
              fontFamily: 'SpaceGrotesk_400Regular',
              fontSize: 14,
              color: '#7A6A52',
              textAlign: 'center',
              paddingVertical: 20,
            }}
          >
            No expenses found
          </Text>
        ) : (
          filteredExpenses.map((expense, index) => {
            const cat = categoryMap[expense.category];
            return (
              <View
                key={expense.id}
                className="flex-row items-center py-3 px-2"
                style={{
                  backgroundColor: index % 2 === 0 ? '#FDF6E8' : '#F5EFE0',
                  borderRadius: 4,
                }}
              >
                <View
                  className="w-8 h-8 rounded-md items-center justify-center mr-3"
                  style={{
                    backgroundColor: (cat?.color || '#E8A87C') + '30',
                    borderWidth: 1,
                    borderColor: cat?.color || '#E8A87C',
                  }}
                >
                  <CategoryIcon name={cat?.icon || 'dollar-sign'} size={14} color={cat?.color || '#E8A87C'} />
                </View>
                <View className="flex-1">
                  <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', fontSize: 14, color: '#2C2416' }}>
                    {expense.note}
                  </Text>
                  <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 11, color: '#7A6A52' }}>
                    {expense.category} • {expense.date}
                    {expense.recurring && ' 🔄'}
                  </Text>
                </View>
                <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 15, color: '#2C2416', marginRight: 8 }}>
                  -{profile.currency}{expense.amount.toFixed(2)}
                </Text>
                <Pressable
                  onPress={() => deleteExpense(expense.id)}
                  className="p-1.5"
                >
                  <Trash2 size={14} color="#E8A0BF" strokeWidth={2} />
                </Pressable>
              </View>
            );
          })
        )}
      </WindowCard>
    </ScrollView>
  );
}
