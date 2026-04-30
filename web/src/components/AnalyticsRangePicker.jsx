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
  const rangeBadge = `${RANGE_OPTIONS.find((option) => option.key === rangeType)?.label || "Range"} | ${selectedLabel}`;

  return (
    <section className="min-h-[230px] rounded-[24px] border border-surface-700 bg-surface-800 px-5 py-5 shadow-[0_16px_34px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-400">
            Range control
          </p>
          <h2 className="mt-2 text-[22px] font-semibold text-surface-100">
            Choose the window you want to measure.
          </h2>
          <p className="mt-2 inline-flex rounded-full bg-accent-900/50 px-3.5 py-1.5 text-[13px] font-semibold text-accent-400 shadow-sm">
            {rangeBadge}
          </p>
          {range.hasFutureInTimeline && (
            <p className="mt-2 text-[12px] text-surface-500">
              Future dates are shown for context and excluded from the calculation.
            </p>
          )}
        </div>

        <div className="inline-flex w-fit rounded-2xl bg-surface-700 p-1.5 shadow-inner ring-1 ring-surface-600">
          {RANGE_OPTIONS.map((option) => {
            const isActive = option.key === rangeType;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onRangeChange(option.key)}
                className={`cursor-pointer rounded-xl px-4 py-2 text-[13px] font-medium transition-all active:scale-[0.98] ${
                  isActive
                    ? "bg-accent-500 text-white shadow-sm shadow-accent-900"
                    : "text-surface-400 hover:bg-surface-600 hover:text-surface-100"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-out ${
          rangeType === "custom"
            ? "mt-4 max-h-40 opacity-100"
            : "mt-0 max-h-0 opacity-0"
        }`}
      >
        <div className="grid gap-3 border-t border-surface-700 pt-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-400">
              Start date
            </span>
            <input
              type="date"
              value={customStart}
              onChange={(event) => onCustomStartChange(event.target.value)}
              className="w-full rounded-xl border border-surface-600 bg-surface-700 px-3.5 py-2.5 text-[13px] text-surface-200 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
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
              className="w-full rounded-xl border border-surface-600 bg-surface-700 px-3.5 py-2.5 text-[13px] text-surface-200 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            />
          </label>
        </div>
      </div>
    </section>
  );
}