package com.japjyot.practicePocs;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.text.Html;
import android.text.Spanned;
import android.widget.RemoteViews;

import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.app.PendingIntent;

public class CustomNotificationModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private static final String CHANNEL_ID = "default";

    public CustomNotificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "CustomNotification";
    }

    @ReactMethod
    public void showCustomNotification(String titleHtml, String bodyHtml, String route) {
        Context context = getReactApplicationContext();
        
        // Step 1: Create notification channel with HIGH importance for heads-up (Android 8.0+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            String channelName = "Default Channel";
            String channelDescription = "Used for important notifications";
            int importance = NotificationManager.IMPORTANCE_HIGH; // Important for heads-up notification
            
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, channelName, importance);
            channel.setDescription(channelDescription);
            channel.setShowBadge(true);
            channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
            
            NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
             notificationManager.createNotificationChannel(channel);

        }
        
        // 🔹 Create Intent to launch the main activity

    // Intent intent = new Intent(context, NotificationClickReceiver.class);
    Intent intent = new Intent(context, MainActivity.class);
    // String deepLinkUrl = "practicepocs://" + (route != null && !route.isEmpty() ? route : "/(tabs)");
    // intent.setData(android.net.Uri.parse(deepLinkUrl));
    // intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
    intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
    
    intent.setAction("CUSTOM_NOTIFICATION_CLICK");
    intent.setData(null);



    intent.putExtra("notification_title", titleHtml);
    intent.putExtra("notification_body", bodyHtml);
    intent.putExtra("notification_route", route != null ? route : "");
    // PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);

    PendingIntent pendingIntent = PendingIntent.getActivity(
        context,
        0,
        intent,
        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
);
   
//     PendingIntent pendingIntent = PendingIntent.getBroadcast(
//         context,
//         (int) System.currentTimeMillis(), // unique
//         intent,
//         PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
// );
RemoteViews customView = new RemoteViews(context.getPackageName(), R.layout.custom_notification);
        // customView.setOnClickPendingIntent(R.id.notification_root, pendingIntent);

        int nightModeFlags = context.getResources().getConfiguration().uiMode & android.content.res.Configuration.UI_MODE_NIGHT_MASK;
        int baseTextColor = (nightModeFlags == android.content.res.Configuration.UI_MODE_NIGHT_YES)
            ? android.graphics.Color.WHITE
            : android.graphics.Color.BLACK;

        Spanned titleSpanned = Html.fromHtml(titleHtml, Html.FROM_HTML_MODE_LEGACY);
        Spanned bodySpanned = Html.fromHtml(bodyHtml, Html.FROM_HTML_MODE_LEGACY);

        customView.setTextViewText(R.id.notification_title, titleHtml);
        customView.setTextViewText(R.id.notification_body, bodyHtml);
        customView.setTextColor(R.id.notification_title, baseTextColor);
        customView.setTextColor(R.id.notification_body, baseTextColor);
        //Storing data before notification is shown
 NotificationClickModule.setInitialNotificationExtras(intent.getExtras());
//     PendingIntent activityIntent = PendingIntent.getActivity(
//     reactContext,
//     0,
//     intent,
//     PendingIntent.FsLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
// );


        // Step 2: Build notification with proper configuration for heads-up
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(titleSpanned)
                .setContentText(bodySpanned)
                .setStyle(new NotificationCompat.DecoratedCustomViewStyle())//allowing us to show custom styling along with device default styling
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .setDefaults(NotificationCompat.DEFAULT_SOUND | NotificationCompat.DEFAULT_VIBRATE) // Important for heads-up
                .setPriority(NotificationCompat.PRIORITY_MAX) // Important for heads-up (Android < 8.0)
                .setFullScreenIntent(pendingIntent, true); // Additional heads-up trigger for Samsung
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            RemoteViews customExpanded = new RemoteViews(context.getPackageName(), R.layout.custom_notification);
            customExpanded.setOnClickPendingIntent(R.id.notification_root, pendingIntent);
            Spanned title = Html.fromHtml(titleHtml, Html.FROM_HTML_MODE_LEGACY);
            Spanned body = Html.fromHtml(bodyHtml, Html.FROM_HTML_MODE_LEGACY);

            customExpanded.setTextViewText(R.id.notification_title, title);
            customExpanded.setTextViewText(R.id.notification_body, body);

            // builder.setCustomBigContentView(customExpanded); // Only expanded version uses custom UI
            builder.setCustomContentView(customExpanded); // Only expanded version uses custom UI
        }

        // Step 3: Send notification
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify((int) System.currentTimeMillis(), builder.build());//Added to show the notification on the screen
    }
}
