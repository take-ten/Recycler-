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
    "plugins": ["@react-native-google-signin/google-signin", "expo-image-picker"],
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.greed.firebase",
      "googleServicesFile": "GoogleService-Info.plist",
      "config": {
        "googleMapsApiKey": "AIzaSyBF1NdA9nRIW-9UxWSQFwNHaD7vlEcqfJs"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.greed.firebase",
      "googleServicesFile": "./google-services.json",
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "RECORD_AUDIO",
        "READ_MEDIA_AUDIO",
        "READ_MEDIA_DOCUMENTS",
        "READ_MEDIA_FILES",
        "READ_MEDIA_IMAGES",
        "READ_MEDIA_VIDEO"
      ]
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
