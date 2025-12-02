import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';

interface CardProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
}

export const Card = ({ children, style, onPress }: CardProps) => {
  const { colors, borderRadius } = useTheme();
  
  const cardStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
  });

  if (onPress) {
    return (
      <TouchableOpacity 
        style={[cardStyles.container, style]} 
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyles.container, style]}>
      {children}
    </View>
  );
};