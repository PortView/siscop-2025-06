import React from "react";
import { cn } from "@/lib/utils";

interface AspectRatioProps {
  ratio?: number;
  className?: string;
  children: React.ReactNode;
}

export function AspectRatio({ ratio = 16 / 9, className, children }: AspectRatioProps) {
  return (
    <div
      className={cn("relative w-full", className)}
      style={{ aspectRatio: `${ratio}` }}
    >
      <div className="absolute inset-0 w-full h-full">{children}</div>
    </div>
  );
}
