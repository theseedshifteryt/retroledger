import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LayoutDashboard, Wallet, Receipt, Calendar, Target, Menu, FileText } from 'lucide-react-native';
import { DashboardScreen } from '@/components/screens/DashboardScreen';
import { BudgetScreen } from '@/components/screens/BudgetScreen';
import { ExpensesScreen } from '@/components/screens/ExpensesScreen';
import { BillsScreen } from '@/components/screens/BillsScreen';
import { GoalsScreen } from '@/components/screens/GoalsScreen';
import { QuickAddButton } from '@/components/QuickAddButton';
import { ExportDialog } from '@/components/ExportDialog';
import { SidebarMenu } from '@/components/SidebarMenu';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'bills', label: 'Bills', icon: Calendar },
  { id: 'goals', label: 'Goals', icon: Target },
];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showExport, setShowExport] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardScreen />;
      case 'budget': return <BudgetScreen />;
      case 'expenses': return <ExpensesScreen />;
      case 'bills': return <BillsScreen />;
      case 'goals': return <GoalsScreen />;
      default: return <DashboardScreen />;
    }
  };

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE0' }}>
      {/* Top Header Bar */}
      <View
        className="flex-row items-center justify-between px-4 py-3"
        style={{
          backgroundColor: '#E8A87C',
          borderBottomWidth: 2,
          borderBottomColor: '#2C2416',
        }}
      >
        <View className="flex-row items-center gap-2">
          {/* Hamburger Menu Button */}
          <Pressable
            onPress={() => setShowSidebar(true)}
            className="w-7 h-7 rounded-md items-center justify-center"
            style={({ pressed }) => ({
              backgroundColor: pressed ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.3)',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.5)',
              transform: [{ scale: pressed ? 0.92 : 1 }],
            })}
          >
            <Menu size={16} color="white" strokeWidth={2.5} />
          </Pressable>
          <Text style={{ fontFamily: 'Syne_800ExtraBold', fontSize: 18, color: '#FFFFFF' }}>
            RetroLedger
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => setShowExport(true)}
            className="w-7 h-7 rounded-md items-center justify-center"
            style={({ pressed }) => ({
              backgroundColor: pressed ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.5)',
              transform: [{ scale: pressed ? 0.92 : 1 }],
            })}
          >
            <FileText size={14} color="white" strokeWidth={2} />
          </Pressable>
          <Text style={{ fontFamily: 'SpaceGrotesk_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
            {currentTab?.label}
          </Text>
        </View>
      </View>

      {/* Screen Content */}
      <View className="flex-1">
        {renderScreen()}
      </View>

      {/* Quick Add FAB */}
      <QuickAddButton />

      {/* Export Dialog */}
      <ExportDialog visible={showExport} onClose={() => setShowExport(false)} />

      {/* Sidebar Menu */}
      <SidebarMenu visible={showSidebar} onClose={() => setShowSidebar(false)} />

      {/* Bottom Tab Bar - Taskbar Style */}
      <View
        className="flex-row items-center"
        style={{
          backgroundColor: '#F0E6D3',
          borderTopWidth: 2,
          borderTopColor: '#2C2416',
          paddingBottom: 4,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const TabIcon = tab.icon;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className="flex-1 items-center justify-center py-2"
              style={({ pressed }) => ({
                backgroundColor: isActive ? '#FDF6E8' : 'transparent',
                borderRightWidth: 1,
                borderRightColor: '#D4C9B0',
                borderTopWidth: isActive ? 2 : 0,
                borderTopColor: '#E8A87C',
                transform: [{ scale: pressed ? 0.96 : 1 }],
              })}
            >
              <TabIcon
                size={20}
                color={isActive ? '#E8A87C' : '#7A6A52'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text
                style={{
                  fontFamily: isActive ? 'SpaceGrotesk_500Medium' : 'SpaceGrotesk_400Regular',
                  fontSize: 10,
                  color: isActive ? '#E8A87C' : '#7A6A52',
                  marginTop: 2,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
