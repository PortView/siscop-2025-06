import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "pending"
    | "inAnalysis"
    | "approved"
    | "expired"
    | "rejected"
    | "archived";
}

const badgeStyle: Record<string, string> = {
  default: "bg-blue-600 text-white",
  secondary: "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
  destructive: "bg-red-600 text-white",
  outline: "border border-gray-400 text-gray-800 dark:text-gray-200",
  pending: "bg-red-100 text-red-800",
  inAnalysis: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
  archived: "bg-gray-100 text-gray-800",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        badgeStyle[variant],
        className
      )}
      {...props}
    />
  );
}

