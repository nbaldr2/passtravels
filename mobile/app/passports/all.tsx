import React, { useState, useEffect } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { passportService } from '../../services';
import {
    Text,
    Card,
    Searchbar,
    ActivityIndicator,
    useTheme,
    IconButton,
    Chip
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AllPassportsScreen() {
    const router = useRouter();
    const [rankings, setRankings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const theme = useTheme();

    useEffect(() => {
        loadRankings();
    }, []);

    const loadRankings = async () => {
        try {
            const data = await passportService.getRankings();
            setRankings(data);
        } catch (error) {
            console.error('Failed to load rankings:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchNormalized = searchQuery.trim().toLowerCase();
    const filteredRankings = rankings.filter((passport) => {
        if (!searchNormalized) return true;
        const code = String(passport.countryCode || '').toLowerCase();
        const rankValue = String(passport.rank || '').toLowerCase();
        return code.includes(searchNormalized) || rankValue.includes(searchNormalized);
    });

    const renderPassportItem = ({ item }: { item: any }) => (
        <Card
            style={{ marginBottom: 12, backgroundColor: theme.colors.surface }}
            onPress={() => router.push(`/passport/${item.countryCode}`)}
        >
            <Card.Content style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                {/* Flag */}
                <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: theme.colors.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16
                }}>
                    <Text style={{ fontSize: 32 }}>{getFlagEmoji(item.countryCode)}</Text>
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                    <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>
                        {item.countryName || item.countryCode}
                    </Text>
                    <Text variant="bodySmall" style={{ color: 'gray', marginBottom: 4 }}>
                        {item.countryCode} • Rank #{item.rank}
                    </Text>
                    <Chip
                        mode="flat"
                        compact
                        style={{ alignSelf: 'flex-start', backgroundColor: `${theme.colors.primary}20` }}
                    >
                        <Text style={{ color: theme.colors.primary, fontSize: 12 }}>
                            {item.mobilityScore} countries
                        </Text>
                    </Chip>
                </View>

                {/* Arrow */}
                <IconButton
                    icon="chevron-right"
                    iconColor="gray"
                    size={24}
                />
            </Card.Content>
        </Card>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.surface }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                    <IconButton
                        icon="arrow-left"
                        iconColor="white"
                        size={24}
                        onPress={() => router.back()}
                    />
                    <Text variant="headlineSmall" style={{ color: 'white', fontWeight: 'bold', flex: 1 }}>
                        All Passports
                    </Text>
                    <Chip mode="flat" style={{ backgroundColor: `${theme.colors.primary}20` }}>
                        <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                            {filteredRankings.length}
                        </Text>
                    </Chip>
                </View>

                {/* Search */}
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Searchbar
                        placeholder="Search country or rank..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={{ backgroundColor: theme.colors.background }}
                        iconColor={theme.colors.primary}
                        inputStyle={{ color: 'white' }}
                        placeholderTextColor="gray"
                    />
                </View>
            </SafeAreaView>

            {/* List */}
            <FlatList
                data={filteredRankings}
                renderItem={renderPassportItem}
                keyExtractor={(item) => item.countryCode}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            />
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
