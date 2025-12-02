import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';
import { Text } from './Text';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  style?: any;
}

export const Input = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  keyboardType = 'default',
  style 
}: InputProps) => {
  const { colors, spacing, borderRadius } = useTheme();
  
  const inputStyles = StyleSheet.create({
    container: {
      marginBottom: spacing.lg,
    },
    label: {
      marginBottom: spacing.sm,
    },
    input: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      color: colors.text,
      fontSize: 16,
    }
  });

  return (
    <View style={[inputStyles.container, style]}>
      {label && (
        <Text variant="caption" style={inputStyles.label}>
          {label}
        </Text>
      )}
      <TextInput
        style={inputStyles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
};