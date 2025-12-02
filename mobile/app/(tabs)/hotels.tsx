import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, TouchableOpacity, Modal, FlatList, Animated, Easing } from 'react-native';
import { aiService, passportService } from '../../services';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Text,
    Card,
    ActivityIndicator,
    useTheme,
    Searchbar,
    Chip,
    Divider
} from 'react-native-paper';

const { width } = Dimensions.get('window');

// Custom Loading Component
const LoadingState = ({ theme }: { theme: any }) => {
    const spinValue = React.useRef(new Animated.Value(0)).current;
    const fadeValue = React.useRef(new Animated.Value(0.5)).current;

    React.useEffect(() => {
        // Spin animation
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        ).start();

        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                }),
                Animated.timing(fadeValue, {
                    toValue: 0.5,
                    duration: 1000,
                    useNativeDriver: true
                })
            ])
        ).start();
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={{ padding: 40, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={{ transform: [{ rotate: spin }], marginBottom: 24 }}>
                <Text style={{ fontSize: 48 }}>🌍</Text>
            </Animated.View>
            <Animated.Text style={{
                color: theme.colors.primary,
                fontSize: 18,
                fontWeight: 'bold',
                opacity: fadeValue,
                marginBottom: 8
            }}>
                AI is exploring hotels...
            </Animated.Text>
            <Text style={{ color: 'gray', textAlign: 'center' }}>
                Finding the best stays for you based on ratings, price, and location.
            </Text>
        </View>
    );
};

