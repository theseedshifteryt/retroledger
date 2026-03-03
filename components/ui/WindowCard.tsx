import React, { ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Minus, Square, X } from 'lucide-react-native';

interface WindowCardProps {
  title: string;
  children: ReactNode;
  titleColor?: string;
  onClose?: () => void;
  className?: string;
}

export function WindowCard({
  title,
  children,
  titleColor = '#E8A87C',
  onClose,
  className = '',
}: WindowCardProps) {
  return (
    <View
      className={`rounded-lg overflow-hidden ${className}`}
      style={{
        borderWidth: 2,
        borderColor: '#2C2416',
        backgroundColor: '#FDF6E8',
        shadowColor: '#2C2416',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 0,
        elevation: 3,
      }}
    >
      {/* Title Bar */}
      <View
        className="flex-row items-center justify-between px-3 py-2"
        style={{ backgroundColor: titleColor }}
      >
        <Text
          className="text-sm text-white"
          style={{ fontFamily: 'Syne_700Bold' }}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <View
            className="w-5 h-5 rounded-sm items-center justify-center"
            style={{ borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <Minus size={10} color="white" strokeWidth={2.5} />
          </View>
          <View
            className="w-5 h-5 rounded-sm items-center justify-center"
            style={{ borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <Square size={8} color="white" strokeWidth={2.5} />
          </View>
          <Pressable
            onPress={onClose}
            className="w-5 h-5 rounded-sm items-center justify-center"
            style={{ borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.3)' }}
          >
            <X size={10} color="white" strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
      {/* Content */}
      <View className="p-4">
        {children}
      </View>
    </View>
  );
}
