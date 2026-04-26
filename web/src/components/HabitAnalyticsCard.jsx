import { formatLongDate } from "../utils/analytics";

function getTimelineClasses(day) {
  if (day.isCompleted) {
    return "border-accent-500 bg-accent-500 text-white shadow-sm shadow-accent-200";
  }

  if (day.isFuture) {
    return "border-surface-200 bg-surface-50 text-surface-300";
  }

  if (!day.isScheduled) {
    return "border-surface-200 bg-white text-surface-300";
  }

  return "border-danger-400/40 bg-danger-400/10 text-danger-500";
}

export default function HabitAnalyticsCard({
  habit,
  rangeType,
  onToggleToday,
  index = 0,
}) {
  const canToggleToday = Boolean(onToggleToday);
  const progressWidth = habit.completionPercentage === null ? 0 : habit.completionPercentage;

  return (
    <article
      className={`animate-analytics-rise rounded-[22px] bg-white p-4 shadow-[0_14px_30px_rgba(42,42,61,0.08)] transition-all duration-500 ${
        habit.completionPercentage === null
          ? "border border-surface-200/50 opacity-75 hover:opacity-100"
          : "border border-transparent hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(42,42,61,0.12)]"
      }`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-400">
            Habit
          </p>
          <h3 className="mt-1 truncate text-[18px] font-semibold text-surface-800">
            {habit.name}
          </h3>
          <p className="mt-1 text-[13px] text-surface-500">{habit.scheduleLabel}</p>
          {habit.goal ? (
            <p className="mt-1.5 line-clamp-2 text-[12px] text-surface-400">{habit.goal}</p>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <div
            className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${habit.tone.badgeClass}`}
          >
            {habit.completionPercentage === null ? "-- Not in this range" : habit.tone.label}
          </div>
          <div className={`mt-2 text-[26px] font-bold leading-none ${habit.tone.textClass}`}>
            {habit.completionPercentage === null ? "--" : `${habit.completionPercentage}%`}
          </div>
          <p className="mt-1 text-[12px] text-surface-400">
            {habit.streak > 0 ? `${habit.streak} streak` : "Build streak"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {rangeType === "week" ? (
          <div className="grid grid-cols-7 gap-2">
            {habit.timeline.map((day) => (
              <button
                key={day.dateKey}
                type="button"
                onClick={
                  day.isToday && day.isScheduled && !day.isFuture && canToggleToday
                    ? () => onToggleToday(habit.id)
                    : undefined
                }
                disabled={!(day.isToday && day.isScheduled && !day.isFuture && canToggleToday)}
                title={formatLongDate(day.dateKey)}
                className={`group flex flex-col items-center gap-2 rounded-2xl border border-transparent px-1.5 py-2 transition ${
                  day.isToday && day.isScheduled && !day.isFuture && canToggleToday
                    ? "cursor-pointer hover:scale-[1.02] hover:border-accent-200 hover:bg-accent-50/60 active:scale-[0.98]"
                    : "cursor-default"
                }`}
              >
                <span className="text-[11px] font-medium text-surface-400">{day.shortLabel}</span>
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-[12px] font-semibold transition-all ${getTimelineClasses(day)}`}
                >
                  {day.dayNumber}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-2 sm:grid-cols-8">
            {habit.timeline.map((day) => (
              <button
                key={day.dateKey}
                type="button"
                onClick={
                  day.isToday && day.isScheduled && !day.isFuture && canToggleToday
                    ? () => onToggleToday(habit.id)
                    : undefined
                }
                disabled={!(day.isToday && day.isScheduled && !day.isFuture && canToggleToday)}
                title={formatLongDate(day.dateKey)}
                className={`flex aspect-square items-center justify-center rounded-xl border text-[11px] font-semibold transition-all ${
                  day.isToday && day.isScheduled && !day.isFuture && canToggleToday
                    ? "cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
                    : "cursor-default"
                } ${getTimelineClasses(day)}`}
              >
                {day.dayNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-[12px] text-surface-500">
          <span>
            {habit.totalScheduledDays === 0
              ? "-- Not in this range"
              : `${habit.completedScheduledDays} of ${habit.totalScheduledDays} scheduled days completed`}
          </span>
          <span className={habit.tone.textClass}>
            {habit.completionPercentage === null ? "--" : `${habit.completionPercentage}%`}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-surface-100">
          <div
            className={`animate-analytics-bar h-full rounded-full ${habit.tone.barClass}`}
            style={{
              width: `${progressWidth}%`,
              animationDelay: `${120 + index * 80}ms`,
            }}
          />
        </div>
      </div>
    </article>
  );
}
