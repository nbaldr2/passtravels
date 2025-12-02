import * as Updates from 'expo-updates';
import { Alert } from 'react-native';

/**
 * Check for updates and reload the app if an update is available
 */
export const checkForUpdates = async (): Promise<void> => {
  try {
    const update = await Updates.checkForUpdateAsync();
    
    if (update.isAvailable) {
      Alert.alert(
        'Update Available',
        'A new version of PassTravels is available. Would you like to update now?',
        [
          {
            text: 'Cancel',
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
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
};

/**
 * Fetch and apply updates in the background
 */
export const fetchAndApplyUpdates = async (): Promise<void> => {
  try {
    const update = await Updates.checkForUpdateAsync();
    
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      // The update will be applied when the app is restarted
    }
  } catch (error) {
    console.error('Error fetching updates:', error);
  }
};

/**
 * Reload the app to apply pending updates
 */
export const reloadApp = async (): Promise<void> => {
  try {
    await Updates.reloadAsync();
  } catch (error) {
    console.error('Error reloading app:', error);
  }
};

/**
 * Get update information
 */
export const getUpdateInfo = async (): Promise<Updates.UpdatesLogEntry | null> => {
  try {
    const updateInfo = await Updates.readLogEntriesAsync();
    return updateInfo.length > 0 ? updateInfo[0] : null;
  } catch (error) {
    console.error('Error getting update info:', error);
    return null;
  }
};