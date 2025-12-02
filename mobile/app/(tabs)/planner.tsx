import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, TouchableOpacity, Modal, FlatList, Animated, Easing } from 'react-native';
import { aiService, passportService, countryService } from '../../services';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Text,
    Card,
    Button,
    TextInput,
    ActivityIndicator,
    useTheme,
    Chip,
    Searchbar,
    Divider
} from 'react-native-paper';

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
            <Animated.Text style={{
                color: theme.colors.primary,
                fontSize: 18,
                fontWeight: 'bold',
                opacity: fadeValue,
                marginBottom: 8
            }}>
                <Text style={{ fontSize: 48 }}>✈️</Text>


            </Animated.Text>
            <Animated.Text style={{
                color: theme.colors.primary,
                fontSize: 18,
                fontWeight: 'bold',
                opacity: fadeValue,
                marginBottom: 8
            }}>


                AI is planning your trip...
            </Animated.Text>
            <Text style={{ color: 'gray', textAlign: 'center' }}>
                Creating a personalized itinerary based on your preferences and budget.
            </Text>
        </View>
    );
};

export default function PlannerScreen() {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [countriesLoading, setCountriesLoading] = useState(false);
    const [countries, setCountries] = useState<any[]>([]);
    const [fromCountry, setFromCountry] = useState('');
    const [toCountry, setToCountry] = useState('');
    const [budget, setBudget] = useState('');
    const [days, setDays] = useState('5'); // Default to 5 days
    const [tripPlan, setTripPlan] = useState<any>(null);
    const [visaReal, setVisaReal] = useState<any>(null);

    // Modal states
    const [fromModalVisible, setFromModalVisible] = useState(false);
    const [toModalVisible, setToModalVisible] = useState(false);
    const [fromSearch, setFromSearch] = useState('');
    const [toSearch, setToSearch] = useState('');

    const theme = useTheme();
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        loadCountries();
    }, []);

    const loadCountries = async () => {
        setCountriesLoading(true);
        try {
            // Prefer full countries list from backend for comprehensive selection
            const data = await countryService.listCountries();
            // Normalize to expeted shape { countryCode, countryName }
            let normalized = Array.isArray(data)
                ? data.map((c: any) => ({ countryCode: c.code || c.countryCode, countryName: c.name || c.countryName }))
                : [];

            // If we have fewer than 10 countries from the countries endpoint, fallback to passport rankings
            // which has more comprehensive data
            if (normalized.length < 10) {
                console.log('Countries list is small, falling back to passport rankings for more options');
                const rankings = await passportService.getRankings();
                // Merge with existing data to avoid duplicates, prioritizing passport rankings
                const countryCodeSet = new Set(normalized.map(c => c.countryCode));
                const additionalCountries = rankings.filter(r => !countryCodeSet.has(r.countryCode))
                    .map(r => ({ countryCode: r.countryCode, countryName: r.countryName || r.countryCode }));
                normalized = [...normalized, ...additionalCountries];
            }

            // Sort countries alphabetically by name for better UX
            normalized.sort((a, b) => {
                const nameA = (a.countryName || a.countryCode).toLowerCase();
                const nameB = (b.countryName || b.countryCode).toLowerCase();
                return nameA.localeCompare(nameB);
            });

            setCountries(normalized);
        } catch (error) {
            console.error('Failed to load countries:', error);
            // Fallback to passport rankings if list endpoint fails
            try {
                const rankings = await passportService.getRankings();
                setCountries(rankings);
            } catch (e) {
                console.error('Fallback to rankings failed:', e);
            }
        } finally {
            setCountriesLoading(false);
        }
    };

    const handleGeneratePlan = async () => {
        if (!fromCountry || !toCountry || !budget || !days) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Require authentication for AI endpoint
        if (!isAuthenticated) {
            Alert.alert(
                'Login Required',
                'You need to login to use the AI planner. Go to login now?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Login', onPress: () => router.push('/auth/login') },
                ]
            );
            return;
        }

        setLoading(true);
        try {
            // Call AI service with country names for better prompts
            const plan = await aiService.planTrip({
                from: getCountryName(fromCountry),
                to: getCountryName(toCountry),
                budget: parseFloat(budget),
                days: parseInt(days),
            });

            setTripPlan(plan);

            // Fetch real visa requirements from API for comparison
            try {
                const visa = await countryService.getVisaRequirements(fromCountry, toCountry);
                setVisaReal(visa);
            } catch (visaErr) {
                console.warn('Visa requirements fetch failed:', visaErr);
                setVisaReal(null);
            }
        } catch (error) {
            console.error('Failed to generate plan:', error);
            const err: any = error as any;
            // Extra diagnostics for API errors
            console.log('AI API error details', {
                status: err?.response?.status,
                url: err?.config?.url,
                method: err?.config?.method,
                data: err?.config?.data,
                responseData: err?.response?.data,
            });
            const isNetwork = typeof err?.message === 'string' && err.message.toLowerCase().includes('network');
            const status = err?.response?.status;
            const isUnauthorized = status === 401 || status === 400;
            if (isNetwork) {
                Alert.alert(
                    'Network Error',
                    'Cannot reach the API. Ensure backend is running and EXPO_PUBLIC_API_URL points to your machine IP for devices/emulators.'
                );
            }
            if (isUnauthorized) {
                Alert.alert('Unauthorized', 'Please login to use the AI planner.', [
                    { text: 'Login', onPress: () => router.push('/auth/login') }
                ]);
                setLoading(false);
                return;
            }

            // Fallback to mock data if API fails
            const fromCountryData = countries.find(c => c.countryCode === fromCountry);
            const toCountryData = countries.find(c => c.countryCode === toCountry);

            const mockPlan = {
                from: fromCountryData?.countryName || fromCountry,
                destination: toCountryData?.countryName || toCountry,
                totalCost: parseFloat(budget),
                currency: 'USD',
                visaRequired: true,
                visaWarning: 'Check visa requirements before traveling',
                itinerary: [
                    {
                        day: 1,
                        activity: `Arrival in ${toCountryData?.countryName || toCountry}, hotel check-in and city orientation`,
                        cost: Math.round(parseFloat(budget) * 0.15),
                        duration: '6 hours'
                    },
                    {
                        day: 2,
                        activity: 'Visit main attractions and cultural sites',
                        cost: Math.round(parseFloat(budget) * 0.20),
                        duration: '8 hours'
                    },
                    {
                        day: 3,
                        activity: 'Local food tour and shopping experience',
                        cost: Math.round(parseFloat(budget) * 0.18),
                        duration: '7 hours'
                    },
                    {
                        day: 4,
                        activity: 'Day trip to nearby attractions',
                        cost: Math.round(parseFloat(budget) * 0.25),
                        duration: '10 hours'
                    },
                    {
                        day: 5,
                        activity: 'Leisure day and departure preparation',
                        cost: Math.round(parseFloat(budget) * 0.12),
                        duration: '4 hours'
                    }
                ]
            };

            setTripPlan(mockPlan);
            setVisaReal(null);
        } finally {
            setLoading(false);
        }
    };

    const getCountryName = (code: string) => {
        const country = countries.find(c => c.countryCode === code);
        return country?.countryName || code;
    };

    const getFilteredCountries = (searchQuery: string) => {
        if (!searchQuery.trim()) return countries;
        const query = searchQuery.toLowerCase();
        return countries.filter(c =>
            c.countryName?.toLowerCase().includes(query) ||
            c.countryCode?.toLowerCase().includes(query)
        );
    };

    const CountryPickerModal = ({
        visible,
        onDismiss,
        onSelect,
        searchValue,
        onSearchChange,
        title
    }: any) => (
        <Modal
            visible={visible}
            onRequestClose={onDismiss}
            animationType="slide"
            transparent={true}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'flex-end'
            }}>
                <View style={{
                    backgroundColor: theme.colors.surface,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    maxHeight: '80%',
                    paddingTop: 20
                }}>
                    {/* Header */}
                    <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text variant="titleLarge" style={{ color: 'white', fontWeight: 'bold' }}>
                                {title}
                            </Text>
                            <Button onPress={onDismiss} textColor="white">Close</Button>
                        </View>

                        <Searchbar
                            placeholder="Search country..."
                            onChangeText={onSearchChange}
                            value={searchValue}
                            style={{ backgroundColor: theme.colors.background }}
                            iconColor={theme.colors.primary}
                            inputStyle={{ color: 'white' }}
                            placeholderTextColor="gray"
                        />
                    </View>

                    {/* Loading indicator or Country List */}
                    {countriesLoading ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={{ color: 'white', marginTop: 10 }}>Loading countries...</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={getFilteredCountries(searchValue)}
                            keyExtractor={(item) => item.countryCode}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        onSelect(item.countryCode);
                                        onDismiss();
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
                            extraData={countries}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingTop: insets.top,
            paddingBottom: insets.bottom
        }}>
            <ScrollView style={{ padding: 24 }}>
                {/* Header */}
                <View style={{ marginBottom: 24 }}>
                    <Text variant="headlineMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>
                        AI Travel Planner ✈️
                    </Text>
                    <Text style={{ color: 'gray' }}>
                        Create personalized travel itineraries with AI
                    </Text>
                </View>

                {loading ? (
                    <LoadingState theme={theme} />
                ) : (
                    <>
                        {/* Input Form */}
                        <Card style={{ backgroundColor: theme.colors.surface, marginBottom: 24 }}>
                            <Card.Content style={{ padding: 24 }}>
                                <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 20 }}>
                                    Plan Your Trip
                                </Text>

                                {/* From Country */}
                                <Text variant="bodyMedium" style={{ color: 'gray', marginBottom: 8 }}>
                                    From Country
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setFromModalVisible(true)}
                                    style={{ marginBottom: 16 }}
                                >
                                    <Card style={{ backgroundColor: theme.colors.background }}>
                                        <Card.Content style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                <Text style={{ fontSize: 24, marginRight: 12 }}>
                                                    {fromCountry ? getFlagEmoji(fromCountry) : '🌍'}
                                                </Text>
                                                <Text style={{ color: fromCountry ? 'white' : 'gray', flex: 1 }}>
                                                    {fromCountry ? getCountryName(fromCountry) : 'Select origin country'}
                                                </Text>
                                            </View>
                                            <Text style={{ color: theme.colors.primary }}>▼</Text>
                                        </Card.Content>
                                    </Card>
                                </TouchableOpacity>

                                {/* To Country */}
                                <Text variant="bodyMedium" style={{ color: 'gray', marginBottom: 8 }}>
                                    To Country (Destination)
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setToModalVisible(true)}
                                    style={{ marginBottom: 16 }}
                                >
                                    <Card style={{ backgroundColor: theme.colors.background }}>
                                        <Card.Content style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                <Text style={{ fontSize: 24, marginRight: 12 }}>
                                                    {toCountry ? getFlagEmoji(toCountry) : '✈️'}
                                                </Text>
                                                <Text style={{ color: toCountry ? 'white' : 'gray', flex: 1 }}>
                                                    {toCountry ? getCountryName(toCountry) : 'Select destination country'}
                                                </Text>
                                            </View>
                                            <Text style={{ color: theme.colors.primary }}>▼</Text>
                                        </Card.Content>
                                    </Card>
                                </TouchableOpacity>

                                {/* Number of Days */}
                                <TextInput
                                    label="Number of Days"
                                    placeholder="e.g., 5"
                                    value={days}
                                    onChangeText={setDays}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    style={{ marginBottom: 16, backgroundColor: theme.colors.background }}
                                    outlineColor={theme.colors.primary}
                                    activeOutlineColor={theme.colors.primary}
                                    textColor="white"
                                    left={<TextInput.Icon icon="calendar-range" />}
                                />

                                {/* Budget */}
                                <TextInput
                                    label="Budget (USD)"
                                    placeholder="e.g., 2500"
                                    value={budget}
                                    onChangeText={setBudget}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    style={{ marginBottom: 20, backgroundColor: theme.colors.background }}
                                    outlineColor={theme.colors.primary}
                                    activeOutlineColor={theme.colors.primary}
                                    textColor="white"
                                    left={<TextInput.Icon icon="currency-usd" />}
                                />

                                <Button
                                    mode="contained"
                                    onPress={handleGeneratePlan}
                                    disabled={loading}
                                    loading={loading}
                                    icon="magic-staff"
                                    style={{ paddingVertical: 8 }}
                                >
                                    Generate Travel Plan
                                </Button>
                            </Card.Content>
                        </Card>
                    </>
                )}

                {/* Trip Plan Result */}
                {tripPlan && (
                    <Card style={{ backgroundColor: theme.colors.surface, marginBottom: 24 }}>
                        <Card.Content style={{ padding: 24 }}>
                            <Text variant="titleLarge" style={{ color: 'white', fontWeight: 'bold', marginBottom: 16 }}>
                                Your Trip: {tripPlan.from} → {tripPlan.destination}
                            </Text>

                            {/* Cost Summary */}
                            <Card style={{ backgroundColor: `${theme.colors.primary}20`, marginBottom: 16 }}>
                                <Card.Content style={{ padding: 16 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View>
                                            <Text variant="bodySmall" style={{ color: theme.colors.primary, marginBottom: 4 }}>
                                                Total Budget
                                            </Text>
                                            <Text variant="headlineLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                                ${tripPlan.totalCost.toLocaleString()} {tripPlan.currency}
                                            </Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                            <Text variant="bodySmall" style={{ color: theme.colors.primary, marginBottom: 4 }}>
                                                Duration
                                            </Text>
                                            <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                                {tripPlan.days || 5} days
                                            </Text>
                                        </View>
                                    </View>
                                </Card.Content>
                            </Card>

                            {/* Visa Requirements (AI vs Real) */}
                            {(tripPlan.visaRequired || visaReal) && (
                                <Card style={{ backgroundColor: 'rgba(4, 143, 92, 0.1)', marginBottom: 16 }}>
                                    <Card.Content style={{ padding: 16 }}>
                                        <Text variant="titleSmall" style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: 8 }}>
                                            Visa Requirements
                                        </Text>
                                        <View style={{ marginBottom: 8 }}>
                                            <Text style={{ color: '#fbbf24' }}>
                                                {tripPlan.visaRequired ? (tripPlan.visaWarning || 'Visa may be required') : 'Visa not required'}
                                            </Text>
                                        </View>
                                        {visaReal && (
                                            <View>

                                                {visaReal.notes && (
                                                    <Text style={{ color: '#fbbf24', marginTop: 4 }}>
                                                        {visaReal.notes}
                                                    </Text>
                                                )}
                                            </View>
                                        )}
                                    </Card.Content>
                                </Card>
                            )}

                            {/* Hotels Section */}
                            {tripPlan.hotels && tripPlan.hotels.length > 0 && (
                                <View style={{ marginBottom: 20 }}>
                                    <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 12 }}>
                                        🏨 Recommended Hotels
                                    </Text>
                                    {tripPlan.hotels.map((hotel: any, index: number) => (
                                        <Card key={index} style={{ backgroundColor: theme.colors.background, marginBottom: 12 }}>
                                            <Card.Content style={{ padding: 16 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text variant="titleSmall" style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>
                                                            {hotel.name}
                                                        </Text>
                                                        <Text variant="bodySmall" style={{ color: 'gray' }}>
                                                            📍 {hotel.location}
                                                        </Text>
                                                    </View>
                                                    <View style={{ alignItems: 'flex-end' }}>
                                                        <Chip mode="flat" style={{ backgroundColor: `${theme.colors.primary}20` }}>
                                                            <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                                                ${hotel.pricePerNight}/night
                                                            </Text>
                                                        </Chip>
                                                        <Text variant="bodySmall" style={{ color: 'gray', marginTop: 4 }}>
                                                            {hotel.category}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </Card.Content>
                                        </Card>
                                    ))}
                                </View>
                            )}

                            {/* Itinerary */}
                            <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 16 }}>
                                📅 Daily Itinerary
                            </Text>

                            {tripPlan.itinerary.map((day: any, index: number) => (
                                <Card key={index} style={{ backgroundColor: theme.colors.background, marginBottom: 16 }}>
                                    <Card.Content style={{ padding: 16 }}>
                                        {/* Day Header */}
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                            <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                                Day {day.day}
                                            </Text>
                                            {day.totalDayCost && (
                                                <Chip mode="flat" style={{ backgroundColor: `${theme.colors.primary}20` }}>
                                                    <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                                        ${day.totalDayCost}
                                                    </Text>
                                                </Chip>
                                            )}
                                        </View>

                                        {/* Day Title */}
                                        {day.title && (
                                            <Text variant="titleSmall" style={{ color: 'white', fontWeight: '600', marginBottom: 12 }}>
                                                {day.title}
                                            </Text>
                                        )}

                                        {/* Activities - New format */}
                                        {day.activities && day.activities.length > 0 ? (
                                            <View style={{ marginBottom: 12 }}>
                                                <Text variant="bodyMedium" style={{ color: 'gray', marginBottom: 8 }}>
                                                    Activities:
                                                </Text>
                                                {day.activities.map((activity: any, actIndex: number) => (
                                                    <View key={actIndex} style={{ marginBottom: 10, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: theme.colors.primary }}>
                                                        <Text variant="bodySmall" style={{ color: theme.colors.primary, marginBottom: 2 }}>
                                                            ⏰ {activity.time}
                                                        </Text>
                                                        <Text style={{ color: 'white', marginBottom: 2 }}>
                                                            {activity.activity}
                                                        </Text>
                                                        <Text variant="bodySmall" style={{ color: 'gray' }}>
                                                            📍 {activity.location} • {activity.duration} • ${activity.cost}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        ) : (
                                            /* Fallback to old simple format */
                                            day.activity && (
                                                <View style={{ marginBottom: 12 }}>
                                                    <Text style={{ color: 'white', marginBottom: 8 }}>
                                                        {day.activity}
                                                    </Text>
                                                    <Text variant="bodySmall" style={{ color: 'gray' }}>
                                                        ⏱️ Duration: {day.duration} • ${day.cost}
                                                    </Text>
                                                </View>
                                            )
                                        )}

                                        {/* Meals */}
                                        {day.meals && day.meals.length > 0 && (
                                            <View>
                                                <Text variant="bodyMedium" style={{ color: 'gray', marginBottom: 8 }}>
                                                    Meals:
                                                </Text>
                                                {day.meals.map((meal: any, mealIndex: number) => (
                                                    <View key={mealIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                                        <Text style={{ color: 'white' }}>
                                                            🍽️ {meal.type}: {meal.restaurant}
                                                        </Text>
                                                        <Text style={{ color: theme.colors.primary }}>
                                                            ${meal.cost}
                                                        </Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </Card.Content>
                                </Card>
                            ))}
                        </Card.Content>
                    </Card>
                )}
            </ScrollView>

            {/* Country Picker Modals */}
            <CountryPickerModal
                visible={fromModalVisible}
                onDismiss={() => {
                    setFromModalVisible(false);
                    setFromSearch('');
                }}
                onSelect={setFromCountry}
                searchValue={fromSearch}
                onSearchChange={setFromSearch}
                title="Select Origin Country"
            />

            <CountryPickerModal
                visible={toModalVisible}
                onDismiss={() => {
                    setToModalVisible(false);
                    setToSearch('');
                }}
                onSelect={setToCountry}
                searchValue={toSearch}
                onSearchChange={setToSearch}
                title="Select Destination"
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