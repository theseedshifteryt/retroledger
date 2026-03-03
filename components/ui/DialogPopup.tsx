import React, { ReactNode } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';

interface DialogPopupProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  titleColor?: string;
}

export function DialogPopup({
  visible,
  title,
  onClose,
  children,
  titleColor = '#E8A87C',
}: DialogPopupProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: 'rgba(44, 36, 22, 0.5)' }}
        onPress={onClose}
      >
        <Pressable
          onPress={() => {}}
          className="w-11/12 max-w-md rounded-lg overflow-hidden"
          style={{
            borderWidth: 2,
            borderColor: '#2C2416',
            backgroundColor: '#FDF6E8',
            shadowColor: '#2C2416',
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 0,
            elevation: 5,
          }}
        >
          {/* Title Bar */}
          <View
            className="flex-row items-center justify-between px-3 py-2"
            style={{ backgroundColor: titleColor }}
          >
            <Text
              style={{ fontFamily: 'Syne_700Bold', fontSize: 14, color: '#FFFFFF' }}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              className="w-5 h-5 rounded-sm items-center justify-center"
              style={{ borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'rgba(255,255,255,0.3)' }}
            >
              <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✕</Text>
            </Pressable>
          </View>
          {/* Content */}
          <View className="p-4">
            {children}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
