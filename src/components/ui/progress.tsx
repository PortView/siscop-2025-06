import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value?: number;
  className?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";