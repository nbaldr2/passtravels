import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services';

interface User {
    id: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,

    login: async (email: string, password: string) => {
        try {
            const data = await authService.login(email, password);
            await SecureStore.setItemAsync('authToken', data.token);
            set({ user: data.user, token: data.token, isAuthenticated: true });
        } catch (error: any) {
            const message = error?.response?.data?.error || error?.message || 'Login failed';
            throw new Error(message);
        }
    },

    register: async (email: string, password: string) => {
        try {
            const data = await authService.register(email, password);
            await SecureStore.setItemAsync('authToken', data.token);
            set({ user: data.user, token: data.token, isAuthenticated: true });
        } catch (error: any) {
            const message = error?.response?.data?.error || error?.message || 'Registration failed';
            throw new Error(message);
        }
    },

    logout: async () => {
        await SecureStore.deleteItemAsync('authToken');
        set({ user: null, token: null, isAuthenticated: false });
    },

    loadToken: async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) {
                set({ token, isAuthenticated: true, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            set({ isLoading: false });
        }
    },
}));
