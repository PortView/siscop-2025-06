import React, { useRef, useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: ReactNode;
}

export function Tooltip({ children }: TooltipProps) {
  return <>{children}</>;
}

export function TooltipTrigger({ children, onHover }: { children: ReactNode; onHover?: (open: boolean) => void }) {
  return <>{children}</>;
}

interface TooltipContentProps {
  open: boolean;
  children: ReactNode;
  className?: string;
  sideOffset?: number;
}

export function TooltipContent({ open, sideOffset = 4, className, children }: TooltipContentProps) {
  if (!open) return null;
  return (
    <div
      className={cn(
        "absolute z-50 left-1/2 -translate-x-1/2 mt-2 overflow-hidden rounded-md border bg-gray-900 text-white px-3 py-1.5 text-sm shadow-md animate-fade-in",
        className
      )}
      style={{ top: `calc(100% + ${sideOffset}px)` }}
    >
      {children}
    </div>
  );
}
