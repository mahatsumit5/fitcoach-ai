import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { supabase } from "@/lib/supabase";

// How notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  false,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log("Push notifications only work on physical devices.");
    return null;
  }

  // Check / request permission
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Push notification permission denied.");
    return null;
  }

  // Android channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name:       "FitCoach",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#22c55e",
    });

    await Notifications.setNotificationChannelAsync("reminders", {
      name:       "Workout reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#22c55e",
    });
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.warn("No EAS project ID found. Add it to app.json extra.eas.projectId");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  return token;
}

export async function savePushToken(userId: string, token: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ push_token: token })
    .eq("id", userId);

  if (error) console.error("Failed to save push token:", error);
}

// ─── Scheduled local notifications ───────────────────────────────────────────

export async function scheduleWorkoutReminder(
  hour: number,
  minute: number,
  weekdays: number[] // 1=Sun, 2=Mon ... 7=Sat
): Promise<void> {
  // Cancel existing reminders first
  await cancelWorkoutReminders();

  for (const weekday of weekdays) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to train 💪",
        body:  "Your workout is waiting. Let's go!",
        sound: true,
        data:  { type: "workout_reminder" },
      },
      trigger: {
        weekday,
        hour,
        minute,
        repeats: true,
      } as Notifications.WeeklyTriggerInput,
    });
  }
}

export async function scheduleWaterReminder(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Stay hydrated 💧",
      body:  "Don't forget to drink water!",
      sound: false,
      data:  { type: "water_reminder" },
    },
    trigger: {
      seconds: 60 * 60 * 2, // every 2 hours
      repeats: true,
    },
  });
}

export async function cancelWorkoutReminders(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const reminders = scheduled.filter(
    (n) => n.content.data?.type === "workout_reminder"
  );
  for (const n of reminders) {
    await Notifications.cancelScheduledNotificationAsync(n.identifier);
  }
}

export async function sendLocalNotification(
  title: string,
  body: string
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: null, // immediate
  });
}
