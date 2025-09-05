import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useEffect } from "react";
import { Alert, Button, Platform, View } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () =>
    ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    } as any),
});

async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permission required", "Enable notifications in settings");
      return false;
    }

    return true;
  } else {
    Alert.alert("Error", "Must use physical device for notifications");
    return false;
  }
}

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();

    // Configure Android notification channel for reliability
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  }, []);

  const showNotification = async () => {
    const allowed = await registerForPushNotificationsAsync();
    if (!allowed) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hello 👋",
        body: "This is a local notification!",
        data: { screen: "home" }, 
      },
      // Fire immediately
      trigger: null, 
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Show Notification" onPress={showNotification} />
    </View>
  );
}
