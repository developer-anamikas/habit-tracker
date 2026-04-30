import { buildCalendarMonth, habitExistsInMonth } from "../utils/buildCalendarMonth";

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getCellStyle(cell) {
  if (!cell || !cell.isCurrentMonth) {
    return "invisible";
  }

  if (cell.isToday && cell.isCompleted) {
    return "border-accent-500 bg-accent-500 text-white shadow-sm shadow-accent-200 ring-2 ring-accent-500";
  }

  if (cell.isToday) {
    return "border-accent-400 bg-accent-900/40 font-semibold text-accent-400 ring-2 ring-accent-500";
  }

  if (cell.isCompleted) {
    return "border-accent-500 bg-accent-500 text-white shadow-sm shadow-accent-200";
  }

  if (cell.isFuture && cell.isScheduled) {
    return "border-dashed border-surface-600 bg-surface-800 text-surface-500";
  }

  if (cell.isScheduled) {
    return "border-surface-600 bg-surface-800 text-surface-400";
  }

  return "border-transparent bg-surface-800 text-surface-600";
}

export default function HabitCalendarGrid({ habit, year, month }) {
  const cells = buildCalendarMonth(year, month, habit);
  const hasHabitData = habitExistsInMonth(year, month, habit);

  return (
    <div>
      <div className="mx-auto mb-1 grid max-w-[360px] grid-cols-7">
        {DAY_HEADERS.map((day) => (
          <div key={day} className="py-1 text-center text-[11px] font-semibold text-surface-400">
            {day}
          </div>
        ))}
      </div>

      <div className="mx-auto mb-3 flex max-w-[360px] flex-wrap items-center gap-3 border-b border-surface-700 pb-3 text-[11px] text-surface-400">
        <LegendItem label="Completed" markerClassName="bg-accent-500" />
        <LegendItem label="Missed" markerClassName="bg-danger-400" />
        <LegendItem label="Not scheduled" markerClassName="bg-surface-600" />
        <LegendItem label="Today" markerClassName="border border-accent-400 bg-surface-800" />
      </div>

      {hasHabitData ? (
        <div className="mx-auto grid max-w-[360px] grid-cols-7 gap-1 sm:gap-1.5">
          {cells.map((cell, index) => (
            <div
              key={`${cell?.dateStr ?? "empty"}-${index}`}
              className={`relative aspect-square rounded-lg border p-1 text-[11px] transition-all ${getCellStyle(cell)}`}
            >
              {cell?.day ? <span className="absolute left-1.5 top-1 leading-none">{cell.day}</span> : null}
              {cell?.isScheduled && !cell.isCompleted && !cell.isFuture ? (
                <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-danger-400/70" />
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto flex max-w-[360px] items-center justify-center rounded-xl border border-dashed border-surface-600 bg-surface-800 px-4 py-12 text-center text-[13px] text-surface-500">
          No data - this habit did not exist yet.
        </div>
      )}
    </div>
  );
}

function LegendItem({ label, markerClassName }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2 w-2 rounded-full ${markerClassName}`} />
      {label}
    </span>
  );
}