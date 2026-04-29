import { useCallback, useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const nextToast = typeof toast === "string" ? { message: toast } : toast;

    setToasts((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length}`,
        type: "error",
        ...nextToast,
      },
    ]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback((message, type = "error") => {
    addToast({ message, type });
  }, [addToast]);

  return { toasts, addToast, removeToast, clearToasts, showToast };
}
