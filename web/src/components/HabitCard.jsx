import ProgressBar from "./ProgressBar";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"], DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], JS_DAYS = [1, 2, 3, 4, 5, 6, 0];
const CIRCLE = { completed: "bg-green-500 border-green-500 text-white", scheduled: "bg-transparent border-purple-300 text-purple-400", off: "bg-transparent border-gray-200 text-gray-300" };
const weekRange = (today = new Date()) => { const end = new Date(today), monday = new Date(today); end.setHours(23, 59, 59, 999); monday.setHours(0, 0, 0, 0); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7)); return { monday, end }; };
const isCompletedThisWeek = (dateStr, index, today = new Date()) => { const { monday, end } = weekRange(today), date = new Date(dateStr); return date >= monday && date <= end && date.getDay() === JS_DAYS[index]; };
const getCircleStyle = (index, habit, today = new Date()) => (habit.completions || []).some((dateStr) => isCompletedThisWeek(dateStr, index, today)) ? CIRCLE.completed : (habit.schedule || []).includes(DAY_NAMES[index]) ? CIRCLE.scheduled : CIRCLE.off;
const getWeekCompletions = (habit, today = new Date()) => { const { monday, end } = weekRange(today); return (habit.completions || []).filter((dateStr) => { const date = new Date(dateStr); return date >= monday && date <= end; }); };

export default function HabitCard({ habit, onToggleToday, onEdit, onDelete }) {
  const today = new Date(), todayName = DAY_NAMES[(today.getDay() + 6) % 7], todayStr = today.toISOString().split("T")[0];
  const doneToday = (habit.completions || []).includes(todayStr), todayScheduled = habit.schedule.includes(todayName);
  const progress = habit.schedule.length ? Math.min(1, Math.round((getWeekCompletions(habit, today).length / habit.schedule.length) * 100) / 100) : 0;

  return (
    <div className="group rounded-2xl border border-surface-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md hover:shadow-surface-200/60">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className={`truncate text-[14px] font-semibold ${doneToday ? "line-through text-surface-400" : "text-surface-800"}`}>{habit.name}</h3>
          {habit.goal && <p className="mt-0.5 truncate text-[12px] text-surface-400">{habit.goal}</p>}
        </div>
        <div className="flex items-center gap-0.5">
          {todayScheduled && (
            <button type="button" onClick={() => !doneToday && onToggleToday(habit._id)} disabled={doneToday} title={doneToday ? "Completed today" : "Mark today as done"} aria-label={doneToday ? "Completed today" : "Mark today as done"} className={`rounded-lg p-1.5 transition-colors ${doneToday ? "cursor-default text-white" : "cursor-pointer text-gray-400 hover:text-green-500"}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${doneToday ? "border-green-500 bg-green-500 text-white" : "border-gray-300 bg-transparent text-gray-400 hover:border-green-500 hover:text-green-500"}`}>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </span>
            </button>
          )}
          <button onClick={() => onEdit(habit)} className="cursor-pointer rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600" aria-label="Edit">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
          </button>
          <button onClick={() => onDelete(habit)} className="cursor-pointer rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-danger-400/10 hover:text-danger-500" aria-label="Delete">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
          </button>
        </div>
      </div>
      <div className="mb-3 flex items-center gap-1.5">
        {DAY_LABELS.map((label, index) => <div key={`${habit._id}-${label}-${index}`} className="flex flex-col items-center gap-0.5"><span className="text-[9px] font-medium text-surface-400">{label}</span><span className={`flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] ${getCircleStyle(index, habit, today)}`}>{getCircleStyle(index, habit, today) === CIRCLE.completed && <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}</span></div>)}
      </div>
      <ProgressBar value={progress} />
    </div>
  );
}
