"use client";
import React, { createContext, useCallback, useContext, useState, ReactNode } from "react";
import {
  ToastProvider as RadixToastProvider,
  ToastViewport,
  Toast as RadixToast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

interface ToastMessage {
  id: number;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastContextType {
  toast: (message: string, options?: { title?: string; variant?: "default" | "destructive" }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx.toast;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback((message: string, options?: { title?: string; variant?: "default" | "destructive" }) => {
    setToasts((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        title: options?.title,
        description: message,
        variant: options?.variant || "default",
      },
    ]);
  }, []);

  const handleOpenChange = (id: number, open: boolean) => {
    if (!open) {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <RadixToastProvider>
        {children}
        <ToastViewport />
        {toasts.map((t) => (
          <RadixToast
            key={t.id}
            open={true}
            onOpenChange={(open) => handleOpenChange(t.id, open)}
            variant={t.variant}
          >
            {t.title && <ToastTitle>{t.title}</ToastTitle>}
            <ToastDescription>{t.description}</ToastDescription>
          </RadixToast>
        ))}
      </RadixToastProvider>
    </ToastContext.Provider>
  );
};
