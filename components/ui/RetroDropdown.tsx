import React, { useRef, useCallback } from 'react';
import { View, Text, Pressable, Modal, ScrollView, Dimensions } from 'react-native';
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
  const triggerRef = useRef<View>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({ x: 0, y: 0, width: 0 });
  const screenHeight = Dimensions.get('window').height;

  const handleToggle = useCallback(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.measureInWindow((x, y, width, height) => {
        setDropdownPosition({ x, y: y + height + 4, width });
        onToggle();
      });
    } else {
      onToggle();
    }
  }, [isOpen, onToggle]);

  const maxDropdownHeight = Math.min(options.length * 44, screenHeight * 0.4);

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
      <Pressable
        ref={triggerRef as any}
        onPress={handleToggle}
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

      {/* Dropdown rendered as Modal to avoid clipping by parent containers */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={onToggle}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={onToggle}
        >
          <View
            style={{
              position: 'absolute',
              top: dropdownPosition.y,
              left: dropdownPosition.x,
              width: dropdownPosition.width,
              maxHeight: maxDropdownHeight,
              borderWidth: 2,
              borderColor: '#2C2416',
              backgroundColor: '#FDF6E8',
              borderRadius: 8,
              shadowColor: '#2C2416',
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 0,
              elevation: 20,
              zIndex: 9999,
            }}
          >
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={options.length > 6}
              bounces={false}
              style={{ maxHeight: maxDropdownHeight }}
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
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
