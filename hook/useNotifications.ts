import { NOTIFICATION_COLOR } from "@/constants/Colors";
import { createNotificationChannel } from "@/utils/notificationChannelUtil";
import notifee, { AndroidStyle, EventType } from "@notifee/react-native";
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { useRouter } from "expo-router";
import { useEffect } from "react";

//Fetching the device's FCM token from Firebase
const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log("FCM Token:", token);
  } catch (error) {
    console.error('Error fetching FCM token:', error);
  }
};
// Subscribing the device to a Firebase Cloud Messaging topic to receive targeted notifications
const subscribeToTopic = async () => {
  const topic = process.env.EXPO_PUBLIC_NOTIFICATION_TOPIC;
  console.log("topic", topic);
  try {
    await messaging().subscribeToTopic(topic ?? "");
  } catch (error) {
    console.error('Subscription error:', error);
  }
};

async function onMessageReceived(message: FirebaseMessagingTypes.RemoteMessage) {
  try {
  const channelId = await createNotificationChannel();
  const response = await fetch("https://notifee-mockserver-7yjverznv-japjyotsuris-projects.vercel.app/user");
    const data = await response.json();
    console.log("data", data);
  //Displaying the notification using notifee with fix for showing style in dark mode
  await notifee.displayNotification({
    title: message?.data?.title as string || "",
    android: {
      channelId, 
      pressAction: {
        id: "default",
      },
      color: NOTIFICATION_COLOR,
      colorized: true,
      timestamp: Date.now(), 
      showTimestamp: true,   
      style: {
        type: AndroidStyle.MESSAGING,
        person: {
          name: `${message?.data?.title} ${data?.name || "Jap"}` || "",
        },
        messages: [
          {
            text: message?.data?.body as string || "",
            timestamp: Date.now(), 
          },
          
        ],
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
} catch (error) {
  console.error('Notification display error:', error);
}
}



const requestUserPermission = async () => {
  try {
    const permission = await notifee.requestPermission();

    if (permission.authorizationStatus === 1) {
      getFCMToken();
      subscribeToTopic();
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
