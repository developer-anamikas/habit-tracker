import ProgressBar from "./ProgressBar";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const JS_DAYS = [1, 2, 3, 4, 5, 6, 0];

const CIRCLE = {
  completed: "bg-green-500 border-green-500 text-white",
  todayPending:
    "border-red-300 bg-gradient-to-br from-rose-300 via-red-400 to-red-500 text-white shadow-sm shadow-red-200/70",
  missed: "bg-red-900/30 border-red-700 text-red-400",
  scheduled: "bg-transparent border-purple-500 text-purple-400",
  off: "bg-transparent border-surface-600 text-surface-600",
};

function formatUtcDateKey(date) {
  return date.toISOString().split("T")[0];
}

function parseUtcDateKey(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function getWeekRange(today = new Date()) {
  const end = new Date(today);
  end.setUTCHours(23, 59, 59, 999);

  const monday = new Date(end);
  monday.setUTCHours(0, 0, 0, 0);
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));

  return { monday, end };
}

function getWeekCompletions(completions = [], today = new Date()) {
  const { monday, end } = getWeekRange(today);

  return completions.filter((dateStr) => {
    const date = parseUtcDateKey(dateStr);
    return date >= monday && date <= end;
  });
}

function getDayState(index, schedule, completedDays, todayIndex) {
  const scheduled = schedule.includes(DAY_NAMES[index]);
  if (completedDays.has(JS_DAYS[index])) return "completed";
  if (!scheduled) return "off";
  if (index === todayIndex) return "todayPending";
  if (index < todayIndex) return "missed";
  return "scheduled";
}

function calculateStreak(completions = [], today = new Date()) {
  const done = new Set(completions);
  const date = new Date(today);
  let streak = 0;

  while (done.has(formatUtcDateKey(date))) {
    streak += 1;
    date.setUTCDate(date.getUTCDate() - 1);
  }

  return streak;
}

function formatReminderTime(time) {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

export default function HabitCard({ habit, onToggleToday, onEdit, onDelete }) {
  const today = new Date();
  const schedule = habit.schedule || [];
  const completions = habit.completions || [];
  const todayName = DAY_NAMES[(today.getUTCDay() + 6) % 7];
  const todayIndex = (today.getUTCDay() + 6) % 7;
  const todayKey = formatUtcDateKey(today);
  const doneToday = completions.includes(todayKey);
  const todayScheduled = schedule.includes(todayName);
  const weekCompletions = getWeekCompletions(completions, today);
  const completedDays = new Set(
    weekCompletions.map((dateStr) => parseUtcDateKey(dateStr).getUTCDay())
  );
  const progress = schedule.length
    ? Math.min(1, Math.round((weekCompletions.length / schedule.length) * 100) / 100)
    : 0;
  const streak = calculateStreak(completions, today);

  return (
    <div className="group rounded-2xl border border-surface-700 bg-surface-800 p-5 transition-shadow duration-200 hover:shadow-md hover:shadow-black/30">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={`truncate text-[14px] font-semibold ${doneToday ? "line-through text-surface-500" : "text-surface-100"}`}>
            {habit.name}
          </h3>
          <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            {habit.goal && <p className="truncate text-[12px] text-surface-400">{habit.goal}</p>}
            {habit.hasReminder && habit.reminderTime && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-900/50 px-2 py-0.5 text-[11px] font-medium text-accent-400">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {formatReminderTime(habit.reminderTime)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {streak > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-900/40 px-2 py-0.5 text-[11px] font-medium text-amber-400">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 0 0-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 0 0-.613 3.58 2.64 2.64 0 0 1-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 0 0 5.05 6.05 6.981 6.981 0 0 0 3 11a7 7 0 0 0 11.95 4.95c.592-.591.98-1.29 1.216-2.025.228-.708.301-1.506.165-2.376-.15-.963-.534-1.996-1.17-3.09-.635-1.09-1.52-2.265-2.602-3.4l-1.164-1.506Z"
                  clipRule="evenodd"
                />
              </svg>
              {streak}
            </span>
          )}

          <div className="flex items-center gap-0.5">
            {todayScheduled && (
              <button
                type="button"
                onClick={() => onToggleToday(habit._id)}
                title={doneToday ? "Unmark today" : "Mark today as done"}
                aria-label={doneToday ? "Unmark today" : "Mark today as done"}
                className={`cursor-pointer rounded-lg p-1.5 transition-colors ${doneToday ? "text-white" : "text-surface-500 hover:text-green-400"}`}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${doneToday ? "border-green-500 bg-green-500 text-white" : "border-surface-600 bg-transparent text-surface-500 hover:border-green-500 hover:text-green-400"}`}>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
              </button>
            )}

            <button
              onClick={() => onEdit(habit)}
              className="cursor-pointer rounded-lg p-1.5 text-surface-500 transition-colors hover:bg-surface-700 hover:text-surface-300"
              aria-label="Edit"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
              </svg>
            </button>

            <button
              onClick={() => onDelete(habit)}
              className="cursor-pointer rounded-lg p-1.5 text-surface-500 transition-colors hover:bg-danger-400/10 hover:text-danger-500"
              aria-label="Delete"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-1.5">
        {DAY_LABELS.map((label, index) => {
          const dayState = getDayState(index, schedule, completedDays, todayIndex);
          const circleStyle = CIRCLE[dayState];

          return (
            <div key={`${habit._id}-${label}-${index}`} className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] font-medium text-surface-500">{label}</span>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] ${circleStyle}`}>
                {dayState === "completed" && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
                {dayState === "missed" && (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
                  </svg>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <ProgressBar value={progress} />
    </div>
  );
}