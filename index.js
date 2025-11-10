import { NOTIFICATION_COLOR } from "@/constants/Colors";
import { createNotificationChannel } from "@/utils/notificationChannelUtil";
import notifee, { AndroidStyle } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

// runs when we receive a notification when the app is in background or killed state
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
  const channelId = await createNotificationChannel();
  // Displaying the notification using notifee with fix for showing style in dark mode
  await notifee.displayNotification({
    title: remoteMessage?.data?.title,
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
          name: remoteMessage?.data?.title || "",
        },
        messages: [
          {
            text: remoteMessage?.data?.body || "",
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
});

//Ensuring app navigation is properly initialized
import "expo-router/entry";
