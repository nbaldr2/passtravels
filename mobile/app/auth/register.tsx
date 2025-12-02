import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { Input } from '../../components/Input';
import { useTheme } from '../../components/ThemeProvider';

export default function ModernRegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors, spacing } = useTheme();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  const registerStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      padding: spacing.xl,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.xl * 2,
    },
    logoContainer: {
      width: 100,
      height: 100,
      borderRadius: 25,
      backgroundColor: `${colors.secondary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: `${colors.secondary}30`,
    },
    formContainer: {
      padding: spacing.lg,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.lg,
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={registerStyles.container}
    >
      <ScrollView contentContainerStyle={registerStyles.scrollContainer}>
        <View style={registerStyles.header}>
          <View style={registerStyles.logoContainer}>
            <Image
              source={require('../../assets/icon.png')}
              style={{ width: 60, height: 60 }}
              resizeMode="contain"
            />
          </View>
          <Text variant="h1" center bold>
            Join PassTravels
          </Text>
          <Text variant="body" color="secondary" center>
            Create your account to start exploring
          </Text>
        </View>

        <Card style={registerStyles.formContainer}>
          <Text variant="h2" bold style={{ marginBottom: spacing.lg }}>
            Create Account
          </Text>

          <Input
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Input
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Button
            title={loading ? "Creating Account..." : "Register"}
            onPress={handleRegister}
            disabled={loading}
            variant="secondary"
          />
        </Card>

        <View style={registerStyles.footer}>
          <Text variant="body" color="secondary">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text 
              color="primary" 
              bold
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}