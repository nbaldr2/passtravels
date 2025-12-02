// Updates configuration for Expo Updates
export default {
  expo: {
    name: "PassTravels",
    slug: "passtravels",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#0f0f1e"
    },
    updates: {
      enabled: true,
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.passtravels.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0f0f1e"
      },
      package: "com.passtravels.app"
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  }
};