package com.japjyot.practicePocs;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class NotificationClickReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle extras = intent.getExtras();
        if (extras == null) extras = new Bundle();

        Log.d("ClickReceiver", "Click received: " + extras);

        // Save so RN can read it at cold start
        NotificationClickModule.setInitialNotificationExtras(extras);

        // Gets the React Native manager that controls the JS engine
        ReactInstanceManager manager = 
            ((ReactApplication) context.getApplicationContext())
                    .getReactNativeHost().getReactInstanceManager();

        ReactContext reactContext = manager.getCurrentReactContext();

        // if (reactContext != null) {
        //     reactContext
        //         .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        //         .emit("notificationClicked", Arguments.fromBundle(extras));
        //     return;
        // }
        // //added this
        // // Intent launchIntent = new Intent(context, MainActivity.class);
        // // launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        // // launchIntent.putExtras(extras);
        // // context.startActivity(launchIntent);

        //  if (reactContext == null) {
        // // Otherwise start headless task
        // Intent serviceIntent = new Intent(context, NotificationEventService.class);
        // serviceIntent.putExtras(extras);
        // context.startService(serviceIntent);
        // }

if (reactContext != null) {
    // JS is alive → emit event so `useNotifications` handles routing from react native
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("notificationClicked", Arguments.fromBundle(extras));

    // Bring the existing activity/task forward instead of starting a new one
    Intent launchIntent = new Intent(context, MainActivity.class);
    launchIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
    launchIntent.putExtras(extras);
    context.startActivity(launchIntent);
} else {
    // Cold start the app from kill state
    Intent launchIntent = new Intent(context, MainActivity.class);
    launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
    launchIntent.putExtras(extras);
    context.startActivity(launchIntent);
    //Runs a service to handle the notification click
    Intent serviceIntent = new Intent(context, NotificationEventService.class);
    serviceIntent.putExtras(extras);
    context.startService(serviceIntent);
}
    }
}
