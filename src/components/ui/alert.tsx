import React from "react";

export interface AlertProps {
  children: React.ReactNode;
  type?: "info" | "success" | "warning" | "error";
}

export function Alert({ children, type = "info" }: AlertProps) {
  const base = "rounded p-4 mb-2 text-sm font-medium border flex items-start gap-2";
  const color =
    type === "success"
      ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700"
      : type === "warning"
      ? "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-700"
      : type === "error"
      ? "bg-red-50 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-700"
      : "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700";
  return <div className={`${base} ${color}`}>{children}</div>;
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <div className="mt-1">{children}</div>;
}

