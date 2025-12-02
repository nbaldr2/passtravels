import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from './ThemeProvider';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  style 
}: ButtonProps) => {
  const { colors, spacing, borderRadius } = useTheme();
  
  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          borderColor: colors.secondary,
          color: '#ffffff',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.primary,
          color: colors.primary,
        };
      default: // primary
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          color: '#ffffff',
        };
    }
  };

  const buttonColors = getButtonStyles();
  
  const buttonStyles = StyleSheet.create({
    container: {
      backgroundColor: buttonColors.backgroundColor,
      borderColor: buttonColors.borderColor,
      borderWidth: variant === 'outline' ? 1 : 0,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
      opacity: disabled ? 0.5 : 1,
    },
    text: {
      color: buttonColors.color,
      fontSize: 16,
      fontWeight: '600',
    },
    loading: {
      position: 'absolute',
      left: spacing.md,
    }
  });

  return (
    <TouchableOpacity 
      style={[buttonStyles.container, style]} 
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? colors.primary : '#ffffff'} 
          style={buttonStyles.loading}
        />
      )}
      <Text style={buttonStyles.text}>{title}</Text>
    </TouchableOpacity>
  );
};