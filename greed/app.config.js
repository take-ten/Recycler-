export default{
  "expo": {
    "name": "greed",
    "slug": "greed",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    plugins: ["@react-native-google-signin/google-signin"],
    assetBundlePatterns: ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.greed.firebase",
      "googleServicesFile": "GoogleService-Info.plist"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.greed.firebase",
      "googleServicesFile": "google-services.json"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router"
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "0ffe735f-42c8-4a40-bbf8-219ceb6537bc"
      }
    }
  }
}
