import notifee, { EventType } from "@notifee/react-native";
import { AndroidImportance, AndroidStyle } from "@notifee/react-native/dist/types/NotificationAndroid";
import messaging from "@react-native-firebase/messaging";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

async function onMessageReceived(message: any) {
  const channelId = await createNotificationChannel();
  console.log("message", message);
  // Displaying the notification using notifee
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
  // Getting the initial notification if the app is opened from a notification in kill state
  async function initialNotificationHandler() {
    const initialNotification = await notifee.getInitialNotification();
    console.log("initialNotification", initialNotification);
    if (initialNotification) {
      router.push(('/(tabs)' as any));
    }
  }


  useEffect(() => {
    // Request user permission for notifications
    requestUserPermission();
    createNotificationChannel();
    initialNotificationHandler()
    const unsubscribe = messaging().onMessage(onMessageReceived);
    // const subscription = AppState.addEventListener('change', (nextAppState) => {
    //   if (nextAppState === 'active') {
    //     // App came to foreground, check for pending navigation
    //     const pendingNav = getNotificationNav();
    //     console.log("App came to foreground, checking nav:", pendingNav);
    //     if (pendingNav) {
    //       router.push(pendingNav);
    //       setNotificationNav(null); // Clear after using
    //     }
    //   }
    // });
    // Handling foreground notifications (when app is open)
    const foregroundSubscription = notifee.onForegroundEvent(({ type, detail }) => {
      console.log("type", type);
      switch (type) {
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          router.push('/(tabs)');
          break;
      }
    });
    // Handle foreground notifications (when app is open)
    return () => {
      // Cleanup when component unmounts or dependency changes
      unsubscribe();
      // subscription.remove();
      foregroundSubscription()
    };
  }, [router]);

  return null;
}
