import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'body' | 'caption';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  center?: boolean;
  bold?: boolean;
  style?: any;
}

export const Text = ({ 
  children, 
  variant = 'body', 
  color,
  center = false,
  bold = false,
  style 
}: TextProps) => {
  const { colors, typography } = useTheme();
  
  const getTextStyles = () => {
    switch (variant) {
      case 'h1':
        return typography.h1;
      case 'h2':
        return typography.h2;
      case 'caption':
        return typography.caption;
      default: // body
        return typography.body;
    }
  };

  const textStyle = getTextStyles();
  
  const textStyles = StyleSheet.create({
    text: {
      fontSize: textStyle.fontSize,
      fontWeight: bold ? 'bold' : textStyle.fontWeight,
      lineHeight: textStyle.lineHeight,
      color: color ? colors[color] : colors.text,
      textAlign: center ? 'center' : 'left',
    }
  });

  return (
    <RNText style={[textStyles.text, style]}>
      {children}
    </RNText>
  );
};