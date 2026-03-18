import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Minus, Square, X, Maximize2 } from 'lucide-react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface WindowCardProps {
  title: string;
  children: ReactNode;
  titleColor?: string;
  onClose?: () => void;
  className?: string;
  /** If true, minimize/maximize buttons will be decorative only */
  disableWindowControls?: boolean;
  /** Controlled minimized state from parent */
  minimized?: boolean;
  /** Callback when minimize state changes */
  onMinimizeChange?: (minimized: boolean) => void;
}

export function WindowCard({
  title,
  children,
  titleColor = '#E8A87C',
  onClose,
  className = '',
  disableWindowControls = false,
  minimized: controlledMinimized,
  onMinimizeChange,
}: WindowCardProps) {
  const isControlled = controlledMinimized !== undefined;
  const [internalMinimized, setInternalMinimized] = useState(false);
  const isMinimized = isControlled ? controlledMinimized : internalMinimized;

  const contentHeight = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isMinimized) {
      Animated.parallel([
        Animated.timing(contentHeight, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(contentHeight, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isMinimized]);

  const handleMinimize = () => {
    if (disableWindowControls) return;
    const newValue = !isMinimized;
    if (onMinimizeChange) {
      onMinimizeChange(newValue);
    }
    if (!isControlled) {
      setInternalMinimized(newValue);
    }
  };

  const handleMaximize = () => {
    if (disableWindowControls) return;
    if (isMinimized) {
      handleMinimize(); // restore from minimized
    }
  };

  const handleTitlePress = () => {
    if (isMinimized && !disableWindowControls) {
      handleMinimize(); // restore by tapping title bar when minimized
    }
  };

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
      <Pressable
        onPress={handleTitlePress}
        className="flex-row items-center justify-between px-3 py-2"
        style={{ backgroundColor: titleColor }}
      >
        <View className="flex-row items-center gap-1.5 flex-1 mr-2">
          <Text
            className="text-sm text-white"
            style={{ fontFamily: 'Syne_700Bold' }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {isMinimized && (
            <Text
              style={{
                fontFamily: 'SpaceGrotesk_400Regular',
                fontSize: 10,
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              (minimized)
            </Text>
          )}
        </View>
        <View className="flex-row items-center gap-1.5">
          {/* Minimize Button */}
          <Pressable
            onPress={handleMinimize}
            className="w-5 h-5 rounded-sm items-center justify-center"
            style={({ pressed }) => ({
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.5)',
              backgroundColor: pressed ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
              transform: [{ scale: pressed ? 0.9 : 1 }],
            })}
          >
            <Minus size={10} color="white" strokeWidth={2.5} />
          </Pressable>
          {/* Maximize / Restore Button */}
          <Pressable
            onPress={handleMaximize}
            className="w-5 h-5 rounded-sm items-center justify-center"
            style={({ pressed }) => ({
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.5)',
              backgroundColor: pressed ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)',
              transform: [{ scale: pressed ? 0.9 : 1 }],
            })}
          >
            {isMinimized ? (
              <Maximize2 size={9} color="white" strokeWidth={2.5} />
            ) : (
              <Square size={8} color="white" strokeWidth={2.5} />
            )}
          </Pressable>
          {/* Close Button */}
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
            <X size={10} color="white" strokeWidth={2.5} />
          </Pressable>
        </View>
      </Pressable>
      {/* Content - animated collapse */}
      <Animated.View
        style={{
          maxHeight: contentHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 2000],
          }),
          opacity: contentOpacity,
          overflow: 'hidden',
        }}
      >
        <View className="p-4">
          {children}
        </View>
      </Animated.View>
    </View>
  );
}
