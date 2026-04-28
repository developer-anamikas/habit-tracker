import cron from "node-cron";
import webpush from "web-push";
import Habit from "../models/Habit.js";
import PushSubscription from "../models/PushSubscription.js";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getReminderWindow(timeZone = "UTC") {
  let formatter;

  try {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  } catch {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  }

  const parts = formatter.formatToParts(new Date());
  const getPart = (type) => parts.find((part) => part.type === type)?.value;

  return {
    dayName: getPart("weekday") || DAY_NAMES[new Date().getUTCDay()],
    time: `${getPart("hour")}:${getPart("minute")}`,
  };
}

function configureWebPush() {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) {
    console.warn("Push notifications are disabled: VAPID env vars are missing");
    return false;
  }

  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );

  return true;
}

async function removeExpiredSubscription(subscriptionId) {
  await PushSubscription.deleteOne({ _id: subscriptionId });
}

async function sendReminder(subscription, habit) {
  const payload = JSON.stringify({
    title: "Time for your habit!",
    body: habit.name,
    url: "/habits",
    habitId: habit._id,
  });

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      payload
    );
  } catch (err) {
    if (err.statusCode === 404 || err.statusCode === 410) {
      await removeExpiredSubscription(subscription._id);
      return;
    }

    console.error("Failed to send reminder push:", err.message);
  }
}

async function sendDueReminders() {
  const habits = await Habit.find({
    hasReminder: true,
    reminderTime: { $ne: "" },
  }).select("_id userId name reminderTime reminderTimezone schedule");

  if (habits.length === 0) {
    return;
  }

  const dueHabits = habits.filter((habit) => {
    const { dayName, time } = getReminderWindow(habit.reminderTimezone);

    return habit.reminderTime === time && habit.schedule.includes(dayName);
  });

  for (const habit of dueHabits) {
    const subscriptions = await PushSubscription.find({ userId: habit.userId });

    await Promise.all(
      subscriptions.map((subscription) => sendReminder(subscription, habit))
    );
  }
}

export function startReminderScheduler() {
  if (!configureWebPush()) {
    return;
  }

  cron.schedule("* * * * *", () => {
    sendDueReminders().catch((err) => {
      console.error("Reminder scheduler failed:", err.message);
    });
  });
}
