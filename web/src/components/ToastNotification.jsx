import { useEffect } from "react";

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timeoutId = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timeoutId);
  }, [onDismiss, toast.id]);

  const colors = {
    error: "bg-danger-600",
    success: "bg-success-600",
    info: "bg-surface-800",
  };

  return (
    <div
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium text-white shadow-lg ${colors[toast.type] || colors.error}`}
      role="status"
    >
      <span className="flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="cursor-pointer text-lg leading-none text-white/70 transition-colors hover:text-white"
        aria-label="Dismiss notification"
      >
        x
      </button>
    </div>
  );
}

export default function ToastNotification({ toasts, message, type = "error", onDismiss }) {
  const visibleToasts = toasts ?? (message ? [{ id: "single-toast", message, type }] : []);

  if (visibleToasts.length === 0) return null;

  function handleDismiss(id) {
    if (toasts) onDismiss(id);
    else onDismiss();
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-50 mx-4 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2">
      {visibleToasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}
