import useNotifications from "@/hook/useNotifications";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import notifee from "@notifee/react-native";
import {
  AndroidImportance,
  AndroidStyle,
} from "@notifee/react-native/dist/types/NotificationAndroid";
import messaging from "@react-native-firebase/messaging";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";

const createNotificationChannel = async () => {
  if (Platform.OS === "android") {
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      importance: AndroidImportance.HIGH,
      vibration: true,
      sound: "default",
    });
    return channelId;
  }
  return "ios";
};

messaging().setBackgroundMessageHandler(async (message: any) => {
  console.log("message in background", message);
  const channelId = await createNotificationChannel();
  console.log("title in message", message?.notification?.title);
    
  await notifee.displayNotification({
    title: message?.data?.title || "",
    body: message?.data?.body || "",
    android: {
      channelId,
      pressAction: {
        id: "default",
      },
      colorized: true,
      color: "#137ed9",
      // Optional: Add icon, color, etc.
      style: {
        type: AndroidStyle.BIGTEXT,
        text: message?.data?.body || "",
      },
    },
    ios: {
      sound: "default",
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
  });
});

import { useColorScheme } from "@/components/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  useNotifications();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}
