import { NOTIFICATION_COLOR } from "@/constants/Colors";
import { createNotificationChannel } from "@/utils/notificationChannelUtil";
import notifee, { EventType } from "@notifee/react-native";
import {
  AndroidStyle
} from "@notifee/react-native/dist/types/NotificationAndroid";
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { useRouter } from "expo-router";
import { useEffect } from "react";

//Fetching the device's FCM token from Firebase
const getFCMToken = async () => {
  const token = await messaging().getToken();
  console.log("FCM Token:", token);
};



async function onMessageReceived(message: FirebaseMessagingTypes.RemoteMessage) {
  const channelId = await createNotificationChannel();
  // Displaying the notification using notifee
  await notifee.displayNotification({
    title: message?.data?.title as string || "",
    body: message?.data?.body as string || "",
    android: {
      channelId,
      pressAction: {
        id: "default",
      },
      colorized: true,
      color: NOTIFICATION_COLOR,
      style: {
        type: AndroidStyle.BIGTEXT,
        text: message?.data?.body as string || "",
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

const requestUserPermission = async () => {
  try {
    const permission = await notifee.requestPermission();

    if (permission.authorizationStatus === 1) {
      getFCMToken();
    }
  } catch (error) {
    console.log("Error requesting notification permission:", error);
  }
};

export default function useNotifications() {
  const router = useRouter();
  //Handling the case when the app is launched by tapping a notification from the killed/quit state
  async function initialNotificationHandler() {
    const initialNotification = await notifee.getInitialNotification();
    console.log("initialNotification", initialNotification);
    if (initialNotification) {
      router.push("/(tabs)");
    }
  }

  useEffect(() => {
    requestUserPermission();
    createNotificationChannel();
    initialNotificationHandler();

    //Handles FCM messages when the app is running in foreground
    const unsubscribe = messaging().onMessage(onMessageReceived);

    // Handles user interactions (presses) on notifications when app is foregrounded
    const foregroundSubscription = notifee.onForegroundEvent(
      ({ type, detail }) => {
        switch (type) {
          case EventType.PRESS:
            console.log("User pressed notification");
            router.push("/(tabs)");
            break;
        }
      }
    );
    // Handles user interactions on notifications when app is in background
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;
      if (type === EventType.PRESS) {
        console.log("notification pressed in background");
        router.push("/(tabs)");
        await notifee.cancelNotification(notification?.id ?? "");
      }
    });
    return () => {
      // Cleanup when component unmounts or dependency changes
      unsubscribe();
      foregroundSubscription();
    };
  }, [router]);

  return null;
}
