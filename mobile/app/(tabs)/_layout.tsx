import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { View } from 'react-native';

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: '#2d2d44',
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 12,
          paddingTop: 12,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused, size }) => (
            <View style={{ transform: [{ scale: focused ? 1.05 : 1 }] }}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused, size }) => (
            <View style={{ transform: [{ scale: focused ? 1.05 : 1 }] }}>
              <Ionicons
                name={focused ? 'compass' : 'compass-outline'}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="hotels"
        options={{
          title: 'Hotels',
          tabBarIcon: ({ color, focused, size }) => (
            <View style={{ transform: [{ scale: focused ? 1.05 : 1 }] }}>
              <Ionicons
                name={focused ? 'bed' : 'bed-outline'}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: 'Planner',
          tabBarIcon: ({ color, focused, size }) => (
            <View style={{ transform: [{ scale: focused ? 1.05 : 1 }] }}>
              <Ionicons
                name={focused ? 'airplane' : 'airplane-outline'}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused, size }) => (
            <View style={{ transform: [{ scale: focused ? 1.05 : 1 }] }}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={size}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}