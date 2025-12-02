import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Text } from '../../components/Text';
import { Input } from '../../components/Input';
import { useTheme } from '../../components/ThemeProvider';

export default function ModernLoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { colors, spacing } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const loginStyles = StyleSheet.create({
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
      backgroundColor: `${colors.primary}20`,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.lg,
      borderWidth: 1,
      borderColor: `${colors.primary}30`,
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
      style={loginStyles.container}
    >
      <ScrollView contentContainerStyle={loginStyles.scrollContainer}>
        <View style={loginStyles.header}>
          <View style={loginStyles.logoContainer}>
            <Image
              source={require('../../assets/icon.png')}
              style={{ width: 60, height: 60 }}
              resizeMode="contain"
            />
          </View>
          <Text variant="h1" center bold>
            PassTravels
          </Text>
          <Text variant="body" color="secondary" center>
            Sign in to access your global mobility insights
          </Text>
        </View>

        <Card style={loginStyles.formContainer}>
          <Text variant="h2" bold style={{ marginBottom: spacing.lg }}>
            Welcome Back
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

          <TouchableOpacity onPress={() => console.log('Forgot password')}>
            <Text 
              color="primary" 
              style={{ alignSelf: 'flex-end', marginBottom: spacing.lg }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            title={loading ? "Signing In..." : "Sign In"}
            onPress={handleLogin}
            disabled={loading}
          />
        </Card>

        <View style={loginStyles.footer}>
          <Text variant="body" color="secondary">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text 
              color="primary" 
              bold
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}