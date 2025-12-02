import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { passportService } from '../../services';
import {
    Text,
    Card,
    ActivityIndicator,
    useTheme,
    IconButton
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PassportDetailsScreen() {
    const { code } = useLocalSearchParams();
    const router = useRouter();
    const [passport, setPassport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        if (code) {
            loadPassportDetails();
        }
    }, [code]);

    const loadPassportDetails = async () => {
        try {
            const data = await passportService.getRankings();
            const found = data.find((p: any) => p.countryCode === code);
            setPassport(found || { countryCode: code, rank: '?', mobilityScore: '?' });
        } catch (error) {
            console.error('Failed to load passport details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView>
                {/* Header with Gradient */}
                <View style={{ height: 250, position: 'relative' }}>
                    <LinearGradient
                        colors={[theme.colors.primary, theme.colors.secondary]}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        {/* Back Button */}
                        <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                            <IconButton
                                icon="arrow-left"
                                iconColor="white"
                                size={24}
                                onPress={() => router.back()}
                                style={{ margin: 8 }}
                            />
                        </SafeAreaView>
                    </LinearGradient>

                    {/* Flag Container */}
                    <View style={{
                        position: 'absolute',
                        bottom: -50,
                        left: 0,
                        right: 0,
                        alignItems: 'center',
                        zIndex: 10
                    }}>
                        <View style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: theme.colors.surface,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: 4,
                            borderColor: theme.colors.background
                        }}>
                            <Text style={{ fontSize: 48 }}>{getFlagEmoji(code as string)}</Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View style={{ marginTop: 60, padding: 24 }}>
                    {/* Title */}
                    <View style={{ alignItems: 'center', marginBottom: 32 }}>
                        <Text variant="headlineMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>
                            {passport?.countryCode} Passport
                        </Text>
                        <Text variant="bodyLarge" style={{ color: 'gray' }}>
                            Global Rank #{passport?.rank}
                        </Text>
                    </View>

                    {/* Stats */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
                        <Card style={{ width: '48%', backgroundColor: theme.colors.surface }}>
                            <Card.Content style={{ alignItems: 'center', padding: 20 }}>
                                <View style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    backgroundColor: 'rgba(74, 222, 128, 0.2)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 12
                                }}>
                                    <Text style={{ fontSize: 24 }}>✓</Text>
                                </View>
                                <Text variant="headlineSmall" style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>
                                    {passport?.mobilityScore}
                                </Text>
                                <Text variant="bodySmall" style={{ color: 'gray' }}>Visa Free</Text>
                            </Card.Content>
                        </Card>

                        <Card style={{ width: '48%', backgroundColor: theme.colors.surface }}>
                            <Card.Content style={{ alignItems: 'center', padding: 20 }}>
                                <View style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    backgroundColor: 'rgba(251, 191, 36, 0.2)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 12
                                }}>
                                    <Text style={{ fontSize: 24 }}>⚠</Text>
                                </View>
                                <Text variant="headlineSmall" style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>
                                    52
                                </Text>
                                <Text variant="bodySmall" style={{ color: 'gray' }}>Visa Required</Text>
                            </Card.Content>
                        </Card>
                    </View>

                    {/* Access List */}
                    <Text variant="titleLarge" style={{ color: 'white', fontWeight: 'bold', marginBottom: 16 }}>
                        Access List
                    </Text>
                    <Card style={{ backgroundColor: theme.colors.surface }}>
                        <Card.Content style={{ padding: 24, alignItems: 'center' }}>
                            <View style={{
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                backgroundColor: `${theme.colors.primary}20`,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 16
                            }}>
                                <Text style={{ fontSize: 30 }}>ℹ️</Text>
                            </View>
                            <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold', marginBottom: 8 }}>
                                Coming Soon
                            </Text>
                            <Text style={{ color: 'gray', textAlign: 'center' }}>
                                Detailed visa requirements list will be available soon...
                            </Text>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}

// Helper function to get flag emoji from country code
function getFlagEmoji(countryCode: string) {
    if (!countryCode) return '🏳️';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}