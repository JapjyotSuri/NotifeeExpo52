import 'dotenv/config';

export default {
  expo: {
    name: 'notifeePoc',
    slug: 'notifee',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'practicepocs',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.japjyot.practicePocs',
      googleServicesFile: './GoogleService-Info.plist',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
      softwareKeyboardLayoutMode: 'pan',
      predictiveBackGestureEnabled: false,
      package: 'com.japjyot.practicePocs',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      "./plugins/withNotifeeMavenRepo",
      "@react-native-firebase/app",
      "@react-native-firebase/messaging",
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "2beef970-341d-4e22-8179-dbd7338d92e8"
      }
    }
  },
};