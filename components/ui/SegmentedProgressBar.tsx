import React from 'react';
import { View } from 'react-native';

interface SegmentedProgressBarProps {
  progress: number; // 0-100
  segments?: number;
  height?: number;
  color?: string;
  bgColor?: string;
  showAlert?: boolean;
}

export function SegmentedProgressBar({
  progress,
  segments = 10,
  height = 16,
  color,
  bgColor = '#F5EFE0',
  showAlert = false,
}: SegmentedProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const filledSegments = Math.round((clampedProgress / 100) * segments);

  const getColor = () => {
    if (color) return color;
    if (clampedProgress >= 90) return '#E8A0BF';
    if (clampedProgress >= 70) return '#E8A87C';
    return '#A8D5BA';
  };

  const segmentColor = getColor();

  return (
    <View
      className="flex-row rounded-md overflow-hidden"
      style={{
        height,
        borderWidth: 1.5,
        borderColor: '#2C2416',
        backgroundColor: bgColor,
        gap: 2,
        padding: 2,
      }}
    >
      {Array.from({ length: segments }).map((_, i) => (
        <View
          key={i}
          className="flex-1 rounded-sm"
          style={{
            backgroundColor: i < filledSegments ? segmentColor : 'transparent',
          }}
        />
      ))}
    </View>
  );
}
