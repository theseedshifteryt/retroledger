import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface TabStripProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabStrip({ tabs, activeTab, onTabChange }: TabStripProps) {
  return (
    <View
      className="flex-row rounded-md overflow-hidden mb-4"
      style={{
        borderWidth: 2,
        borderColor: '#2C2416',
        backgroundColor: '#F5EFE0',
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = tab === activeTab;
        return (
          <Pressable
            key={tab}
            onPress={() => onTabChange(tab)}
            className="flex-1 items-center justify-center py-2.5"
            style={[
              {
                backgroundColor: isActive ? '#E8A87C' : 'transparent',
              },
              index > 0 && {
                borderLeftWidth: 1.5,
                borderLeftColor: '#2C2416',
              },
            ]}
          >
            <Text
              style={{
                fontFamily: 'SpaceGrotesk_500Medium',
                fontSize: 13,
                color: isActive ? '#FFFFFF' : '#2C2416',
              }}
            >
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
