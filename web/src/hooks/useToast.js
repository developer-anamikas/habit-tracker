import { useCallback, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState({ message: "", type: "error" });

  const showToast = useCallback((message, type = "error") => {
    setToast({ message, type });
  }, []);

  const clearToast = useCallback(() => {
    setToast({ message: "", type: "error" });
  }, []);

  return { toast, showToast, clearToast };
}
