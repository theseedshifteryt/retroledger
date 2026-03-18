import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { WindowCard } from '@/components/ui/WindowCard';
import { TabStrip } from '@/components/ui/TabStrip';
import { SegmentedProgressBar } from '@/components/ui/SegmentedProgressBar';
import { RetroButton } from '@/components/ui/RetroButton';
import { DialogPopup } from '@/components/ui/DialogPopup';
import { RetroInput } from '@/components/ui/RetroInput';
import { RetroDropdown } from '@/components/ui/RetroDropdown';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { useAppContext } from '@/lib/store';
import { formatCurrency } from '@/lib/formatNumber';
import { AlertTriangle } from 'lucide-react-native';

const categoryColors = ['#E8A87C', '#C9B8E8', '#A8D5BA', '#E8A0BF'];
const categoryIcons = ['utensils', 'home', 'car', 'zap', 'music', 'shopping-bag', 'heart', 'wifi', 'smartphone', 'coffee', 'gift', 'plane'];

export function BudgetScreen() {
  const { categories, addCategory, profile } = useAppContext();
  const fmt = profile.numberFormat;
  const [activeTab, setActiveTab] = useState('Monthly');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatLimit, setNewCatLimit] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('dollar-sign');
  const [iconDropdownOpen, setIconDropdownOpen] = useState(false);

  const totalBudget = categories.reduce((sum, c) => sum + c.limit, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const divisor = activeTab === 'Weekly' ? 4 : 1;

  const handleAddCategory = () => {
    if (!newCatName || !newCatLimit) return;
    addCategory({
      name: newCatName,
      icon: newCatIcon,
      limit: parseFloat(newCatLimit),
      spent: 0,
      color: categoryColors[categories.length % categoryColors.length],
    });
    setNewCatName('');
    setNewCatLimit('');
    setNewCatIcon('dollar-sign');
    setShowAddDialog(false);
  };

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: '#F5EFE0' }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <TabStrip
        tabs={['Monthly', 'Weekly']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Summary */}
      <WindowCard title="📊 Budget Summary" className="mb-4" titleColor="#C9B8E8">
        <View className="flex-row items-center justify-between mb-2">
          <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 13, color: '#7A6A52' }}>
            {activeTab} Overview
          </Text>
          <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 13, color: '#2C2416' }}>
            {formatCurrency(totalSpent / divisor, profile.currency, fmt, 0)} / {formatCurrency(totalBudget / divisor, profile.currency, fmt, 0)}
          </Text>
        </View>
        <SegmentedProgressBar
          progress={(totalSpent / totalBudget) * 100}
          segments={12}
          height={20}
        />
        <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 12, color: '#7A6A52', marginTop: 8 }}>
          {formatCurrency((totalBudget - totalSpent) / divisor, profile.currency, fmt, 0)} remaining this {activeTab === 'Monthly' ? 'month' : 'week'}
        </Text>
      </WindowCard>

      {/* Category Cards */}
      {categories.map((cat) => {
        const spent = cat.spent / divisor;
        const limit = cat.limit / divisor;
        const progress = limit > 0 ? (spent / limit) * 100 : 0;
        const isNearLimit = progress >= 80;

        return (
          <WindowCard
            key={cat.id}
            title={`${cat.name}`}
            className="mb-3"
            titleColor={cat.color}
          >
            {isNearLimit && (
              <View
                className="flex-row items-center gap-2 mb-3 px-3 py-2 rounded-md"
                style={{
                  backgroundColor: '#E8A0BF20',
                  borderWidth: 1,
                  borderColor: '#E8A0BF',
                }}
              >
                <AlertTriangle size={14} color="#E8A0BF" strokeWidth={2} />
                <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 12, color: '#E8A0BF' }}>
                  Approaching budget limit!
                </Text>
              </View>
            )}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <View
                  className="w-8 h-8 rounded-md items-center justify-center"
                  style={{ backgroundColor: cat.color + '30', borderWidth: 1, borderColor: cat.color }}
                >
                  <CategoryIcon name={cat.icon} size={16} color={cat.color} />
                </View>
                <View>
                  <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 16, color: '#2C2416' }}>
                    {formatCurrency(spent, profile.currency, fmt, 0)}
                  </Text>
                  <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 11, color: '#7A6A52' }}>
                    spent of {formatCurrency(limit, profile.currency, fmt, 0)}
                  </Text>
                </View>
              </View>
              <Text style={{ fontFamily: 'JetBrainsMono_500Medium', fontSize: 14, color: progress >= 90 ? '#E8A0BF' : '#7A6A52' }}>
                {progress.toFixed(0)}%
              </Text>
            </View>
            <SegmentedProgressBar
              progress={progress}
              segments={8}
              height={14}
              color={cat.color}
            />
          </WindowCard>
        );
      })}

      {/* Add Category Button */}
      <RetroButton
        title="+ Add Category"
        onPress={() => setShowAddDialog(true)}
        variant="secondary"
        size="lg"
        className="mt-2"
      />

      {/* Add Category Dialog */}
      <DialogPopup
        visible={showAddDialog}
        title="Add Budget Category"
        onClose={() => setShowAddDialog(false)}
      >
        <RetroInput
          label="Category Name"
          value={newCatName}
          onChangeText={setNewCatName}
          placeholder="e.g., Groceries"
        />
        <RetroInput
          label="Budget Limit"
          value={newCatLimit}
          onChangeText={setNewCatLimit}
          placeholder="e.g., 300"
          keyboardType="decimal-pad"
        />
        <RetroDropdown
          label="Icon"
          value={newCatIcon}
          options={categoryIcons}
          onSelect={setNewCatIcon}
          isOpen={iconDropdownOpen}
          onToggle={() => setIconDropdownOpen(!iconDropdownOpen)}
        />
        <View className="flex-row gap-3 mt-4">
          <View className="flex-1">
            <RetroButton
              title="Cancel"
              onPress={() => setShowAddDialog(false)}
              variant="secondary"
            />
          </View>
          <View className="flex-1">
            <RetroButton
              title="OK"
              onPress={handleAddCategory}
              variant="primary"
            />
          </View>
        </View>
      </DialogPopup>
    </ScrollView>
  );
}
