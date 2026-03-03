import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { DialogPopup } from '@/components/ui/DialogPopup';
import { RetroInput } from '@/components/ui/RetroInput';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroDropdown } from '@/components/ui/RetroDropdown';
import { useAppContext } from '@/lib/store';

export function QuickAddButton() {
  const { categories, addExpense } = useAppContext();
  const [showDialog, setShowDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);

  const categoryNames = categories.map(c => c.name);

  const handleAdd = () => {
    if (!amount || !category) return;
    addExpense({
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0],
      note: note || 'Quick expense',
      recurring: false,
    });
    setAmount('');
    setCategory('');
    setNote('');
    setShowDialog(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setShowDialog(true)}
        className="absolute items-center justify-center rounded-xl"
        style={({ pressed }) => ({
          bottom: 90,
          right: 20,
          width: 56,
          height: 56,
          backgroundColor: '#E8A87C',
          borderWidth: 2,
          borderColor: '#2C2416',
          shadowColor: '#2C2416',
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: pressed ? 0 : 0.2,
          shadowRadius: 0,
          elevation: pressed ? 0 : 4,
          transform: [{ scale: pressed ? 0.96 : 1 }],
          zIndex: 100,
        })}
      >
        <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>

      <DialogPopup
        visible={showDialog}
        title="Quick Add Expense"
        onClose={() => setShowDialog(false)}
      >
        <RetroInput
          label="Amount"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />
        <RetroDropdown
          label="Category"
          value={category}
          options={categoryNames}
          onSelect={setCategory}
          isOpen={catDropdownOpen}
          onToggle={() => setCatDropdownOpen(!catDropdownOpen)}
        />
        <RetroInput
          label="Note"
          value={note}
          onChangeText={setNote}
          placeholder="What was this for?"
        />
        <View className="flex-row gap-3 mt-4">
          <View className="flex-1">
            <RetroButton title="Cancel" onPress={() => setShowDialog(false)} variant="secondary" />
          </View>
          <View className="flex-1">
            <RetroButton title="Add" onPress={handleAdd} variant="primary" />
          </View>
        </View>
      </DialogPopup>
    </>
  );
}
