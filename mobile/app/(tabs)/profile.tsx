import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { userService } from '../../services';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';
import {
    Text,
    Card,
    Button,
    Avatar,
    List,
    Divider,
    useTheme,
    Switch,
    TextInput,
    Portal,
    Modal,
    ActivityIndicator
} from 'react-native-paper';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editForm, setEditForm] = useState({ fullName: '', bio: '' });
    const [saving, setSaving] = useState(false);
    const [checkingUpdates, setCheckingUpdates] = useState(false);
    const [updateInfo, setUpdateInfo] = useState<{ isAvailable: boolean } | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await userService.getProfile();
            setProfile(data);
            setEditForm({
                fullName: data.fullName || '',
                bio: data.bio || ''
            });
        } catch (error) {
            console.error('Failed to load profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        setSaving(true);
        try {
            const updated = await userService.updateProfile(editForm);
            setProfile(updated);
            setEditModalVisible(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const toggleNotifications = async (value: boolean) => {
        // Optimistic update
        setProfile((prev: any) => ({ ...prev, notificationsEnabled: value }));
        try {
            await userService.updateProfile({ notificationsEnabled: value });
        } catch (error) {
            // Revert on failure
            setProfile((prev: any) => ({ ...prev, notificationsEnabled: !value }));
            Alert.alert('Error', 'Failed to update settings');
        }
    };

    // Add this function to check for updates
    const checkForAppUpdates = async () => {
        setCheckingUpdates(true);
        try {
            const update = await Updates.checkForUpdateAsync();
            setUpdateInfo(update);
            
            if (update.isAvailable) {
                Alert.alert(
                    'Update Available',
                    'A new version of PassTravels is available. Would you like to update now?',
                    [
                        {
                            text: 'Later',
                            style: 'cancel',
                        },
                        {
                            text: 'Update',
                            onPress: async () => {
                                await Updates.fetchUpdateAsync();
                                await Updates.reloadAsync();
                            },
                        },
                    ]
                );
            } else {
                Alert.alert('Up to Date', 'You are using the latest version of PassTravels.');
            }
        } catch (error) {
            console.error('Error checking for updates:', error);
            Alert.alert('Error', 'Failed to check for updates. Please try again later.');
        } finally {
            setCheckingUpdates(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        router.replace('/auth/login');
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingTop: insets.top,
            paddingBottom: insets.bottom
        }}>
            <ScrollView style={{ padding: 24 }}>
                {/* Header */}
                <View style={{ alignItems: 'center', marginBottom: 32 }}>
                    <View style={{ position: 'relative' }}>
                        <Avatar.Text
                            size={100}
                            label={profile?.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                            style={{ backgroundColor: theme.colors.primary, marginBottom: 16 }}
                        />
                        <View style={{
                            position: 'absolute',
                            bottom: 16,
                            right: 0,
                            backgroundColor: '#4ade80',
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            borderWidth: 3,
                            borderColor: theme.colors.background
                        }} />
                    </View>

                    <Text variant="headlineMedium" style={{ color: 'white', fontWeight: 'bold' }}>
                        {profile?.fullName || user?.email?.split('@')[0] || 'Traveler'}
                    </Text>
                    <Text variant="bodyMedium" style={{ color: 'gray', marginBottom: 8 }}>
                        {user?.email || 'Not logged in'}
                    </Text>
                    {profile?.bio && (
                        <Text variant="bodySmall" style={{ color: 'gray', marginBottom: 16, textAlign: 'center' }}>
                            {profile.bio}
                        </Text>
                    )}

                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                        <Button
                            mode="outlined"
                            textColor={theme.colors.primary}
                            style={{ borderColor: theme.colors.primary }}
                            onPress={() => setEditModalVisible(true)}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            mode="contained"
                            buttonColor={theme.colors.primary}
                        >
                            Upgrade Plan
                        </Button>
                    </View>
                </View>

                {/* Stats */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}>
                    <Card style={{ flex: 1, marginRight: 8, backgroundColor: theme.colors.surface }}>
                        <Card.Content style={{ alignItems: 'center', padding: 16 }}>
                            <Text variant="headlineMedium" style={{ color: 'white', fontWeight: 'bold' }}>12</Text>
                            <Text variant="bodySmall" style={{ color: 'gray' }}>Countries</Text>
                        </Card.Content>
                    </Card>
                    <Card style={{ flex: 1, marginLeft: 8, backgroundColor: theme.colors.surface }}>
                        <Card.Content style={{ alignItems: 'center', padding: 16 }}>
                            <Text variant="headlineMedium" style={{ color: 'white', fontWeight: 'bold' }}>4</Text>
                            <Text variant="bodySmall" style={{ color: 'gray' }}>Trips Planned</Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Settings Sections */}
                <Card style={{ backgroundColor: theme.colors.surface, marginBottom: 24 }}>
                    <List.Section>
                        <List.Subheader style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Account Settings</List.Subheader>

                        <List.Item
                            title="Personal Information"
                            titleStyle={{ color: 'white' }}
                            left={props => <List.Icon {...props} icon="account" color={theme.colors.primary} />}
                            right={props => <List.Icon {...props} icon="chevron-right" color="gray" />}
                            onPress={() => setEditModalVisible(true)}
                        />
                        <Divider style={{ backgroundColor: theme.colors.background }} />

                        <List.Item
                            title="Notifications"
                            titleStyle={{ color: 'white' }}
                            left={props => <List.Icon {...props} icon="bell" color={theme.colors.primary} />}
                            right={props => <Switch value={profile?.notificationsEnabled ?? true} onValueChange={toggleNotifications} color={theme.colors.primary} />}
                        />
                    </List.Section>
                </Card>

                {/* App Updates Section */}
                <Card style={{ backgroundColor: theme.colors.surface, marginBottom: 24 }}>
                    <List.Section>
                        <List.Subheader style={{ color: theme.colors.primary, fontWeight: 'bold' }}>App Updates</List.Subheader>

                        <List.Item
                            title="Check for Updates"
                            titleStyle={{ color: 'white' }}
                            description={updateInfo?.isAvailable ? "Update available" : "Check for the latest version"}
                            descriptionStyle={{ color: updateInfo?.isAvailable ? theme.colors.primary : 'gray' }}
                            left={props => <List.Icon {...props} icon="update" color={theme.colors.primary} />}
                            right={props => checkingUpdates ? <ActivityIndicator size="small" color={theme.colors.primary} /> : <List.Icon {...props} icon="chevron-right" color="gray" />}
                            onPress={checkForAppUpdates}
                        />
                        
                        <Divider style={{ backgroundColor: theme.colors.background }} />
                        
                        <List.Item
                            title="Current Version"
                            titleStyle={{ color: 'white' }}
                            description={`v${Updates.updateId || '1.0.0'}`}
                            descriptionStyle={{ color: 'gray' }}
                            left={props => <List.Icon {...props} icon="information" color={theme.colors.primary} />}
                        />
                    </List.Section>
                </Card>

                <Button
                    mode="outlined"
                    textColor="#ef4444"
                    style={{ borderColor: '#ef4444', marginBottom: 40 }}
                    icon="logout"
                    onPress={handleLogout}
                >
                    Log Out
                </Button>
            </ScrollView>

            {/* Edit Profile Modal */}
            <Portal>
                <Modal visible={editModalVisible} onDismiss={() => setEditModalVisible(false)} contentContainerStyle={{ backgroundColor: theme.colors.surface, padding: 20, margin: 20, borderRadius: 8 }}>
                    <Text variant="headlineSmall" style={{ color: 'white', marginBottom: 16 }}>Edit Profile</Text>

                    <TextInput
                        label="Full Name"
                        value={editForm.fullName}
                        onChangeText={text => setEditForm(prev => ({ ...prev, fullName: text }))}
                        style={{ marginBottom: 16, backgroundColor: theme.colors.background }}
                        textColor="white"
                    />

                    <TextInput
                        label="Bio"
                        value={editForm.bio}
                        onChangeText={text => setEditForm(prev => ({ ...prev, bio: text }))}
                        multiline
                        numberOfLines={3}
                        style={{ marginBottom: 24, backgroundColor: theme.colors.background }}
                        textColor="white"
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                        <Button onPress={() => setEditModalVisible(false)} textColor="gray">Cancel</Button>
                        <Button mode="contained" onPress={handleUpdateProfile} loading={saving} buttonColor={theme.colors.primary}>Save</Button>
                    </View>
                </Modal>
            </Portal>
        </View>
    );
}