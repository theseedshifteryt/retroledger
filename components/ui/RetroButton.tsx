import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';

interface RetroButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  className?: string;
}

const variantStyles = {
  primary: { bg: '#E8A87C', border: '#2C2416', text: '#FFFFFF' },
  secondary: { bg: '#FDF6E8', border: '#2C2416', text: '#2C2416' },
  danger: { bg: '#E8A0BF', border: '#2C2416', text: '#FFFFFF' },
  success: { bg: '#A8D5BA', border: '#2C2416', text: '#2C2416' },
};

const sizeStyles = {
  sm: { px: 12, py: 6, fontSize: 12 },
  md: { px: 16, py: 10, fontSize: 14 },
  lg: { px: 24, py: 14, fontSize: 16 },
};

export function RetroButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  className = '',
}: RetroButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`items-center justify-center rounded-md ${className}`}
      style={({ pressed }) => [
        {
          backgroundColor: v.bg,
          borderWidth: 2,
          borderColor: v.border,
          paddingHorizontal: s.px,
          paddingVertical: s.py,
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
          shadowColor: '#2C2416',
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: pressed ? 0 : 0.15,
          shadowRadius: 0,
          elevation: pressed ? 0 : 2,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: 'SpaceGrotesk_500Medium',
          fontSize: s.fontSize,
          color: v.text,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
