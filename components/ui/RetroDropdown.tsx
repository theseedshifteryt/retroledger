import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronDown } from 'lucide-react-native';

interface RetroDropdownProps {
  label?: string;
  value: string;
  options: string[];
  onSelect: (option: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function RetroDropdown({
  label,
  value,
  options,
  onSelect,
  isOpen,
  onToggle,
}: RetroDropdownProps) {
  return (
    <View className="mb-3 z-50">
      {label && (
        <Text
          className="mb-1.5"
          style={{
            fontFamily: 'SpaceGrotesk_500Medium',
            fontSize: 13,
            color: '#2C2416',
          }}
        >
          {label}
        </Text>
      )}
      <Pressable
        onPress={onToggle}
        className="flex-row items-center justify-between rounded-md px-3 py-2.5"
        style={{
          borderWidth: 2,
          borderColor: '#2C2416',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Text
          style={{
            fontFamily: 'SpaceGrotesk_400Regular',
            fontSize: 14,
            color: value ? '#2C2416' : '#7A6A52',
          }}
        >
          {value || 'Select...'}
        </Text>
        <ChevronDown size={16} color="#2C2416" />
      </Pressable>
      {isOpen && (
        <View
          className="rounded-md mt-1"
          style={{
            borderWidth: 2,
            borderColor: '#2C2416',
            backgroundColor: '#FDF6E8',
            position: 'absolute',
            top: label ? 62 : 42,
            left: 0,
            right: 0,
            zIndex: 999,
            elevation: 10,
            shadowColor: '#2C2416',
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 0,
          }}
        >
          {options.map((option, index) => (
            <Pressable
              key={option}
              onPress={() => {
                onSelect(option);
                onToggle();
              }}
              className="px-3 py-2.5"
              style={[
                index > 0 && {
                  borderTopWidth: 1,
                  borderTopColor: '#D4C9B0',
                },
                option === value && {
                  backgroundColor: '#E8A87C20',
                },
              ]}
            >
              <Text
                style={{
                  fontFamily: 'SpaceGrotesk_400Regular',
                  fontSize: 14,
                  color: '#2C2416',
                }}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
