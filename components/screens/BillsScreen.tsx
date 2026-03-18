import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { WindowCard } from '@/components/ui/WindowCard';
import { RetroButton } from '@/components/ui/RetroButton';
import { DialogPopup } from '@/components/ui/DialogPopup';
import { RetroInput } from '@/components/ui/RetroInput';
import { RetroDropdown } from '@/components/ui/RetroDropdown';
import { useAppContext } from '@/lib/store';
import { formatCurrency } from '@/lib/formatNumber';
import { ChevronLeft, ChevronRight, AlertTriangle, Check } from 'lucide-react-native';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function BillsScreen() {
  const { bills, addBill, toggleBillPaid, profile } = useAppContext();
  const fmt = profile.numberFormat;
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);

  // New bill form
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDay, setNewDueDay] = useState('');
  const [newRecurrence, setNewRecurrence] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  // Calendar generation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    while (days.length % 7 !== 0) days.push(null);

    return days;
  }, [currentMonth, currentYear]);

  // Bills on specific days
  const billsByDay = useMemo(() => {
    const map: Record<number, typeof bills> = {};
    bills.forEach(bill => {
      const date = new Date(bill.dueDate);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        const day = date.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(bill);
      }
    });
    return map;
  }, [bills, currentMonth, currentYear]);

  const navigateMonth = (dir: number) => {
    let newMonth = currentMonth + dir;
    let newYear = currentYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    if (newMonth < 0) { newMonth = 11; newYear--; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleAddBill = () => {
    if (!newName || !newAmount || !newDueDay) return;
    const dueDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(parseInt(newDueDay)).padStart(2, '0')}`;
    addBill({
      name: newName,
      amount: parseFloat(newAmount),
      dueDate,
      recurrence: newRecurrence,
      paid: false,
      reminder: true,
    });
    setNewName('');
    setNewAmount('');
    setNewDueDay('');
    setShowAddDialog(false);
  };

  const totalDue = bills.filter(b => !b.paid).reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = bills.filter(b => b.paid).reduce((sum, b) => sum + b.amount, 0);

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: '#F5EFE0' }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Summary */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <WindowCard title="💳 Due" titleColor="#E8A0BF">
            <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 20, color: '#E8A0BF' }}>
              {formatCurrency(totalDue, profile.currency, fmt, 0)}
            </Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 11, color: '#7A6A52' }}>
              Unpaid bills
            </Text>
          </WindowCard>
        </View>
        <View className="flex-1">
          <WindowCard title="✅ Paid" titleColor="#A8D5BA">
            <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 20, color: '#A8D5BA' }}>
              {formatCurrency(totalPaid, profile.currency, fmt, 0)}
            </Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 11, color: '#7A6A52' }}>
              Completed
            </Text>
          </WindowCard>
        </View>
      </View>

      {/* Calendar */}
      <WindowCard title="📅 Bills Calendar" className="mb-4" titleColor="#C9B8E8">
        {/* Month Navigation */}
        <View className="flex-row items-center justify-between mb-3">
          <Pressable onPress={() => navigateMonth(-1)} className="p-2">
            <ChevronLeft size={20} color="#2C2416" strokeWidth={2} />
          </Pressable>
          <Text style={{ fontFamily: 'Syne_700Bold', fontSize: 16, color: '#2C2416' }}>
            {MONTHS[currentMonth]} {currentYear}
          </Text>
          <Pressable onPress={() => navigateMonth(1)} className="p-2">
            <ChevronRight size={20} color="#2C2416" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Day Headers */}
        <View className="flex-row mb-2">
          {DAYS.map(day => (
            <View key={day} className="flex-1 items-center">
              <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', fontSize: 11, color: '#7A6A52' }}>
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View className="flex-row flex-wrap">
          {calendarDays.map((day, i) => {
            const dayBills = day ? billsByDay[day] || [] : [];
            const hasBill = dayBills.length > 0;
            const hasOverdue = dayBills.some(b => !b.paid && new Date(b.dueDate) < new Date());
            const allPaid = dayBills.length > 0 && dayBills.every(b => b.paid);
            const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

            return (
              <View
                key={i}
                className="items-center justify-center py-1.5"
                style={{ width: '14.28%' }}
              >
                {day ? (
                  <View
                    className="w-8 h-8 rounded-md items-center justify-center"
                    style={{
                      backgroundColor: isToday ? '#E8A87C20' : 'transparent',
                      borderWidth: isToday ? 1.5 : 0,
                      borderColor: '#E8A87C',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'JetBrainsMono_500Medium',
                        fontSize: 12,
                        color: isToday ? '#E8A87C' : '#2C2416',
                      }}
                    >
                      {day}
                    </Text>
                    {hasBill && (
                      <View
                        className="w-1.5 h-1.5 rounded-full absolute -bottom-0.5"
                        style={{
                          backgroundColor: hasOverdue ? '#E8A0BF' : allPaid ? '#A8D5BA' : '#E8A87C',
                        }}
                      />
                    )}
                  </View>
                ) : (
                  <View className="w-8 h-8" />
                )}
              </View>
            );
          })}
        </View>
      </WindowCard>

      {/* Bills List */}
      <WindowCard title="📋 Bills" titleColor="#E8A87C">
        {bills.map((bill, index) => {
          const isOverdue = !bill.paid && new Date(bill.dueDate) < new Date();
          return (
            <View
              key={bill.id}
              className="flex-row items-center py-3 px-2"
              style={{
                backgroundColor: index % 2 === 0 ? '#FDF6E8' : '#F5EFE0',
                borderRadius: 4,
              }}
            >
              {/* Paid Toggle */}
              <Pressable
                onPress={() => toggleBillPaid(bill.id)}
                className="w-6 h-6 rounded-sm items-center justify-center mr-3"
                style={{
                  borderWidth: 2,
                  borderColor: bill.paid ? '#A8D5BA' : '#2C2416',
                  backgroundColor: bill.paid ? '#A8D5BA' : 'transparent',
                }}
              >
                {bill.paid && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
              </Pressable>

              <View className="flex-1">
                <Text
                  style={{
                    fontFamily: 'SpaceGrotesk_500Medium',
                    fontSize: 14,
                    color: '#2C2416',
                    textDecorationLine: bill.paid ? 'line-through' : 'none',
                    opacity: bill.paid ? 0.6 : 1,
                  }}
                >
                  {bill.name}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 11, color: '#7A6A52' }}>
                    Due {bill.dueDate} • {bill.recurrence}
                  </Text>
                  {isOverdue && (
                    <View className="flex-row items-center gap-0.5">
                      <AlertTriangle size={10} color="#E8A0BF" strokeWidth={2} />
                      <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 10, color: '#E8A0BF' }}>
                        Overdue
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 15, color: bill.paid ? '#A8D5BA' : '#2C2416' }}>
                {formatCurrency(bill.amount, profile.currency, fmt)}
              </Text>
            </View>
          );
        })}

        <RetroButton
          title="+ Add Bill"
          onPress={() => setShowAddDialog(true)}
          variant="secondary"
          size="md"
          className="mt-3"
        />
      </WindowCard>

      {/* Add Bill Dialog */}
      <DialogPopup
        visible={showAddDialog}
        title="Add New Bill"
        onClose={() => setShowAddDialog(false)}
      >
        <RetroInput
          label="Bill Name"
          value={newName}
          onChangeText={setNewName}
          placeholder="e.g., Electric Bill"
        />
        <RetroInput
          label="Amount"
          value={newAmount}
          onChangeText={setNewAmount}
          placeholder="e.g., 85"
          keyboardType="decimal-pad"
        />
        <RetroInput
          label="Due Day of Month"
          value={newDueDay}
          onChangeText={setNewDueDay}
          placeholder="e.g., 15"
          keyboardType="numeric"
        />
        <RetroDropdown
          label="Recurrence"
          value={newRecurrence}
          options={['weekly', 'monthly', 'yearly']}
          onSelect={(v) => setNewRecurrence(v as any)}
          isOpen={recurrenceOpen}
          onToggle={() => setRecurrenceOpen(!recurrenceOpen)}
        />
        <View className="flex-row gap-3 mt-4">
          <View className="flex-1">
            <RetroButton title="Cancel" onPress={() => setShowAddDialog(false)} variant="secondary" />
          </View>
          <View className="flex-1">
            <RetroButton title="OK" onPress={handleAddBill} variant="primary" />
          </View>
        </View>
      </DialogPopup>
    </ScrollView>
  );
}
