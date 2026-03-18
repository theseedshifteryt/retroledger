import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { WindowCard } from '@/components/ui/WindowCard';
import { TabStrip } from '@/components/ui/TabStrip';
import { SegmentedProgressBar } from '@/components/ui/SegmentedProgressBar';
import { RetroButton } from '@/components/ui/RetroButton';
import { DialogPopup } from '@/components/ui/DialogPopup';
import { RetroInput } from '@/components/ui/RetroInput';
import { RetroDropdown } from '@/components/ui/RetroDropdown';
import { useAppContext } from '@/lib/store';
import { formatCurrency } from '@/lib/formatNumber';
import { Star, Target, Trophy, Award } from 'lucide-react-native';

const milestoneIcons: Record<number, { icon: typeof Star; label: string }> = {
  25: { icon: Star, label: '25%' },
  50: { icon: Target, label: '50%' },
  75: { icon: Trophy, label: '75%' },
  100: { icon: Award, label: '100%' },
};

export function GoalsScreen() {
  const { goals, addGoal, addContribution, profile } = useAppContext();
  const fmt = profile.numberFormat;
  const [activeTab, setActiveTab] = useState('Short-term');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showContribution, setShowContribution] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  // New goal form
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [newGoalType, setNewGoalType] = useState<'short-term' | 'long-term'>('short-term');

  const filteredGoals = goals.filter(g =>
    activeTab === 'Short-term' ? g.type === 'short-term' : g.type === 'long-term'
  );

  const handleAddGoal = () => {
    if (!newGoalName || !newGoalTarget) return;
    addGoal({
      name: newGoalName,
      type: newGoalType,
      targetAmount: parseFloat(newGoalTarget),
      currentAmount: 0,
      deadline: newGoalDeadline || '2025-12-31',
    });
    setNewGoalName('');
    setNewGoalTarget('');
    setNewGoalDeadline('');
    setShowAddGoal(false);
  };

  const handleAddContribution = () => {
    if (!showContribution || !contributionAmount) return;
    addContribution(showContribution, parseFloat(contributionAmount));
    setContributionAmount('');
    setShowContribution(null);
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: '#F5EFE0' }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Overall Progress */}
      <WindowCard title="🎯 Goals Overview" className="mb-4" titleColor="#C9B8E8">
        <View className="flex-row items-center justify-between mb-2">
          <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, color: '#7A6A52' }}>
            Total saved across all goals
          </Text>
        </View>
        <View className="flex-row items-baseline gap-1 mb-3">
          <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 28, color: '#2C2416' }}>
            {formatCurrency(totalSaved, profile.currency, fmt, 0)}
          </Text>
          <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 14, color: '#7A6A52' }}>
            / {formatCurrency(totalTarget, profile.currency, fmt, 0)}
          </Text>
        </View>
        <SegmentedProgressBar
          progress={totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0}
          segments={12}
          height={20}
          color="#C9B8E8"
        />
      </WindowCard>

      <TabStrip
        tabs={['Short-term', 'Long-term']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Goal Cards */}
      {filteredGoals.length === 0 ? (
        <WindowCard title="No Goals Yet" titleColor="#E8A87C">
          <Text
            style={{
              fontFamily: 'SpaceGrotesk_400Regular',
              fontSize: 14,
              color: '#7A6A52',
              textAlign: 'center',
              paddingVertical: 20,
            }}
          >
            Add your first {activeTab.toLowerCase()} goal!
          </Text>
        </WindowCard>
      ) : (
        filteredGoals.map((goal) => {
          const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
          const daysLeft = Math.max(0, Math.floor((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

          return (
            <WindowCard
              key={goal.id}
              title={goal.name}
              className="mb-4"
              titleColor={goal.type === 'short-term' ? '#E8A87C' : '#C9B8E8'}
            >
              {/* Milestone Badges */}
              {goal.milestones.length > 0 && (
                <View className="flex-row gap-2 mb-3">
                  {goal.milestones.map(m => {
                    const ms = milestoneIcons[m];
                    if (!ms) return null;
                    const MsIcon = ms.icon;
                    return (
                      <View
                        key={m}
                        className="flex-row items-center gap-1 px-2 py-1 rounded-md"
                        style={{
                          backgroundColor: '#E8A87C20',
                          borderWidth: 1,
                          borderColor: '#E8A87C',
                        }}
                      >
                        <MsIcon size={12} color="#E8A87C" strokeWidth={2} />
                        <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', fontSize: 10, color: '#E8A87C' }}>
                          {ms.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Progress Info */}
              <View className="flex-row items-center justify-between mb-2">
                <View>
                  <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 22, color: '#2C2416' }}>
                    {profile.currency}{goal.currentAmount.toLocaleString()}
                  </Text>
                  <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 12, color: '#7A6A52' }}>
                    of {profile.currency}{goal.targetAmount.toLocaleString()} target
                  </Text>
                </View>
                <View className="items-end">
                  <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 16, color: '#2C2416' }}>
                    {progress.toFixed(0)}%
                  </Text>
                  <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 11, color: '#7A6A52' }}>
                    {daysLeft} days left
                  </Text>
                </View>
              </View>

              <SegmentedProgressBar
                progress={progress}
                segments={10}
                height={16}
                color={goal.type === 'short-term' ? '#E8A87C' : '#C9B8E8'}
              />

              {/* Contribution History */}
              {goal.contributions.length > 0 && (
                <View className="mt-3">
                  <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', fontSize: 12, color: '#7A6A52', marginBottom: 4 }}>
                    Recent contributions:
                  </Text>
                  {goal.contributions.slice(-3).map(c => (
                    <View key={c.id} className="flex-row items-center justify-between py-1">
                      <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 12, color: '#7A6A52' }}>
                        {c.date}
                      </Text>
                      <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 12, color: '#A8D5BA' }}>
                        +{profile.currency}{c.amount.toFixed(0)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <RetroButton
                title="+ Add Contribution"
                onPress={() => setShowContribution(goal.id)}
                variant="success"
                size="sm"
                className="mt-3"
              />
            </WindowCard>
          );
        })
      )}

      {/* Add Goal Button */}
      <RetroButton
        title="+ New Goal"
        onPress={() => setShowAddGoal(true)}
        variant="primary"
        size="lg"
        className="mt-2"
      />

      {/* Add Goal Dialog */}
      <DialogPopup
        visible={showAddGoal}
        title="Create New Goal"
        onClose={() => setShowAddGoal(false)}
        titleColor="#C9B8E8"
      >
        <RetroInput
          label="Goal Name"
          value={newGoalName}
          onChangeText={setNewGoalName}
          placeholder="e.g., Emergency Fund"
        />
        <RetroInput
          label="Target Amount"
          value={newGoalTarget}
          onChangeText={setNewGoalTarget}
          placeholder="e.g., 5000"
          keyboardType="decimal-pad"
        />
        <RetroInput
          label="Deadline (YYYY-MM-DD)"
          value={newGoalDeadline}
          onChangeText={setNewGoalDeadline}
          placeholder="e.g., 2025-12-31"
        />
        <RetroDropdown
          label="Goal Type"
          value={newGoalType}
          options={['short-term', 'long-term']}
          onSelect={(v) => setNewGoalType(v as any)}
          isOpen={typeDropdownOpen}
          onToggle={() => setTypeDropdownOpen(!typeDropdownOpen)}
        />
        <View className="flex-row gap-3 mt-4">
          <View className="flex-1">
            <RetroButton title="Cancel" onPress={() => setShowAddGoal(false)} variant="secondary" />
          </View>
          <View className="flex-1">
            <RetroButton title="Create" onPress={handleAddGoal} variant="primary" />
          </View>
        </View>
      </DialogPopup>

      {/* Add Contribution Dialog */}
      <DialogPopup
        visible={!!showContribution}
        title="Log Contribution"
        onClose={() => setShowContribution(null)}
        titleColor="#A8D5BA"
      >
        <RetroInput
          label="Contribution Amount"
          value={contributionAmount}
          onChangeText={setContributionAmount}
          placeholder="e.g., 100"
          keyboardType="decimal-pad"
        />
        <View className="flex-row gap-3 mt-4">
          <View className="flex-1">
            <RetroButton title="Cancel" onPress={() => setShowContribution(null)} variant="secondary" />
          </View>
          <View className="flex-1">
            <RetroButton title="Add" onPress={handleAddContribution} variant="success" />
          </View>
        </View>
      </DialogPopup>
    </ScrollView>
  );
}
