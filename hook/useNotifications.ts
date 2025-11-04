import notifee, { EventType } from "@notifee/react-native";
import { AndroidImportance, AndroidStyle } from "@notifee/react-native/dist/types/NotificationAndroid";
import messaging from "@react-native-firebase/messaging";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

async function onMessageReceived(message: any) {
  const channelId = await createNotificationChannel();
  console.log("message", message);
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
      color: '#137ed9',
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
}


const getFCMToken = async () => {
  const token = await messaging().getToken();
  console.log("FCM Token:", token);
};
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  if (type === EventType.PRESS) {
    console.log("Notification pressed in background:", notification);
    // navigate if needed
  }
});
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

const requestUserPermission = async () => {
  try {
    const permission = await notifee.requestPermission();
    console.log("permission", permission);

    if (permission.authorizationStatus === 1) {
      console.log("Permission granted Successfully");
      getFCMToken();
      // const batteryOptimizationEnabled =
      //   await notifee.isBatteryOptimizationEnabled();
      // console.log("batteryOptimizationEnabled", batteryOptimizationEnabled);
      // if (batteryOptimizationEnabled) {
      //   // 2. ask your users to disable the feature
      //   Alert.alert(
      //     "Restrictions Detected",
      //     "To ensure notifications are delivered, please disable battery optimization for the app.",
      //     [
      //       // 3. launch intent to navigate the user to the appropriate screen
      //       {
      //         text: "OK, open settings",
      //         onPress: async () =>
      //           await notifee.openBatteryOptimizationSettings(),
      //       },
      //       {
      //         text: "Cancel",
      //         onPress: () => console.log("Cancel Pressed"),
      //         style: "cancel",
      //       },
      //     ],
      //     { cancelable: false }
      //   );
      // }
      // // 1. get info on the device and the Power Manager settings
      // const powerManagerInfo = await notifee.getPowerManagerInfo();
      // if (powerManagerInfo.activity) {
      //   // 2. ask your users to adjust their settings
      //   Alert.alert(
      //     "Restrictions Detected",
      //     "To ensure notifications are delivered, please adjust your settings to prevent the app from being killed",
      //     [
      //       // 3. launch intent to navigate the user to the appropriate screen
      //       {
      //         text: "OK, open settings",
      //         onPress: async () => await notifee.openPowerManagerSettings(),
      //       },
      //       {
      //         text: "Cancel",
      //         onPress: () => console.log("Cancel Pressed"),
      //         style: "cancel",
      //       },
      //     ],
      //     { cancelable: false }
      //   );
      // }
    }
  } catch (error) {
    console.log("Error requesting notification permission:", error);
  }
};

export default function useNotifications() {
  const router = useRouter();

  useEffect(() => {
    // Request user permission for notifications
    requestUserPermission();
    createNotificationChannel();
    const unsubscribe = messaging().onMessage(onMessageReceived);
    // Handle foreground notifications (when app is open)
    return () => {
      // Cleanup when component unmounts or dependency changes
      unsubscribe();
    };
  }, [router]);

  return null;
}
