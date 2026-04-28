import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

export default function AppLayout() {
  const { token } = useAuth();
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
    
    // Poll every 15 seconds to ensure we catch newly created reminders
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

      reminders.forEach((habit) => {
        const isScheduledToday = habit.schedule?.includes(todayName);

        if (isScheduledToday && habit.reminderTime === currentTimeStr) {
          const alertKey = `${habit._id}-${todayKey}-${currentTimeStr}`;
          if (!alertedRef.current.has(alertKey)) {
            setAlertQueue((prev) => [...prev, habit]);
            alertedRef.current.add(alertKey);
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [reminders]);

  const activeAlert = alertQueue[0] || null;

  return (
    <div className="min-h-screen bg-surface-50">
      {activeAlert && (
        <ReminderAlert 
          habitName={activeAlert.name} 
          onClose={() => setAlertQueue((prev) => prev.slice(1))} 
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
