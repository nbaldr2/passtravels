import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const resolveBaseURL = () => {
    // Prefer explicit env if provided (Expo supports EXPO_PUBLIC_*)
    const envUrl = process.env.EXPO_PUBLIC_API_URL;
    if (envUrl) {
        return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
    }

    // Try to infer LAN IP from Expo dev host
    const hostUri = (Constants?.expoConfig?.hostUri || (Constants as any)?.manifest?.hostUri) as string | undefined;
    const host = hostUri?.split(':')[0];

    if (Platform.OS === 'android') {
        // Android emulator loopback
        if (!host || host.includes('127.0.0.1') || host.includes('localhost')) {
            return 'http://10.0.2.2:3000/api';
        }
        return `http://${host}:3000/api`;
    }

    // iOS simulator or Expo Go on device
    if (host) {
        return `http://${host}:3000/api`;
    }
    return 'http://localhost:3000/api';
};

const API_URL = resolveBaseURL();

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            await SecureStore.deleteItemAsync('authToken');
        }
        return Promise.reject(error);
    }
);

export default api;
