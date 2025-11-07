import notifee, { AndroidImportance } from "@notifee/react-native";
import { Platform } from "react-native";

/*
 * Creating a notification channel on Android
 * Channels group notifications and allows user-level control like sound, vibration, etc.
 */
export const createNotificationChannel = async () => {
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