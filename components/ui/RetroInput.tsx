import React from 'react';
import { View, TextInput, Text } from 'react-native';

interface RetroInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'decimal-pad';
  secureTextEntry?: boolean;
  multiline?: boolean;
}

export function RetroInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
}: RetroInputProps) {
  return (
    <View className="mb-3">
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
      <View
        className="rounded-md"
        style={{
          borderWidth: 2,
          borderColor: '#2C2416',
          backgroundColor: '#FFFFFF',
          shadowColor: '#2C2416',
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 0,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#7A6A52"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          className="px-3 py-2.5"
          style={{
            fontFamily: 'SpaceGrotesk_400Regular',
            fontSize: 14,
            color: '#2C2416',
            minHeight: multiline ? 80 : undefined,
          }}
        />
      </View>
    </View>
  );
}