export default function HotelsScreen() {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [hotels, setHotels] = useState<any>(null);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countries, setCountries] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const theme = useTheme();

    useEffect(() => {
        loadCountries();
    }, []);

    const loadCountries = async () => {
        try {
            const data = await passportService.getRankings();
            setCountries(data);
        } catch (error) {
            console.error('Failed to load countries:', error);
        }
    };

    const handleGetHotels = async (countryCode: string) => {
        const country = countries.find(c => c.countryCode === countryCode);
        if (!country) return;

        setSelectedCountry(countryCode);
        setLoading(true);
        try {
            const result = await aiService.getHotels(country.countryName || countryCode);
            setHotels(result);
        } catch (error) {
            console.error('Failed to fetch hotels:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredCountries = () => {
        if (!searchQuery.trim()) return countries;
        const query = searchQuery.toLowerCase();
        return countries.filter(c =>
            (c.countryName || '').toLowerCase().includes(query) ||
            c.countryCode.toLowerCase().includes(query)
        );
    };

    const getRatingStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push('⭐');
        }
        if (hasHalfStar) {
            stars.push('⭐');
        }
        return stars.join('');
    };

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'ultra-luxury':
                return '#9333ea';
            case 'luxury':
                return '#eab308';
            case 'mid-range':
                return '#3b82f6';
            case 'budget':
                return '#22c55e';
            default:
                return '#6b7280';
        }
    };

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingTop: insets.top,
            paddingBottom: insets.bottom
        }}>
            <ScrollView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ padding: 24, paddingBottom: 16 }}>
                    <Text variant="headlineMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>
                        🏨 Top Hotels
                    </Text>
                    <Text style={{ color: 'gray', marginBottom: 16 }}>
                        Discover the best hotels in any country powered by AI
                    </Text>

                    {/* Country Selection */}
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{
                            backgroundColor: theme.colors.surface,
                            padding: 16,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: theme.colors.primary,
                            marginBottom: 16
                        }}
                    >
                        <Text style={{ color: 'gray', fontSize: 12, marginBottom: 4 }}>
                            Select Country
                        </Text>
                        <Text variant="bodyLarge" style={{ color: 'white', fontWeight: '500' }}>
                            {selectedCountry ? (
                                <>{getFlagEmoji(selectedCountry)} {countries.find(c => c.countryCode === selectedCountry)?.countryName || selectedCountry}</>
                            ) : 'Choose a country'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Loading */}
                {loading && <LoadingState theme={theme} />}

                {/* Hotels List */}
                {!loading && hotels && (
                    <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
                        <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 16 }}>
                            Top Hotels in {hotels.country}
                        </Text>

                        {hotels.hotels.map((hotel: any, index: number) => (
                            <Card
                                key={index}
                                style={{
                                    backgroundColor: theme.colors.surface,
                                    marginBottom: 16,
                                    overflow: 'hidden'
                                }}
                            >
                                <Card.Content style={{ padding: 16 }}>
                                    {/* Hotel Header */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>
                                                {hotel.name}
                                            </Text>
                                            <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                                                📍 {hotel.location}
                                            </Text>
                                        </View>
                                        <Chip
                                            mode="flat"
                                            style={{
                                                backgroundColor: `${getCategoryColor(hotel.category)}20`,
                                                marginLeft: 8
                                            }}
                                        >
                                            <Text style={{ color: getCategoryColor(hotel.category), fontSize: 11, fontWeight: 'bold' }}>
                                                {hotel.category}
                                            </Text>
                                        </Chip>
                                    </View>

                                    {/* Rating */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                        <Text style={{ fontSize: 18, marginRight: 8 }}>
                                            {getRatingStars(hotel.rating)}
                                        </Text>
                                        <Text style={{ color: 'gray', fontSize: 12 }}>
                                            {hotel.rating} / 5
                                        </Text>
                                    </View>

                                    {/* Description */}
                                    <Text style={{ color: '#d1d5db', marginBottom: 12, lineHeight: 20 }}>
                                        {hotel.description}
                                    </Text>

                                    {/* Price */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                        <Text style={{ color: theme.colors.primary, fontSize: 24, fontWeight: 'bold' }}>
                                            ${hotel.pricePerNight}
                                        </Text>
                                        <Text style={{ color: 'gray', marginLeft: 4 }}>
                                            / night
                                        </Text>
                                    </View>

                                    {/* Amenities */}
                                    <View>
                                        <Text variant="bodySmall" style={{ color: 'gray', marginBottom: 8 }}>
                                            Amenities:
                                        </Text>
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                            {hotel.amenities.map((amenity: string, i: number) => (
                                                <Chip
                                                    key={i}
                                                    mode="outlined"
                                                    compact
                                                    style={{ borderColor: theme.colors.primary }}
                                                >
                                                    <Text style={{ color: theme.colors.primary, fontSize: 11 }}>
                                                        {amenity}
                                                    </Text>
                                                </Chip>
                                            ))}
                                        </View>
                                    </View>
                                </Card.Content>
                            </Card>
                        ))}
                    </View>
                )}

                {/* Empty State */}
                {!loading && !hotels && (
                    <View style={{ padding: 24, alignItems: 'center' }}>
                        <Text style={{ fontSize: 64, marginBottom: 16 }}>🏨</Text>
                        <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>
                            Select a Country
                        </Text>
                        <Text style={{ color: 'gray', textAlign: 'center' }}>
                            Choose a country from above to discover the top hotels powered by AI
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Country Selection Modal */}
            <Modal
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                animationType="slide"
                transparent={true}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{
                        backgroundColor: theme.colors.background,
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        maxHeight: '80%',
                        paddingTop: 20
                    }}>
                        {/* Modal Header */}
                        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <Text variant="titleLarge" style={{ color: 'white', fontWeight: 'bold' }}>
                                    Select Country
                                </Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={{ color: theme.colors.primary, fontSize: 32 }}>×</Text>
                                </TouchableOpacity>
                            </View>

                            <Searchbar
                                placeholder="Search country..."
                                onChangeText={setSearchQuery}
                                value={searchQuery}
                                style={{ backgroundColor: theme.colors.surface }}
                                iconColor={theme.colors.primary}
                                inputStyle={{ color: 'white' }}
                                placeholderTextColor="gray"
                            />
                        </View>

                        {/* Country List */}
                        <FlatList
                            data={getFilteredCountries()}
                            keyExtractor={(item) => item.countryCode}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        handleGetHotels(item.countryCode);
                                        setModalVisible(false);
                                    }}
                                    style={{
                                        paddingHorizontal: 20,
                                        paddingVertical: 16,
                                        borderBottomWidth: 1,
                                        borderBottomColor: theme.colors.background
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 32, marginRight: 12 }}>
                                            {getFlagEmoji(item.countryCode)}
                                        </Text>
                                        <View style={{ flex: 1 }}>
                                            <Text variant="bodyLarge" style={{ color: 'white', fontWeight: '500' }}>
                                                {item.countryName || item.countryCode}
                                            </Text>
                                            <Text variant="bodySmall" style={{ color: 'gray' }}>
                                                {item.countryCode}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <Divider />}
                        />
                    </View>
                </View>
            </Modal>
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
