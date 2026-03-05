import React, { ReactNode } from 'react';
import { View, Text, Pressable, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '91.666%', maxWidth: 448 }}
        >
          <Pressable
            onPress={() => {}}
            className="w-full rounded-lg"
            style={{
              borderWidth: 2,
              borderColor: '#2C2416',
              backgroundColor: '#FDF6E8',
              shadowColor: '#2C2416',
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 0,
              elevation: 5,
              maxHeight: '90%',
            }}
          >
            {/* Title Bar */}
            <View
              className="flex-row items-center justify-between px-3 py-2"
              style={{ backgroundColor: titleColor, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}
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
                style={({ pressed }) => ({
                  borderWidth: 1.5,
                  borderColor: 'rgba(255,255,255,0.5)',
                  backgroundColor: pressed ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.3)',
                  transform: [{ scale: pressed ? 0.9 : 1 }],
                })}
              >
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✕</Text>
              </Pressable>
            </View>
            {/* Content */}
            <View className="p-4">
              {children}
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
