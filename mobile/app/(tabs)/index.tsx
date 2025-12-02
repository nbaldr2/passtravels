import React, { useState, useEffect } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { passportService } from '../../services';
import {
  Text,
  Card,
  Searchbar,
  ActivityIndicator,
  useTheme,
  Avatar,
  Chip
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = async () => {
    try {
      const data = await passportService.getRankings();
      console.log('Loaded rankings:', data);
      setRankings(data);
    } catch (error) {
      console.error('Failed to load rankings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRankings();
    setRefreshing(false);
  };

  const searchNormalized = searchQuery.trim().toLowerCase();
  const filteredRankings = rankings.filter((passport) => {
    if (!searchNormalized) return true;
    const code = String(passport.countryCode || '').toLowerCase();
    const rankValue = String(passport.rank || '').toLowerCase();
    return code.includes(searchNormalized) || rankValue.includes(searchNormalized);
  });

  const topPassport = rankings[0];
  const averageMobilityScore = rankings.length
    ? Math.round(
      rankings.reduce((sum, passport) => sum + Number(passport?.mobilityScore || 0), 0) /
      rankings.length,
    )
    : 0;

  if (isLoading || loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={{ padding: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <View>
            <Text variant="bodySmall" style={{ color: 'gray' }}>Welcome back,</Text>
            <Text variant="headlineMedium" style={{ color: 'white', fontWeight: 'bold' }}>
              {user?.email?.split('@')[0] || 'Traveler'}
            </Text>
          </View>
          <Avatar.Text
            size={40}
            label={user?.email?.charAt(0).toUpperCase() || 'U'}
            style={{ backgroundColor: theme.colors.primary }}
          />
        </View>

        {/* Search */}
        <Searchbar
          placeholder="Search country or passport..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ marginBottom: 24, backgroundColor: theme.colors.surface }}
          iconColor={theme.colors.primary}
          inputStyle={{ color: 'white' }}
          placeholderTextColor="gray"
        />

        {/* Stats */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
          <Card style={{ width: '30%', backgroundColor: theme.colors.surface, alignItems: 'center', padding: 12 }}>
            <Text variant="bodySmall" style={{ color: 'gray' }}>Top Passport</Text>
            <Text variant="headlineSmall" style={{ color: 'white', fontWeight: 'bold' }}>
              {topPassport ? topPassport.countryCode : '--'}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
              #{topPassport?.rank || '--'}
            </Text>
          </Card>

          <Card style={{ width: '30%', backgroundColor: theme.colors.surface, alignItems: 'center', padding: 12 }}>
            <Text variant="bodySmall" style={{ color: 'gray' }}>Avg Mobility</Text>
            <Text variant="headlineSmall" style={{ color: 'white', fontWeight: 'bold' }}>
              {averageMobilityScore || '--'}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.primary }}>Countries</Text>
          </Card>

          <Card style={{ width: '30%', backgroundColor: theme.colors.surface, alignItems: 'center', padding: 12 }}>
            <Text variant="bodySmall" style={{ color: 'gray' }}>Total</Text>
            <Text variant="headlineSmall" style={{ color: 'white', fontWeight: 'bold' }}>
              {rankings.length}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.primary }}>Passports</Text>
          </Card>
        </View>

        {/* Hero Card */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 24, borderRadius: 16, marginBottom: 24 }}
        >
          <Chip mode="flat" style={{ alignSelf: 'flex-start', marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>PREMIUM</Text>
          </Chip>
          <Text variant="headlineMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>
            Travel Smarter
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>
            Unlock visa-free access to 190+ countries with AI planning.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/planner')}
            style={{
              backgroundColor: 'white',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 12,
              alignSelf: 'flex-start'
            }}
          >
            <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Start Planning</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Top Passports */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text variant="titleLarge" style={{ color: 'white', fontWeight: 'bold' }}>Top Passports</Text>
          <TouchableOpacity onPress={() => router.push('/passports/all')}>
            <Text style={{ color: theme.colors.primary }}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {filteredRankings.slice(0, 10).map((passport) => (
            <Card
              key={passport.countryCode}
              style={{ width: 140, marginRight: 12, backgroundColor: theme.colors.surface }}
              onPress={() => router.push(`/passport/${passport.countryCode}`)}
            >
              <Card.Content style={{ alignItems: 'center', padding: 16 }}>
                <View style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: theme.colors.background,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8
                }}>
                  <Text style={{ fontSize: 24 }}>{getFlagEmoji(passport.countryCode)}</Text>
                </View>
                <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>
                  {passport.countryName || passport.countryCode}
                </Text>
                <Text variant="bodySmall" style={{ color: 'gray', marginBottom: 4 }}>
                  {passport.countryCode} • Rank #{passport.rank}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                  {passport.mobilityScore} countries
                </Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        {/* Features */}
        <Text variant="titleLarge" style={{ color: 'white', fontWeight: 'bold', marginBottom: 16 }}>
          Explore Features
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
          <Card
            style={{ width: '48%', backgroundColor: '#1e3a8a' }}
            onPress={() => router.push('/map')}
          >
            <Card.Content style={{ alignItems: 'center', padding: 20 }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(99, 102, 241, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12
              }}>
                <Text style={{ fontSize: 24 }}>🗺️</Text>
              </View>
              <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>
                World Map
              </Text>
              <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                Interactive visa map
              </Text>
            </Card.Content>
          </Card>

          <Card
            style={{ width: '48%', backgroundColor: '#581c87' }}
            onPress={() => router.push('/planner')}
          >
            <Card.Content style={{ alignItems: 'center', padding: 20 }}>
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(139, 92, 246, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12
              }}>
                <Text style={{ fontSize: 24 }}>✈️</Text>
              </View>
              <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }}>
                AI Planner
              </Text>
              <Text variant="bodySmall" style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
                Smart itineraries
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