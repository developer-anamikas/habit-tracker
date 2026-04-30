import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import HabitCalendarGrid from "../components/HabitCalendarGrid";
import MonthNav from "../components/MonthNav";
import { useHabits } from "../hooks/useHabits";
import { useTheme } from "../context/ThemeContext";
import { buildCalendarMonth } from "../utils/buildCalendarMonth";

const ALL_HABITS_ID = "__all_habits__";
const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildMonthStats(habit, year, month) {
  const cells = buildCalendarMonth(year, month, habit).filter(Boolean);
  const scheduledDays = cells.filter((cell) => cell.isScheduled && !cell.isFuture);
  const completedScheduledDays = scheduledDays.filter((cell) => cell.isCompleted).length;
  const completedThisMonth = cells.filter((cell) => cell.isCompleted).length;
  const completionRate = scheduledDays.length
    ? Math.round((completedScheduledDays / scheduledDays.length) * 100)
    : 0;
  return {
    completedThisMonth,
    completedScheduledDays,
    completionRate,
    scheduledDays: scheduledDays.length,
    streak: getCurrentStreak(habit, year, month),
  };
}

function getCurrentStreak(habit, year, month) {
  const completionSet = new Set(habit.completions ?? []);
  const schedule = habit.schedule ?? [];
  const today = new Date();
  const monthEnd = new Date(Date.UTC(year, month + 1, 0));
  let cursor = monthEnd < today ? monthEnd : today;
  let streak = 0;
  for (let checkedDays = 0; checkedDays < 370; checkedDays += 1) {
    const dayName = DAY_HEADERS[cursor.getUTCDay()];
    const dateKey = formatDateKey(cursor);
    if (schedule.includes(dayName)) {
      if (!completionSet.has(dateKey)) break;
      streak += 1;
    }
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

function formatDateKey(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isFutureMonth(year, month) {
  const today = new Date();
  return year > today.getUTCFullYear() || (year === today.getUTCFullYear() && month > today.getUTCMonth());
}

export default function Calendar() {
  const { habits, isLoading, error, fetchHabits } = useHabits();
  const { isDarkMode } = useTheme();
  const now = new Date();
  const [selectedId, setSelectedId] = useState(null);
  const [year, setYear] = useState(now.getUTCFullYear());
  const [month, setMonth] = useState(now.getUTCMonth());
  const selectedHabit = habits.find((habit) => habit._id === selectedId) ?? habits[0] ?? null;
  const isAllHabitsView = selectedId === ALL_HABITS_ID;
  const selectedStats = useMemo(() => {
    return selectedHabit ? buildMonthStats(selectedHabit, year, month) : null;
  }, [month, selectedHabit, year]);

  const cardBg = isDarkMode ? '#1a1a2e' : 'white';
  const cardBorder = isDarkMode ? '#2d2d4e' : '#e5e7eb';
  const headingColor = isDarkMode ? '#e2e8f0' : '#1e293b';
  const subColor = isDarkMode ? '#64748b' : '#9ca3af';

  function handleMonthChange(nextYear, nextMonth) {
    if (isFutureMonth(nextYear, nextMonth)) return;
    setYear(nextYear);
    setMonth(nextMonth);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const activeTag = document.activeElement?.tagName;
      if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") return;
      if (event.key === "ArrowLeft") handleMonthChange(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);
      if (event.key === "ArrowRight") {
        if (!isFutureMonth(year, month)) handleMonthChange(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [month, year]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-accent-200 border-t-accent-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }} className="mx-auto max-w-[920px] rounded-2xl">
        <ErrorMessage title="Failed to load calendar data" description="Check your connection or try loading the calendar again." type="network" onRetry={fetchHabits} />
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div style={{ backgroundColor: cardBg }} className="mx-auto max-w-xl rounded-[24px] shadow-[0_14px_32px_rgba(42,42,61,0.08)]">
        <EmptyState icon="calendar" title="Nothing to show yet" description="Add a habit with a schedule to see your completion history here." actionLabel="Add a habit" actionPath="/habits" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[920px] space-y-5">
      <div>
        <p style={{ color: subColor }} className="text-[11px] font-semibold uppercase tracking-[0.18em]">Completion history</p>
        <h1 style={{ color: headingColor }} className="mt-1 text-[24px] font-bold">Habit Calendar</h1>
        <p style={{ color: subColor }} className="mt-1 text-[13px]">View completed, missed, and upcoming scheduled days for each habit.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedId(ALL_HABITS_ID)}
          style={isAllHabitsView ? {} : { backgroundColor: cardBg, color: isDarkMode ? '#94a3b8' : '#4b5563', border: `1px solid ${cardBorder}` }}
          className={`cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${isAllHabitsView ? "bg-accent-500 text-white shadow-sm" : ""}`}
        >
          All habits
        </button>
        {habits.map((habit) => (
          <button
            key={habit._id}
            type="button"
            onClick={() => setSelectedId(habit._id)}
            style={(!isAllHabitsView && selectedHabit?._id === habit._id) ? {} : { backgroundColor: cardBg, color: isDarkMode ? '#94a3b8' : '#4b5563', border: `1px solid ${cardBorder}` }}
            className={`cursor-pointer rounded-xl px-3 py-2 text-[13px] font-medium transition-colors ${!isAllHabitsView && selectedHabit?._id === habit._id ? "bg-accent-500 text-white shadow-sm" : ""}`}
          >
            {habit.name}
          </button>
        ))}
      </div>

      <section style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }} className="rounded-[24px] p-4 shadow-[0_14px_32px_rgba(42,42,61,0.08)] sm:p-6">
        <div style={{ backgroundColor: cardBg, borderBottom: `1px solid ${cardBorder}` }} className="sticky top-14 z-10 -mx-4 mb-4 px-4 pb-4 pt-1 sm:-mx-6 sm:px-6">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-h-[72px] min-w-0">
              <h2 style={{ color: headingColor }} className="truncate text-[18px] font-semibold">
                {isAllHabitsView ? "All habits" : selectedHabit?.name}
              </h2>
              {!isAllHabitsView && selectedHabit ? (
                <HabitSubtitle habit={selectedHabit} stats={selectedStats} isDarkMode={isDarkMode} />
              ) : (
                <p style={{ color: subColor }} className="mt-1 text-[12px]">{habits.length} habits tracked this month</p>
              )}
            </div>
            <div className="shrink-0">
              <MonthNav year={year} month={month} onChange={handleMonthChange} />
            </div>
          </div>
          {!isAllHabitsView && selectedStats ? <StatsBar stats={selectedStats} cardBg={cardBg} cardBorder={cardBorder} isDarkMode={isDarkMode} /> : null}
        </div>

        {isAllHabitsView ? (
          <AllHabitsOverview habits={habits} year={year} month={month} isDarkMode={isDarkMode} />
        ) : selectedHabit ? (
          <HabitCalendarGrid habit={selectedHabit} year={year} month={month} />
        ) : null}
      </section>
    </div>
  );
}

