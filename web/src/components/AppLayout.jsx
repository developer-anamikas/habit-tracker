import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { apiRequest } from "../utils/api";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import ReminderAlert from "./ReminderAlert";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCompletionDateKey(date) {
  return date.toISOString().split("T")[0];
}

export default function AppLayout() {
  const { token } = useAuth();
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [reminders, setReminders] = useState([]);
  const [alertQueue, setAlertQueue] = useState([]);
  const alertedRef = useRef(new Set());

  useEffect(() => {
    async function fetchReminders() {
      if (!token) {
        setReminders([]);
        return;
      }
      try {
        const data = await apiRequest("/api/habits/reminders?scope=all", { token });
        setReminders(data);
      } catch (err) {
        console.error("Failed to fetch reminders", err);
        setReminders([]);
      }
    }
    fetchReminders();
    const pollInterval = setInterval(fetchReminders, 15000);
    return () => clearInterval(pollInterval);
  }, [token, location.pathname]);

  useEffect(() => {
    if (reminders.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, "0");
      const currentMinutes = now.getMinutes().toString().padStart(2, "0");
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayName = DAY_NAMES[now.getDay()];
      const todayKey = getLocalDateKey(now);
      const completionKey = getCompletionDateKey(now);
      const dueReminders = [];

      reminders.forEach((habit) => {
        const isScheduledToday = habit.schedule?.includes(todayName);
        const completedToday = habit.completions?.includes(completionKey);
        if (!completedToday && isScheduledToday && habit.reminderTime === currentTimeStr) {
          const alertKey = `${habit._id}-${todayKey}-${currentTimeStr}`;
          if (!alertedRef.current.has(alertKey)) {
            dueReminders.push(habit);
            alertedRef.current.add(alertKey);
          }
        }
      });

      if (dueReminders.length > 0) {
        setAlertQueue((prev) => {
          const queuedIds = new Set(prev.map((habit) => habit._id));
          const nextReminders = dueReminders.filter((habit) => !queuedIds.has(habit._id));
          return [...prev, ...nextReminders];
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <div
      style={{ backgroundColor: isDarkMode ? '#0f0f1a' : '#f7f7fb' }}
      className="min-h-screen transition-colors duration-200"
    >
      {alertQueue.length > 0 && (
        <ReminderAlert
          reminders={alertQueue}
          onClose={(habitId) =>
            setAlertQueue((prev) => prev.filter((habit) => habit._id !== habitId))
          }
          onCloseAll={() => setAlertQueue([])}
        />
      )}
      <Sidebar />
      <TopNav />
      <main className="ml-[220px] pt-14">
        <div className="max-w-[1140px] mx-auto px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}