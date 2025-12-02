import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { passportService } from '../../services';
import {
  Text,
  Card,
  ActivityIndicator,
  useTheme,
  Chip,
  Searchbar,
  SegmentedButtons
} from 'react-native-paper';

const { width } = Dimensions.get('window');

// Helper function to get flag emoji from country code
function getFlagEmoji(countryCode: string) {
  if (!countryCode) return '🏳️';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [viewMode, setViewMode] = useState('map');
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

  // Country coordinates for map visualization (expanded list)
  const countryCoordinates: Record<string, { lat: number; lon: number }> = {
    // Asia
    'JP': { lat: 36, lon: 138 },
    'SG': { lat: 1.3, lon: 103.8 },
    'KR': { lat: 37, lon: 127 },
    'CN': { lat: 35, lon: 105 },
    'IN': { lat: 20, lon: 77 },
    'TH': { lat: 15, lon: 100 },
    'MY': { lat: 4, lon: 102 },
    'ID': { lat: -2, lon: 118 },
    'PH': { lat: 13, lon: 122 },
    'VN': { lat: 16, lon: 108 },
    'AE': { lat: 24, lon: 54 },
    'QA': { lat: 25, lon: 51 },
    'SA': { lat: 24, lon: 45 },
    'IL': { lat: 31, lon: 35 },
    'TR': { lat: 39, lon: 35 },
    'PK': { lat: 30, lon: 70 },
    'BD': { lat: 24, lon: 90 },

    // Europe
    'DE': { lat: 51, lon: 9 },
    'FR': { lat: 46, lon: 2 },
    'ES': { lat: 40, lon: -4 },
    'IT': { lat: 42, lon: 12 },
    'GB': { lat: 54, lon: -2 },
    'NL': { lat: 52, lon: 5 },
    'CH': { lat: 47, lon: 8 },
    'SE': { lat: 62, lon: 15 },
    'NO': { lat: 62, lon: 10 },
    'DK': { lat: 56, lon: 10 },
    'FI': { lat: 64, lon: 26 },
    'PL': { lat: 52, lon: 20 },
    'PT': { lat: 39, lon: -8 },
    'GR': { lat: 39, lon: 22 },
    'AT': { lat: 47, lon: 13 },
    'BE': { lat: 51, lon: 4 },
    'IE': { lat: 53, lon: -8 },
    'CZ': { lat: 50, lon: 15 },
    'RO': { lat: 46, lon: 25 },
    'HU': { lat: 47, lon: 20 },

    // Americas
    'US': { lat: 38, lon: -97 },
    'CA': { lat: 56, lon: -106 },
    'BR': { lat: -10, lon: -55 },
    'MX': { lat: 23, lon: -102 },
    'AR': { lat: -34, lon: -64 },
    'CL': { lat: -30, lon: -71 },
    'CO': { lat: 4, lon: -72 },
    'PE': { lat: -10, lon: -76 },
    'VE': { lat: 8, lon: -66 },
    'UY': { lat: -33, lon: -56 },

    // Oceania
    'AU': { lat: -25, lon: 133 },
    'NZ': { lat: -41, lon: 174 },

    // Africa
    'MA': { lat: 32, lon: -6 },
    'EG': { lat: 26, lon: 30 },
    'ZA': { lat: -29, lon: 24 },
    'NG': { lat: 10, lon: 8 },
    'KE': { lat: 1, lon: 38 },
    'ET': { lat: 8, lon: 39 },
    'TN': { lat: 34, lon: 9 },
    'GH': { lat: 8, lon: -2 },
  };

  // Group countries by region
  const regions = {
    'All': rankings,
    'Strongest': rankings.filter(p => (p.mobilityScore || 0) >= 170),
    'Asia': rankings.filter(p => ['JP', 'SG', 'KR', 'CN', 'IN', 'TH', 'MY', 'ID', 'PH', 'VN', 'AE', 'QA', 'SA', 'IL', 'TR', 'PK', 'BD'].includes(p.countryCode)),
    'Europe': rankings.filter(p => ['DE', 'FR', 'ES', 'IT', 'GB', 'NL', 'CH', 'SE', 'NO', 'DK', 'FI', 'PL', 'PT', 'GR', 'AT', 'BE', 'IE', 'CZ', 'RO', 'HU'].includes(p.countryCode)),
    'Americas': rankings.filter(p => ['US', 'CA', 'BR', 'MX', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY'].includes(p.countryCode)),
    'Oceania': rankings.filter(p => ['AU', 'NZ'].includes(p.countryCode)),
    'Middle East': rankings.filter(p => ['AE', 'QA', 'SA', 'IL', 'TR'].includes(p.countryCode)),
    'Africa': rankings.filter(p => ['MA', 'EG', 'ZA', 'NG', 'KE', 'ET', 'TN', 'GH'].includes(p.countryCode)),
  };

  const searchNormalized = searchQuery.trim().toLowerCase();
  const filteredCountries = (regions[selectedRegion as keyof typeof regions] || rankings).filter((passport) => {
    if (!searchNormalized) return true;
    const code = String(passport.countryCode || '').toLowerCase();
    const name = String(passport.countryName || '').toLowerCase();
    return code.includes(searchNormalized) || name.includes(searchNormalized);
  });

  // Get color based on mobility score
  const getScoreColor = (score: number) => {
    if (score >= 180) return '#22c55e'; // Green - Excellent
    if (score >= 150) return '#3b82f6'; // Blue - Very Good
    if (score >= 100) return '#f59e0b'; // Orange - Good
    if (score >= 60) return '#ef4444';  // Red - Fair
    return '#9ca3af'; // Gray - Limited
  };

  // Convert lat/lon to screen position (simple mercator-like projection)
  const getMapPosition = (lat: number, lon: number) => {
    const mapWidth = width - 48;
    const mapHeight = 350; // Updated to match new map height

    // Simple mercator projection
    const x = ((lon + 180) / 360) * mapWidth;
    const y = ((90 - lat) / 180) * mapHeight;

    return { x, y };
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: 'gray', marginTop: 16 }}>Loading global data...</Text>
      </View>
    );
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: insets.top,

    }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ padding: 24, paddingBottom: 16 }}>
          <Text variant="headlineMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>
            🌍 Discover Passports
          </Text>
          <Text style={{ color: 'gray', marginBottom: 16 }}>
            Explore global mobility and passport power
          </Text>

          {/* Quick Stats */}
          <View style={{
            flexDirection: 'row',
            gap: 12,
            marginBottom: 16,
            flexWrap: 'wrap'
          }}>
            <Card style={{
              flex: 1,
              minWidth: '45%',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 1,
              borderColor: 'rgba(59, 130, 246, 0.3)'
            }}>
              <Card.Content style={{ padding: 12 }}>
                <Text style={{ color: 'gray', fontSize: 11, marginBottom: 4 }}>Total Countries</Text>
                <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                  {rankings.length}
                </Text>
              </Card.Content>
            </Card>
            <Card style={{
              flex: 1,
              minWidth: '45%',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderWidth: 1,
              borderColor: 'rgba(34, 197, 94, 0.3)'
            }}>
              <Card.Content style={{ padding: 12 }}>
                <Text style={{ color: 'gray', fontSize: 11, marginBottom: 4 }}>Strongest</Text>
                <Text variant="headlineSmall" style={{ color: '#22c55e', fontWeight: 'bold' }}>
                  {Math.max(...rankings.map(p => p.mobilityScore || 0))}
                </Text>
              </Card.Content>
            </Card>
          </View>

          {/* View Mode Toggle */}
          <SegmentedButtons
            value={viewMode}
            onValueChange={setViewMode}
            buttons={[
              { value: 'map', label: 'Map View', icon: 'map' },
              { value: 'grid', label: 'Grid View', icon: 'view-grid' },
            ]}
            style={{ marginBottom: 16 }}
          />

          {/* Search */}
          <Searchbar
            placeholder="Search country..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{ marginBottom: 16, backgroundColor: theme.colors.surface }}
            iconColor={theme.colors.primary}
            inputStyle={{ color: 'white' }}
            placeholderTextColor="gray"
          />

          {/* Region Filters */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {Object.keys(regions).map((region) => (
              <Chip
                key={region}
                mode={selectedRegion === region ? 'flat' : 'outlined'}
                selected={selectedRegion === region}
                onPress={() => setSelectedRegion(region)}
                style={{
                  marginRight: 8,
                  backgroundColor: selectedRegion === region ? theme.colors.primary : 'transparent',
                  borderColor: theme.colors.primary
                }}
                textStyle={{ color: selectedRegion === region ? 'white' : theme.colors.primary }}
              >
                {region}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Top 10 Passports Section */}
        {!searchQuery && selectedRegion === 'All' && (
          <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold' }}>
                🏆 Top 10 Strongest Passports
              </Text>
              <TouchableOpacity onPress={() => setViewMode('grid')}>
                <Text style={{ color: theme.colors.primary, fontSize: 12 }}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {rankings
                .sort((a, b) => (b.mobilityScore || 0) - (a.mobilityScore || 0))
                .slice(0, 10)
                .map((passport, index) => (
                  <TouchableOpacity
                    key={passport.countryCode}
                    onPress={() => router.push(`/passport/${passport.countryCode}`)}
                    style={{ marginRight: 12, width: 140 }}
                  >
                    <Card style={{
                      backgroundColor: theme.colors.surface,
                      borderWidth: index < 3 ? 2 : 0,
                      borderColor: index === 0 ? '#fbbf24' : index === 1 ? '#d1d5db' : index === 2 ? '#fb923c' : 'transparent'
                    }}>
                      <Card.Content style={{ padding: 12, alignItems: 'center' }}>
                        {/* Rank Badge */}
                        <View style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#d1d5db' : index === 2 ? '#fb923c' : theme.colors.primary,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 2,
                          borderColor: theme.colors.background
                        }}>
                          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                            {index + 1}
                          </Text>
                        </View>

                        {/* Flag */}
                        <Text style={{ fontSize: 48, marginBottom: 8 }}>
                          {getFlagEmoji(passport.countryCode)}
                        </Text>

                        {/* Country Name */}
                        <Text
                          variant="bodySmall"
                          style={{ color: 'white', fontWeight: '600', textAlign: 'center', marginBottom: 4 }}
                          numberOfLines={2}
                        >
                          {passport.countryName || passport.countryCode}
                        </Text>

                        {/* Score */}
                        <Chip
                          mode="flat"
                          compact
                          style={{
                            backgroundColor: `${getScoreColor(passport.mobilityScore)}20`,
                            marginTop: 4
                          }}
                        >
                          <Text style={{
                            color: getScoreColor(passport.mobilityScore),
                            fontSize: 11,
                            fontWeight: 'bold'
                          }}>
                            {passport.mobilityScore}
                          </Text>
                        </Chip>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}

        {/* Map View */}
        {viewMode === 'map' && (
          <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
            <Card style={{ backgroundColor: theme.colors.surface, overflow: 'hidden', borderWidth: 2, borderColor: theme.colors.primary }}>
              <Card.Content style={{ padding: 0 }}>
                {/* World Map Visualization */}
                <View style={{ width: width - 48, height: 350, backgroundColor: '#0f172a', position: 'relative', borderRadius: 12, overflow: 'hidden' }}>

                  {/* World Map Background - High contrast Equirectangular projection */}
                  <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png' }}
                    style={{
                      position: 'absolute',
                      width: width - 48,
                      height: 350,
                      opacity: 0.4, // Increased opacity for better visibility
                      resizeMode: 'stretch', // Stretch to match the coordinate system
                      tintColor: '#3b82f6' // Tint it blue to match the theme
                    }}
                  />

                  {/* Enhanced Grid lines */}
                  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.3 }}>
                    {/* Horizontal lines - latitude */}
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <View key={`h${i}`} style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: i * 50,
                        height: i === 3 ? 2 : 1, // Thicker equator line
                        backgroundColor: i === 3 ? '#3b82f6' : '#334155'
                      }} />
                    ))}
                    {/* Vertical lines - longitude */}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <View key={`v${i}`} style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: i * ((width - 48) / 8),
                        width: i === 4 ? 2 : 1, // Thicker prime meridian
                        backgroundColor: i === 4 ? '#3b82f6' : '#334155'
                      }} />
                    ))}
                  </View>

                  {/* Title overlay */}
                  <View style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: theme.colors.primary
                  }}>
                    <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                      🌍 Interactive World Map
                    </Text>
                  </View>

                  {/* Country markers with enhanced styling */}
                  {filteredCountries.map((passport) => {
                    const coords = countryCoordinates[passport.countryCode];
                    if (!coords) return null;

                    const pos = getMapPosition(coords.lat, coords.lon);
                    const color = getScoreColor(passport.mobilityScore);

                    return (
                      <TouchableOpacity
                        key={passport.countryCode}
                        onPress={() => router.push(`/passport/${passport.countryCode}`)}
                        style={{
                          position: 'absolute',
                          left: pos.x - 18,
                          top: pos.y - 18,
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: color,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 3,
                          borderColor: 'white',
                          shadowColor: color,
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.9,
                          shadowRadius: 10,
                          elevation: 8,
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>{getFlagEmoji(passport.countryCode)}</Text>
                      </TouchableOpacity>
                    );
                  })}

                  {/* Bottom stats bar */}
                  <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.primary
                  }}>
                    <View style={{ alignItems: 'center' }}>
                      <Text variant="bodySmall" style={{ color: 'gray', fontSize: 10 }}>
                        Total
                      </Text>
                      <Text variant="bodyMedium" style={{ color: 'white', fontWeight: 'bold' }}>
                        {filteredCountries.length}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text variant="bodySmall" style={{ color: 'gray', fontSize: 10 }}>
                        Top Score
                      </Text>
                      <Text variant="bodyMedium" style={{ color: '#22c55e', fontWeight: 'bold' }}>
                        {Math.max(...filteredCountries.map(p => p.mobilityScore || 0))}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text variant="bodySmall" style={{ color: 'gray', fontSize: 10 }}>
                        Region
                      </Text>
                      <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                        {selectedRegion}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Map Legend */}
                <View style={{ padding: 16, backgroundColor: theme.colors.background }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: theme.colors.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 8
                    }}>
                      <Text style={{ fontSize: 12 }}>👆</Text>
                    </View>
                    <Text variant="bodySmall" style={{ color: 'white', fontWeight: '500' }}>
                      Tap any country marker to view passport details
                    </Text>
                  </View>
                  <Text variant="bodySmall" style={{ color: 'gray', fontSize: 11 }}>
                    Colors indicate mobility score: Green=Excellent, Blue=Very Good, Orange=Good, Red=Fair, Gray=Limited
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Legend */}
        <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
          <Text variant="titleSmall" style={{ color: 'white', fontWeight: 'bold', marginBottom: 12 }}>
            Mobility Score Legend
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: 'Excellent (180+)', color: '#22c55e' },
              { label: 'Very Good (150+)', color: '#3b82f6' },
              { label: 'Good (100+)', color: '#f59e0b' },
              { label: 'Fair (60+)', color: '#ef4444' },
              { label: 'Limited (<60)', color: '#9ca3af' },
            ].map((item) => (
              <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, marginBottom: 8 }}>
                <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: item.color, marginRight: 6 }} />
                <Text variant="bodySmall" style={{ color: 'gray' }}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Country Grid */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
          <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 16 }}>
            {selectedRegion} ({filteredCountries.length} countries)
          </Text>

          {filteredCountries.length === 0 ? (
            <View style={{ alignItems: 'center', padding: 32, backgroundColor: theme.colors.surface, borderRadius: 12 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
              <Text variant="titleMedium" style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>
                No countries found
              </Text>
              <Text style={{ color: 'gray', textAlign: 'center' }}>
                Try adjusting your search or filters to find what you're looking for.
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {filteredCountries.map((passport) => (
                <TouchableOpacity
                  key={passport.countryCode}
                  onPress={() => router.push(`/passport/${passport.countryCode}`)}
                  style={{ width: (width - 60) / 2 }}
                >
                  <Card style={{ backgroundColor: theme.colors.surface }}>
                    <Card.Content style={{ padding: 16 }}>
                      {/* Flag and Score Indicator */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          backgroundColor: theme.colors.background,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          <Text style={{ fontSize: 28 }}>{getFlagEmoji(passport.countryCode)}</Text>
                        </View>
                        <View style={{
                          width: 12,
                          height: 12,
                          borderRadius: 6,
                          backgroundColor: getScoreColor(passport.mobilityScore)
                        }} />
                      </View>

                      {/* Country Info */}
                      <Text variant="titleSmall" style={{ color: 'white', fontWeight: 'bold', marginBottom: 4 }} numberOfLines={1}>
                        {passport.countryName || passport.countryCode}
                      </Text>
                      <Text variant="bodySmall" style={{ color: 'gray', marginBottom: 8 }}>
                        Rank #{passport.rank}
                      </Text>
                      <Chip
                        mode="flat"
                        compact
                        style={{ alignSelf: 'flex-start', backgroundColor: `${getScoreColor(passport.mobilityScore)}20` }}
                      >
                        <Text style={{ color: getScoreColor(passport.mobilityScore), fontSize: 11, fontWeight: 'bold' }}>
                          {passport.mobilityScore} access
                        </Text>
                      </Chip>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}