import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore }  from "@/stores/authStore";
import {
  registerForPushNotifications,
  savePushToken,
} from "@/lib/notifications";

export function useNotifications() {
  const { user } = useAuthStore();
  const navigation = useNavigation<any>();
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener     = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    if (!user) return;

    // Register and save token
    registerForPushNotifications().then((token) => {
      if (token) savePushToken(user.id, token);
    });

    // Foreground notification listener
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    // Tap handler — deep link into app
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const type = response.notification.request.content.data?.type;

        switch (type) {
          case "workout_reminder":
            navigation.navigate("Main", { screen: "Workouts" });
            break;
          case "water_reminder":
            navigation.navigate("Main", { screen: "Nutrition" });
            break;
          default:
            break;
        }
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [user?.id]);
}
