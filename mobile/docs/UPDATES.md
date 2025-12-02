# Expo Updates Documentation

## Overview
This document explains how Expo Updates is configured and used in the PassTravels mobile application.

## Configuration

### 1. Installation
Expo Updates has been installed as a dependency:
```bash
npm install expo-updates
```

### 2. Plugin Configuration
The plugin has been added to `app.json`:
```json
{
  "expo": {
    "plugins": [
      "expo-updates"
    ],
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    }
  }
}
```

### 3. Native Configuration
After adding the plugin, the native projects were configured using:
```bash
npx expo prebuild --clean
```

## Usage

### Checking for Updates
The app automatically checks for updates when it loads. Users can also manually check for updates in their profile settings.

### Update Utility Functions
Utility functions for updates are available in `utils/updates.ts`:
- `checkForUpdates()` - Check for and prompt to install updates
- `fetchAndApplyUpdates()` - Fetch updates in the background
- `reloadApp()` - Reload the app to apply pending updates
- `getUpdateInfo()` - Get information about the current update

## Publishing Updates

To publish updates, you would typically use Expo's build and publish workflow:

1. Make changes to your code
2. Build the app with EAS Build (for production deployment)
3. Publish updates using `eas update` (for over-the-air updates)

## Best Practices

1. Always test updates in development before publishing
2. Use semantic versioning for your app releases
3. Monitor update metrics in Expo's dashboard
4. Handle update failures gracefully in your app

## Troubleshooting

If updates aren't working:
1. Verify the `expo-updates` package is installed
2. Check that the plugin is correctly configured in `app.json`
3. Ensure the app has network access
4. Check the Expo developer console for error messages

## References
- [Expo Updates Documentation](https://docs.expo.dev/versions/latest/sdk/updates/)
- [EAS Update Guide](https://docs.expo.dev/eas-update/introduction/)