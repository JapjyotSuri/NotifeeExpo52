import store from "@/redux";
import { setPendingNavigation } from '@/redux/slice/navigationSlice';
import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
} from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
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

// Keeping track of all handled notifications to avoid duplicates
const processedNotifications = new Set();
let isHandlerRegistered = false; 
// added to listener to handle background messages
if (!isHandlerRegistered) {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const messageId = remoteMessage?.messageId;
    
    // Only process if we haven't seen this messageId before
    if (messageId && !processedNotifications.has(messageId)) {
      console.log("Message handled in the background!", remoteMessage);
      
      processedNotifications.add(messageId);
      
      // Limiting the Set size to prevent memory issues (keeping last 100)
      if (processedNotifications.size > 100) {
        const firstId = processedNotifications.values().next().value;
        processedNotifications.delete(firstId);
      }
      
      const channelId = await createNotificationChannel();
      await notifee.displayNotification({
        title: remoteMessage?.data?.title || "",
        body: remoteMessage?.data?.body || "",
        android: {
          channelId,
          pressAction: {
            id: "default",
          },
          colorized: true,
          color: "#137ed9",
          style: {
            type: AndroidStyle.BIGTEXT,
            text: remoteMessage?.data?.body || "",
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
    } else {
      console.log("Duplicate notification ignored:", messageId);
    }
  });
  isHandlerRegistered = true;
}
// added to listen for background events like clicking a notification in background
notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    console.log("type", type);
    if (type === EventType.PRESS) {
      console.log("notification pressed in background", notification);
      store.dispatch(setPendingNavigation("/(tabs)"));
      // setNotificationNav("/(tabs)");
      // Removing the notification
      await notifee.cancelNotification(notification.id);
    }
  });
  


import "expo-router/entry";


