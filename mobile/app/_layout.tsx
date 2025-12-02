import { Stack } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';

const theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#6366f1',
        secondary: '#8b5cf6',
        tertiary: '#d946ef',
        background: '#0f0f1e',
        surface: '#1a1a2e',
        onSurface: '#ffffff',
    },
};

export default function RootLayout() {
    const loadToken = useAuthStore((state) => state.loadToken);

    useEffect(() => {
        loadToken();
    }, []);

    return (
        <PaperProvider theme={theme}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: '#1a1a2e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
                <Stack.Screen name="auth/register" options={{ title: 'Register' }} />
            </Stack>
        </PaperProvider>
    );
}