function HabitSubtitle({ habit, stats, isDarkMode }) {
  const schedule = habit.schedule ?? [];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex flex-wrap gap-1.5">
        {schedule.length ? (
          schedule.map((day) => (
            <span key={day} style={{ backgroundColor: isDarkMode ? '#2d2d4e' : '#f1f5f9', color: isDarkMode ? '#94a3b8' : '#475569' }} className="rounded-full px-2 py-0.5 text-[11px] font-medium">{day}</span>
          ))
        ) : (
          <span className="rounded-full bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-surface-500">No schedule</span>
        )}
      </div>
      <p style={{ color: isDarkMode ? '#64748b' : '#6b7280' }} className="text-[12px]">
        {habit.completions?.length ?? 0} total completions | {stats?.completionRate ?? 0}% this month
      </p>
    </div>
  );
}

function StatsBar({ stats, cardBg, cardBorder, isDarkMode }) {
  return (
    <div style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }} className="grid grid-cols-3 overflow-hidden rounded-xl shadow-sm">
      <StatItem label="Completed this month" value={stats.completedThisMonth} valueClassName="text-surface-900" isDarkMode={isDarkMode} cardBorder={cardBorder} />
      <StatItem label="Completion rate" value={`${stats.completionRate}%`} detail={`${stats.completedScheduledDays}/${stats.scheduledDays}`} valueClassName="text-accent-600" isDarkMode={isDarkMode} cardBorder={cardBorder} />
      <StatItem label="Current streak" value={`${stats.streak}d`} valueClassName="text-success-600" isDarkMode={isDarkMode} cardBorder={cardBorder} />
    </div>
  );
}

function StatItem({ label, value, detail, valueClassName, isDarkMode, cardBorder }) {
  return (
    <div style={{ borderRight: `1px solid ${cardBorder}` }} className="px-3 py-3 last:border-r-0">
      <p className={`text-2xl font-bold leading-none ${valueClassName}`}>
        {value}
        {detail ? <span style={{ color: isDarkMode ? '#475569' : '#9ca3af' }} className="ml-1 text-[12px] font-semibold">| {detail}</span> : null}
      </p>
      <p style={{ color: isDarkMode ? '#475569' : '#9ca3af' }} className="mt-1 truncate text-xs">{label}</p>
    </div>
  );
}

function AllHabitsOverview({ habits, year, month, isDarkMode }) {
  const rows = habits.map((habit) => ({ habit, cells: buildCalendarMonth(year, month, habit).filter(Boolean) }));
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[680px] space-y-2">
        <div style={{ color: isDarkMode ? '#475569' : '#9ca3af' }} className="grid grid-cols-[150px_1fr] items-center text-[13px] font-semibold">
          <span className="pr-3">Habit</span>
          <div style={{ borderLeft: `1px solid ${isDarkMode ? '#2d2d4e' : '#e2e8f0'}` }} className="grid grid-flow-col auto-cols-fr gap-1 pl-3">
            {rows[0]?.cells.map((cell) => (<span key={cell.dateStr} className="text-center">{cell.day}</span>))}
          </div>
        </div>
        {rows.map(({ habit, cells }) => (
          <div key={habit._id} className="grid grid-cols-[150px_1fr] items-center">
            <span style={{ color: isDarkMode ? '#94a3b8' : '#374151' }} className="truncate pr-3 text-[12px] font-medium">{habit.name}</span>
            <div style={{ borderLeft: `1px solid ${isDarkMode ? '#2d2d4e' : '#e2e8f0'}` }} className="grid grid-flow-col auto-cols-fr gap-1 pl-3">
              {cells.map((cell) => (<span key={cell.dateStr} title={`${habit.name}: ${cell.dateStr}`} className={`mx-auto h-3 w-3 rounded-full ${getOverviewDotClass(cell)}`} />))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getOverviewDotClass(cell) {
  if (cell.isBeforeHabitStart) return "bg-transparent";
  if (cell.isCompleted) return "bg-accent-500";
  if (cell.isScheduled && !cell.isFuture) return "bg-danger-400";
  if (cell.isScheduled) return "bg-surface-300";
  return "bg-transparent";
}