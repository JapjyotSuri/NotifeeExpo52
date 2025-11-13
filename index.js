import { NOTIFICATION_COLOR } from "@/constants/Colors";
import { createNotificationChannel } from "@/utils/notificationChannelUtil";
import notifee, { AndroidStyle } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";

// runs when we receive a notification when the app is in background or killed state
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
  const channelId = await createNotificationChannel();
  //Added a mock server to fetch data of user
  const response = await fetch("https://notifee-mockserver-7yjverznv-japjyotsuris-projects.vercel.app/user");
  const data = await response.json();
  console.log("data in index", data);
  // Displaying the notification using notifee
  await notifee.displayNotification({
    title: `${remoteMessage?.data?.title} ${data?.name || "Jap"}` || "",
    body: remoteMessage?.data?.body || "",
    android: {
      channelId,
      pressAction: {
        id: "default",
      },
      colorized: true,
      color: NOTIFICATION_COLOR,
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
});
//Ensuring app navigation is properly initialized
import "expo-router/entry";
