import { useEffect } from "react";

export default function ToastNotification({ message, type = "error", onDismiss }) {
  useEffect(() => {
    if (!message) return undefined;

    const timeoutId = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timeoutId);
  }, [message, onDismiss]);

  if (!message) return null;

  const colors = {
    error: "bg-danger-600",
    success: "bg-success-600",
    info: "bg-surface-800",
  };

  return (
    <div
      className={`fixed bottom-5 left-1/2 z-50 mx-4 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium text-white shadow-lg ${colors[type] || colors.error}`}
      role="status"
    >
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="cursor-pointer text-lg leading-none text-white/70 transition-colors hover:text-white"
        aria-label="Dismiss notification"
      >
        x
      </button>
    </div>
  );
}
