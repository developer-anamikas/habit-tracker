import WeeklyProgress from "./WeeklyProgress";
import ProgressBar from "./ProgressBar";

/**
 * HabitCard — card-based habit display with streak, weekly toggles, and progress bar.
 */
export default function HabitCard({ habit, onToggleDay, onToggleComplete, onEdit, onDelete }) {
  const today = new Date().toISOString().split("T")[0];
  const completedToday = (habit.completions || []).includes(today);
  const scheduledCount = habit.schedule.length || 1;
  const completedCount = completedToday ? 1 : 0;
  const streak = calculateStreak(habit);

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-5 transition-shadow duration-200 hover:shadow-md hover:shadow-surface-200/60 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => onToggleComplete(habit._id)}
            className="cursor-pointer shrink-0 mt-0.5"
            aria-label={completedToday ? "Mark not done" : "Mark done"}
          >
            {completedToday ? (
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-success-500 shadow-sm shadow-success-400/30 transition-transform duration-200 hover:scale-110">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
            ) : (
              <span className="block w-7 h-7 rounded-full border-2 border-surface-300 hover:border-accent-400 transition-colors duration-200" />
            )}
          </button>
          <div className="min-w-0">
            <h3 className={`text-[14px] font-semibold truncate ${completedToday ? "line-through text-surface-400" : "text-surface-800"}`}>
              {habit.name}
            </h3>
            {habit.goal && (
              <p className="text-[12px] text-surface-400 truncate mt-0.5">{habit.goal}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {streak > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 0 0-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 0 0-.613 3.58 2.64 2.64 0 0 1-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 0 0 5.05 6.05 6.981 6.981 0 0 0 3 11a7 7 0 0 0 11.95 4.95c.592-.591.98-1.29 1.216-2.025.228-.708.301-1.506.165-2.376-.15-.963-.534-1.996-1.17-3.09-.635-1.09-1.52-2.265-2.602-3.4l-1.164-1.506Z" clipRule="evenodd" />
              </svg>
              {streak}
            </span>
          )}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(habit)} className="cursor-pointer p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors" aria-label="Edit">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
              </svg>
            </button>
            <button onClick={() => onDelete(habit)} className="cursor-pointer p-1.5 rounded-lg hover:bg-danger-400/10 text-surface-400 hover:text-danger-500 transition-colors" aria-label="Delete">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <WeeklyProgress
          schedule={habit.schedule}
          completedToday={completedToday}
          onToggleDay={(day) => onToggleDay(habit, day)}
          habitId={habit._id}
        />
      </div>

      <ProgressBar value={completedCount / scheduledCount} />
    </div>
  );
}

function calculateStreak(habit) {
  const completions = (habit.completions || []).sort().reverse();
  if (completions.length === 0) return 0;

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < completions.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split("T")[0];
    if (completions.includes(expectedStr)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
