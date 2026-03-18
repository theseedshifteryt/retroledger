import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { DialogPopup } from '@/components/ui/DialogPopup';
import { RetroButton } from '@/components/ui/RetroButton';
import { RetroInput } from '@/components/ui/RetroInput';
import { WindowCard } from '@/components/ui/WindowCard';
import { useAppContext } from '@/lib/store';
import { generateAndSharePdf, ExportOptions } from '@/lib/exportPdf';
import { FileText, Check, Calendar, Filter, Download } from 'lucide-react-native';

interface ExportDialogProps {
  visible: boolean;
  onClose: () => void;
}

export function ExportDialog({ visible, onClose }: ExportDialogProps) {
  const { expenses, bills, categories, profile } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);

  // Date range
  const today = new Date().toISOString().split('T')[0];
  const firstOfMonth = `${today.substring(0, 7)}-01`;
  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today);

  // Category filter
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const categoryNames = categories.map(c => c.name);

  // Section toggles
  const [includeExpenses, setIncludeExpenses] = useState(true);
  const [includeBills, setIncludeBills] = useState(true);
  const [includeBudgetSummary, setIncludeBudgetSummary] = useState(true);
  const [includeBreakdowns, setIncludeBreakdowns] = useState(true);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleExport = async () => {
    if (!startDate || !endDate) {
      Alert.alert('Missing Dates', 'Please enter both start and end dates.');
      return;
    }
    if (startDate > endDate) {
      Alert.alert('Invalid Date Range', 'Start date must be before end date.');
      return;
    }

    setIsExporting(true);
    try {
      const options: ExportOptions = {
        startDate,
        endDate,
        categories: selectedCategories,
        includeExpenses,
        includeBills,
        includeBudgetSummary,
        includeBreakdowns,
      };
      await generateAndSharePdf(options, expenses, bills, categories, profile);
    } catch (error: any) {
      Alert.alert('Export Error', error?.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const CheckboxToggle = ({
    label,
    value,
    onToggle,
    icon: Icon,
  }: {
    label: string;
    value: boolean;
    onToggle: () => void;
    icon?: any;
  }) => (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center gap-2.5 py-2"
    >
      <View
        className="w-5 h-5 rounded-sm items-center justify-center"
        style={{
          borderWidth: 2,
          borderColor: value ? '#A8D5BA' : '#2C2416',
          backgroundColor: value ? '#A8D5BA' : 'transparent',
        }}
      >
        {value && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
      </View>
      {Icon && <Icon size={14} color={value ? '#E8A87C' : '#7A6A52'} strokeWidth={2} />}
      <Text
        style={{
          fontFamily: 'SpaceGrotesk_500Medium',
          fontSize: 14,
          color: value ? '#2C2416' : '#7A6A52',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <DialogPopup
      visible={visible}
      title="📄 Export Financial Report"
      onClose={onClose}
      titleColor="#C9B8E8"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 500 }}
        nestedScrollEnabled
      >
        {/* Date Range Section */}
        <View className="mb-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Calendar size={14} color="#E8A87C" strokeWidth={2} />
            <Text
              style={{
                fontFamily: 'Syne_700Bold',
                fontSize: 13,
                color: '#2C2416',
              }}
            >
              Date Range
            </Text>
          </View>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <RetroInput
                label="Start Date"
                value={startDate}
                onChangeText={setStartDate}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View className="flex-1">
              <RetroInput
                label="End Date"
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>
          {/* Quick presets */}
          <View className="flex-row gap-2 mt-1">
            <Pressable
              onPress={() => {
                const d = new Date();
                setStartDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`);
                setEndDate(today);
              }}
              className="px-3 py-1.5 rounded-md"
              style={{
                borderWidth: 1.5,
                borderColor: '#C9B8E8',
                backgroundColor: '#C9B8E820',
              }}
            >
              <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', fontSize: 11, color: '#C9B8E8' }}>
                This Month
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                const d = new Date();
                d.setMonth(d.getMonth() - 1);
                setStartDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`);
                const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                setEndDate(lastDay.toISOString().split('T')[0]);
              }}
              className="px-3 py-1.5 rounded-md"
              style={{
                borderWidth: 1.5,
                borderColor: '#E8A87C',
                backgroundColor: '#E8A87C20',
              }}
            >
              <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', fontSize: 11, color: '#E8A87C' }}>
                Last Month
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                const d = new Date();
                setStartDate(`${d.getFullYear()}-01-01`);
                setEndDate(today);
              }}
              className="px-3 py-1.5 rounded-md"
              style={{
                borderWidth: 1.5,
                borderColor: '#A8D5BA',
                backgroundColor: '#A8D5BA20',
              }}
            >
              <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', fontSize: 11, color: '#A8D5BA' }}>
                This Year
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Category Filter */}
        <View className="mb-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Filter size={14} color="#E8A87C" strokeWidth={2} />
            <Text
              style={{
                fontFamily: 'Syne_700Bold',
                fontSize: 13,
                color: '#2C2416',
              }}
            >
              Categories {selectedCategories.length > 0 ? `(${selectedCategories.length} selected)` : '(All)'}
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setSelectedCategories([])}
                className="px-3 py-1.5 rounded-md"
                style={{
                  borderWidth: 1.5,
                  borderColor: selectedCategories.length === 0 ? '#E8A87C' : '#2C2416',
                  backgroundColor: selectedCategories.length === 0 ? '#E8A87C' : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: 'SpaceGrotesk_500Medium',
                    fontSize: 12,
                    color: selectedCategories.length === 0 ? '#FFFFFF' : '#2C2416',
                  }}
                >
                  All
                </Text>
              </Pressable>
              {categoryNames.map(cat => {
                const isSelected = selectedCategories.includes(cat);
                const catColor = categories.find(c => c.name === cat)?.color || '#E8A87C';
                return (
                  <Pressable
                    key={cat}
                    onPress={() => toggleCategory(cat)}
                    className="px-3 py-1.5 rounded-md"
                    style={{
                      borderWidth: 1.5,
                      borderColor: isSelected ? catColor : '#2C2416',
                      backgroundColor: isSelected ? catColor : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'SpaceGrotesk_500Medium',
                        fontSize: 12,
                        color: isSelected ? '#FFFFFF' : '#2C2416',
                      }}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Section Toggles */}
        <View className="mb-4">
          <View className="flex-row items-center gap-2 mb-2">
            <FileText size={14} color="#E8A87C" strokeWidth={2} />
            <Text
              style={{
                fontFamily: 'Syne_700Bold',
                fontSize: 13,
                color: '#2C2416',
              }}
            >
              Include Sections
            </Text>
          </View>
          <View
            className="rounded-md px-3"
            style={{
              borderWidth: 1.5,
              borderColor: '#D4C9B0',
              backgroundColor: '#FDF6E8',
            }}
          >
            <CheckboxToggle label="Budget Summary" value={includeBudgetSummary} onToggle={() => setIncludeBudgetSummary(v => !v)} />
            <View style={{ height: 1, backgroundColor: '#E8D5B5' }} />
            <CheckboxToggle label="Expenses History" value={includeExpenses} onToggle={() => setIncludeExpenses(v => !v)} />
            <View style={{ height: 1, backgroundColor: '#E8D5B5' }} />
            <CheckboxToggle label="Bills History" value={includeBills} onToggle={() => setIncludeBills(v => !v)} />
            <View style={{ height: 1, backgroundColor: '#E8D5B5' }} />
            <CheckboxToggle label="Monthly & Weekly Breakdowns" value={includeBreakdowns} onToggle={() => setIncludeBreakdowns(v => !v)} />
          </View>
        </View>

        {/* Preview Info */}
        <View
          className="rounded-md p-3 mb-4"
          style={{
            backgroundColor: '#E8A87C10',
            borderWidth: 1,
            borderColor: '#E8A87C40',
          }}
        >
          <Text style={{ fontFamily: 'SpaceGrotesk_400Regular', fontSize: 12, color: '#7A6A52' }}>
            📊 {expenses.filter(e => e.date >= startDate && e.date <= endDate && (selectedCategories.length === 0 || selectedCategories.includes(e.category))).length} expenses
            {' '} | {bills.filter(b => b.dueDate >= startDate && b.dueDate <= endDate).length} bills
            {'\n'}will be included in the report.
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="flex-row gap-3 mt-2">
        <View className="flex-1">
          <RetroButton
            title="Cancel"
            onPress={onClose}
            variant="secondary"
            disabled={isExporting}
          />
        </View>
        <View className="flex-1">
          {isExporting ? (
            <View
              className="items-center justify-center rounded-md py-2.5"
              style={{
                backgroundColor: '#C9B8E8',
                borderWidth: 2,
                borderColor: '#2C2416',
              }}
            >
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', fontSize: 12, color: '#FFFFFF', marginTop: 4 }}>
                Generating...
              </Text>
            </View>
          ) : (
            <RetroButton
              title="Export PDF"
              onPress={handleExport}
              variant="primary"
              disabled={!includeExpenses && !includeBills && !includeBudgetSummary && !includeBreakdowns}
            />
          )}
        </View>
      </View>
    </DialogPopup>
  );
}
