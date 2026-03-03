import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { WindowCard } from '@/components/ui/WindowCard';
import { SegmentedProgressBar } from '@/components/ui/SegmentedProgressBar';
import { useAppContext } from '@/lib/store';
import { TrendingUp, TrendingDown, DollarSign, Receipt } from 'lucide-react-native';

export function DashboardScreen() {
  const { profile, categories, expenses, bills } = useAppContext();

  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const totalBudget = categories.reduce((sum, c) => sum + c.limit, 0);
  const budgetHealth = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const remaining = profile.monthlyIncome - totalSpent;

  const upcomingBills = bills
    .filter(b => !b.paid)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  // Weekly spending data (mock based on expenses)
  const weeklyData = [
    { label: 'Mon', value: 85 },
    { label: 'Tue', value: 120 },
    { label: 'Wed', value: 45 },
    { label: 'Thu', value: 200 },
    { label: 'Fri', value: 150 },
    { label: 'Sat', value: 95 },
    { label: 'Sun', value: 60 },
  ];
  const maxWeekly = Math.max(...weeklyData.map(d => d.value));

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: '#F5EFE0' }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Income vs Expenses */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <WindowCard title="💰 Income" titleColor="#A8D5BA">
            <View className="flex-row items-center gap-2">
              <TrendingUp size={20} color="#A8D5BA" strokeWidth={2} />
              <Text
                style={{
                  fontFamily: 'JetBrainsMono_500Medium',
                  fontSize: 22,
                  color: '#2C2416',
                }}
              >
                {profile.currency}{profile.monthlyIncome.toLocaleString()}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'SpaceGrotesk_400Regular',
                fontSize: 11,
                color: '#7A6A52',
                marginTop: 4,
              }}
            >
              Monthly income
            </Text>
          </WindowCard>
        </View>
        <View className="flex-1">
          <WindowCard title="📊 Expenses" titleColor="#E8A0BF">
            <View className="flex-row items-center gap-2">
              <TrendingDown size={20} color="#E8A0BF" strokeWidth={2} />
              <Text
                style={{
                  fontFamily: 'JetBrainsMono_500Medium',
                  fontSize: 22,
                  color: '#2C2416',
                }}
              >
                {profile.currency}{totalSpent.toLocaleString()}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'SpaceGrotesk_400Regular',
                fontSize: 11,
                color: '#7A6A52',
                marginTop: 4,
              }}
            >
              Total spent
            </Text>
          </WindowCard>
        </View>
      </View>

      {/* Remaining Balance */}
      <WindowCard title="🏦 Remaining Balance" className="mb-4" titleColor="#C9B8E8">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <DollarSign size={22} color="#C9B8E8" strokeWidth={2} />
            <Text
              style={{
                fontFamily: 'JetBrainsMono_500Medium',
                fontSize: 28,
                color: remaining >= 0 ? '#2C2416' : '#E8A0BF',
              }}
            >
              {profile.currency}{Math.abs(remaining).toLocaleString()}
            </Text>
          </View>
          <View
            className="px-3 py-1 rounded-md"
            style={{
              backgroundColor: remaining >= 0 ? '#A8D5BA30' : '#E8A0BF30',
              borderWidth: 1,
              borderColor: remaining >= 0 ? '#A8D5BA' : '#E8A0BF',
            }}
          >
            <Text
              style={{
                fontFamily: 'SpaceGrotesk_500Medium',
                fontSize: 11,
                color: remaining >= 0 ? '#2C2416' : '#E8A0BF',
              }}
            >
              {remaining >= 0 ? 'On Track' : 'Over Budget'}
            </Text>
          </View>
        </View>
      </WindowCard>

      {/* Budget Health */}
      <WindowCard title="❤️ Budget Health" className="mb-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text
            style={{
              fontFamily: 'SpaceGrotesk_400Regular',
              fontSize: 13,
              color: '#7A6A52',
            }}
          >
            {budgetHealth.toFixed(0)}% of budget used
          </Text>
          <Text
            style={{
              fontFamily: 'JetBrainsMono_500Medium',
              fontSize: 13,
              color: '#2C2416',
            }}
          >
            {profile.currency}{totalSpent.toLocaleString()} / {profile.currency}{totalBudget.toLocaleString()}
          </Text>
        </View>
        <SegmentedProgressBar progress={budgetHealth} segments={12} height={20} />
      </WindowCard>

      {/* Weekly Cash Flow */}
      <WindowCard title="📈 Weekly Cash Flow" className="mb-4" titleColor="#C9B8E8">
        <View className="flex-row items-end justify-between" style={{ height: 120 }}>
          {weeklyData.map((d, i) => {
            const barHeight = maxWeekly > 0 ? (d.value / maxWeekly) * 100 : 0;
            const colors = ['#E8A87C', '#C9B8E8', '#A8D5BA', '#E8A0BF', '#E8A87C', '#C9B8E8', '#A8D5BA'];
            return (
              <View key={d.label} className="items-center flex-1">
                <Text
                  style={{
                    fontFamily: 'JetBrainsMono_500Medium',
                    fontSize: 9,
                    color: '#7A6A52',
                    marginBottom: 4,
                  }}
                >
                  ${d.value}
                </Text>
                <View
                  className="w-6 rounded-t-md"
                  style={{
                    height: barHeight,
                    backgroundColor: colors[i],
                    borderWidth: 1.5,
                    borderColor: '#2C2416',
                    borderBottomWidth: 0,
                    minHeight: 4,
                  }}
                />
                <Text
                  style={{
                    fontFamily: 'SpaceGrotesk_400Regular',
                    fontSize: 10,
                    color: '#7A6A52',
                    marginTop: 4,
                  }}
                >
                  {d.label}
                </Text>
              </View>
            );
          })}
        </View>
      </WindowCard>

      {/* Upcoming Bills */}
      <WindowCard title="📋 Upcoming Bills" titleColor="#E8A87C">
        {upcomingBills.length === 0 ? (
          <Text
            style={{
              fontFamily: 'SpaceGrotesk_400Regular',
              fontSize: 14,
              color: '#7A6A52',
              textAlign: 'center',
              paddingVertical: 16,
            }}
          >
            All bills are paid! 🎉
          </Text>
        ) : (
          upcomingBills.map((bill, index) => {
            const isOverdue = new Date(bill.dueDate) < new Date();
            return (
              <View
                key={bill.id}
                className="flex-row items-center justify-between py-3 px-2"
                style={{
                  backgroundColor: index % 2 === 0 ? '#FDF6E8' : '#F5EFE0',
                  borderRadius: 4,
                }}
              >
                <View className="flex-row items-center gap-2 flex-1">
                  <Receipt size={16} color={isOverdue ? '#E8A0BF' : '#E8A87C'} strokeWidth={2} />
                  <View>
                    <Text
                      style={{
                        fontFamily: 'SpaceGrotesk_500Medium',
                        fontSize: 14,
                        color: '#2C2416',
                      }}
                    >
                      {bill.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'SpaceGrotesk_400Regular',
                        fontSize: 11,
                        color: isOverdue ? '#E8A0BF' : '#7A6A52',
                      }}
                    >
                      Due {bill.dueDate}
                      {isOverdue && ' ⚠️ Overdue'}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontFamily: 'JetBrainsMono_500Medium',
                    fontSize: 14,
                    color: '#2C2416',
                  }}
                >
                  ${bill.amount}
                </Text>
              </View>
            );
          })
        )}
      </WindowCard>
    </ScrollView>
  );
}
