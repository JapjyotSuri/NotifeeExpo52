package com.japjyot.practicePocs;

import android.os.Bundle;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class NotificationClickModule extends ReactContextBaseJavaModule {

    private static Bundle initialExtras = null;

    public NotificationClickModule(ReactApplicationContext context) {
        super(context);
    }
    //storing the notification payload when the app launches from a killed state
    public static void setInitialNotificationExtras(Bundle extras) {
        initialExtras = extras;
    }

    @Override
    public String getName() {
        return "NotificationClickModule";
    }

    @ReactMethod
    public void getInitialNotification(Promise promise) {
        if (initialExtras != null) {
            promise.resolve(Arguments.fromBundle(initialExtras));
            initialExtras = null;
        } else {
            promise.resolve(null);
        }
    }
}
