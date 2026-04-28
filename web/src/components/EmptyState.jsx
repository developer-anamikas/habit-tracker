import { useNavigate } from "react-router-dom";

const ICONS = {
  habits: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"
    />
  ),
  calendar: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
    />
  ),
  analytics: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"
    />
  ),
  search: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
    />
  ),
};

export default function EmptyState({
  icon = "habits",
  title,
  description,
  actionLabel,
  actionPath,
  onAction,
}) {
  const navigate = useNavigate();

  function handleAction() {
    if (onAction) onAction();
    else if (actionPath) navigate(actionPath);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100">
        <svg
          className="h-7 w-7 text-surface-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {ICONS[icon] || ICONS.habits}
        </svg>
      </div>
      <p className="text-[15px] font-semibold text-surface-700">{title}</p>
      {description ? (
        <p className="max-w-sm text-[13px] leading-6 text-surface-500">{description}</p>
      ) : null}
      {actionLabel && (actionPath || onAction) ? (
        <button
          type="button"
          onClick={handleAction}
          className="mt-2 cursor-pointer rounded-xl bg-accent-500 px-4 py-2.5 text-[13px] font-medium text-white shadow-sm shadow-accent-200 transition-colors hover:bg-accent-600"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
