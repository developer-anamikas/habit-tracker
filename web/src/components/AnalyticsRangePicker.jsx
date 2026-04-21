import { formatRangeLabel } from "../utils/analytics";

const RANGE_OPTIONS = [
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "custom", label: "Custom" },
];

export default function AnalyticsRangePicker({
  rangeType,
  range,
  customStart,
  customEnd,
  onRangeChange,
  onCustomStartChange,
  onCustomEndChange,
}) {
  const selectedLabel =
    range.selectedStartKey && range.selectedEndKey
      ? formatRangeLabel(range.selectedStartKey, range.selectedEndKey)
      : "Select a range to view analytics";

  return (
    <section className="rounded-[20px] border border-surface-200 bg-white px-5 py-5 shadow-sm shadow-surface-200/60">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-500">
            Time range
          </p>
          <h2 className="mt-2 text-[20px] font-semibold text-surface-800">
            {range.label}
          </h2>
          <p className="mt-1 text-[13px] text-surface-500">{selectedLabel}</p>
          {range.hasFutureInTimeline && (
            <p className="mt-2 text-[12px] text-surface-400">
              Future dates are shown for context and excluded from the calculation.
            </p>
          )}
        </div>

        <div className="inline-flex rounded-2xl border border-surface-200 bg-surface-50 p-1">
          {RANGE_OPTIONS.map((option) => {
            const isActive = option.key === rangeType;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onRangeChange(option.key)}
                className={`cursor-pointer rounded-xl px-4 py-2 text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-accent-500 text-white shadow-sm shadow-accent-200"
                    : "text-surface-500 hover:bg-white hover:text-surface-800"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {rangeType === "custom" && (
        <div className="mt-4 grid gap-3 border-t border-surface-100 pt-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-400">
              Start date
            </span>
            <input
              type="date"
              value={customStart}
              onChange={(event) => onCustomStartChange(event.target.value)}
              className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-[13px] text-surface-700 outline-none transition focus:border-accent-300 focus:ring-2 focus:ring-accent-100"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-400">
              End date
            </span>
            <input
              type="date"
              value={customEnd}
              onChange={(event) => onCustomEndChange(event.target.value)}
              className="w-full rounded-xl border border-surface-200 bg-white px-3.5 py-2.5 text-[13px] text-surface-700 outline-none transition focus:border-accent-300 focus:ring-2 focus:ring-accent-100"
            />
          </label>
        </div>
      )}
    </section>
  );
}
