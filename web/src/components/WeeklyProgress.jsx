const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * WeeklyProgress — 7-day interactive toggle circles.
 * Each day that is scheduled shows as toggleable.
 * Completed days show as solid fills, scheduled-only as dotted outlines.
 */
export default function WeeklyProgress({ schedule, completedToday, onToggleDay, habitId }) {
  return (
    <div className="flex items-center gap-1.5">
      {DAY_NAMES.map((day, i) => {
        const isScheduled = schedule.includes(day);
        const isDone = isScheduled && completedToday;

        return (
          <button
            key={day}
            type="button"
            onClick={() => onToggleDay(day)}
            className="cursor-pointer flex flex-col items-center gap-0.5 group"
            aria-label={`${day} ${isDone ? "completed" : isScheduled ? "scheduled" : "off"}`}
          >
            <span className="text-[9px] font-medium text-surface-400">{DAY_LABELS[i]}</span>
            <DayDot isScheduled={isScheduled} isDone={isDone} />
          </button>
        );
      })}
    </div>
  );
}

function DayDot({ isScheduled, isDone }) {
  if (isDone) {
    return (
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-success-500 transition-all duration-200 group-hover:bg-success-600 shadow-sm shadow-success-400/30">
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </span>
    );
  }
  if (isScheduled) {
    return (
      <span className="block w-6 h-6 rounded-full bg-danger-400/10 border-[1.5px] border-danger-400 transition-all duration-200 group-hover:bg-danger-400/20" />
    );
  }
  return (
    <span className="block w-6 h-6 rounded-full border-[1.5px] border-surface-200 transition-colors group-hover:border-surface-300" />
  );
}
