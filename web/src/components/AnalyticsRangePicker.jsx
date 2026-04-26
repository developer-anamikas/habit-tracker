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
    <section className="min-h-[230px] rounded-[24px] border border-accent-200/70 bg-white px-5 py-5 shadow-[0_16px_34px_rgba(124,92,255,0.12)]">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-500">
            Range control
          </p>
          <h2 className="mt-2 text-[22px] font-semibold text-surface-800">
            Choose the window you want to measure.
          </h2>
          <p className="mt-2 inline-flex rounded-full bg-accent-100 px-3.5 py-1.5 text-[13px] font-semibold text-accent-700 shadow-sm shadow-accent-100/80">
            {rangeBadge}
          </p>
          {range.hasFutureInTimeline && (
            <p className="mt-2 text-[12px] text-surface-400">
              Future dates are shown for context and excluded from the calculation.
            </p>
          )}
        </div>

        <div className="inline-flex w-fit rounded-2xl bg-surface-100 p-1.5 shadow-inner shadow-surface-200/60 ring-1 ring-accent-100/80">
          {RANGE_OPTIONS.map((option) => {
            const isActive = option.key === rangeType;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onRangeChange(option.key)}
                className={`cursor-pointer rounded-xl px-4 py-2 text-[13px] font-medium transition-all active:scale-[0.98] ${
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

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-out ${
          rangeType === "custom"
            ? "mt-4 max-h-40 opacity-100"
            : "mt-0 max-h-0 opacity-0"
        }`}
      >
        <div className="grid gap-3 border-t border-surface-100 pt-4 md:grid-cols-2">
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
      </div>
    </section>
  );
}
