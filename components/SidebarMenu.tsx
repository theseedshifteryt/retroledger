import React from 'react';
import { View, Text, Pressable, Modal, Animated, Dimensions, ScrollView } from 'react-native';
import { X, User, Hash, Check } from 'lucide-react-native';
import { useAppContext } from '@/lib/store';
import { NumberFormatType } from '@/lib/types';

interface SidebarMenuProps {
  visible: boolean;
  onClose: () => void;
}

const NUMBER_FORMAT_OPTIONS: { value: NumberFormatType; label: string; example: string }[] = [
  { value: 'us', label: 'US / English', example: '10,000.00' },
  { value: 'eu', label: 'Europe', example: '10.000,00' },
  { value: 'space', label: 'Space separator', example: '10 000.00' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 320);

export function SidebarMenu({ visible, onClose }: SidebarMenuProps) {
  const { profile, updateProfile } = useAppContext();
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Overlay */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(44, 36, 22, 0.5)',
          opacity: overlayOpacity,
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Sidebar Panel */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          backgroundColor: '#FDF6E8',
          borderRightWidth: 2,
          borderRightColor: '#2C2416',
          shadowColor: '#2C2416',
          shadowOffset: { width: 4, height: 0 },
          shadowOpacity: 0.25,
          shadowRadius: 0,
          elevation: 10,
          transform: [{ translateX: slideAnim }],
        }}
      >
        {/* Sidebar Title Bar */}
        <View
          style={{
            backgroundColor: '#E8A87C',
            borderBottomWidth: 2,
            borderBottomColor: '#2C2416',
            paddingTop: 54,
            paddingBottom: 12,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderWidth: 1.5,
                borderColor: 'rgba(255,255,255,0.5)',
              }}
            >
              <Text style={{ fontSize: 12 }}>💰</Text>
            </View>
            <Text
              style={{
                fontFamily: 'Syne_800ExtraBold',
                fontSize: 16,
                color: '#FFFFFF',
              }}
            >
              RetroLedger
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => ({
              width: 28,
              height: 28,
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.5)',
              backgroundColor: pressed ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
              transform: [{ scale: pressed ? 0.9 : 1 }],
            })}
          >
            <X size={14} color="white" strokeWidth={2.5} />
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {/* User Name Card */}
          <View
            style={{
              backgroundColor: '#F5EFE0',
              borderWidth: 2,
              borderColor: '#2C2416',
              borderRadius: 8,
              overflow: 'hidden',
              marginBottom: 20,
              shadowColor: '#2C2416',
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 0,
              elevation: 2,
            }}
          >
            {/* Card title bar */}
            <View
              style={{
                backgroundColor: '#C9B8E8',
                paddingHorizontal: 12,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <User size={12} color="white" strokeWidth={2.5} />
              <Text
                style={{
                  fontFamily: 'Syne_700Bold',
                  fontSize: 12,
                  color: '#FFFFFF',
                }}
              >
                User Profile
              </Text>
            </View>
            {/* Card content */}
            <View style={{ padding: 14 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 8,
                    backgroundColor: '#E8A87C',
                    borderWidth: 2,
                    borderColor: '#2C2416',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 20 }}>👤</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: 'Syne_700Bold',
                      fontSize: 18,
                      color: '#2C2416',
                    }}
                    numberOfLines={1}
                  >
                    {profile.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'SpaceGrotesk_400Regular',
                      fontSize: 12,
                      color: '#7A6A52',
                      marginTop: 2,
                    }}
                  >
                    Monthly income: {profile.currency}{profile.monthlyIncome.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Number Format Section */}
          <View
            style={{
              backgroundColor: '#F5EFE0',
              borderWidth: 2,
              borderColor: '#2C2416',
              borderRadius: 8,
              overflow: 'hidden',
              marginBottom: 20,
              shadowColor: '#2C2416',
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.12,
              shadowRadius: 0,
              elevation: 2,
            }}
          >
            {/* Section title bar */}
            <View
              style={{
                backgroundColor: '#A8D5BA',
                paddingHorizontal: 12,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Hash size={12} color="white" strokeWidth={2.5} />
              <Text
                style={{
                  fontFamily: 'Syne_700Bold',
                  fontSize: 12,
                  color: '#FFFFFF',
                }}
              >
                Number Format
              </Text>
            </View>
            {/* Options */}
            <View style={{ padding: 10 }}>
              {NUMBER_FORMAT_OPTIONS.map((opt, idx) => {
                const isSelected = profile.numberFormat === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => updateProfile({ numberFormat: opt.value })}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      borderRadius: 6,
                      backgroundColor: isSelected
                        ? '#A8D5BA20'
                        : pressed
                        ? '#F5EFE040'
                        : 'transparent',
                      borderWidth: isSelected ? 1.5 : 0,
                      borderColor: isSelected ? '#A8D5BA' : 'transparent',
                      marginBottom: idx < NUMBER_FORMAT_OPTIONS.length - 1 ? 4 : 0,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    })}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: 'JetBrainsMono_500Medium',
                          fontSize: 16,
                          color: isSelected ? '#2C2416' : '#7A6A52',
                        }}
                      >
                        {opt.example}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'SpaceGrotesk_400Regular',
                          fontSize: 11,
                          color: '#7A6A52',
                          marginTop: 2,
                        }}
                      >
                        {opt.label}
                      </Text>
                    </View>
                    {/* Radio-style indicator */}
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: isSelected ? '#A8D5BA' : '#D4C9B0',
                        backgroundColor: isSelected ? '#A8D5BA' : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Decorative footer */}
          <View style={{ alignItems: 'center', marginTop: 16, paddingBottom: 32 }}>
            <Text style={{ fontSize: 24 }}>🖥️</Text>
            <Text
              style={{
                fontFamily: 'SpaceGrotesk_400Regular',
                fontSize: 11,
                color: '#7A6A52',
                marginTop: 6,
                textAlign: 'center',
              }}
            >
              RetroLedger v1.0{'\n'}Your nostalgic finance companion
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}
