/**
 * ProgressBar — renders a horizontal bar showing completion percentage.
 * @param {number} value - completion ratio between 0 and 1
 */
export default function ProgressBar({ value }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 rounded-full bg-surface-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            pct === 100 ? "bg-success-500" : "bg-accent-500"
          }`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <span className="text-[11px] font-medium text-surface-400 w-8 text-right">{pct}%</span>
    </div>
  );
}
