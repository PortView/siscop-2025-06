import React, { useRef, useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Popover({ open, onOpenChange, children }: PopoverProps) {
  // Fecha popover ao clicar fora
  const popoverRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (open && popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onOpenChange(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onOpenChange]);

  return (
    <div className="relative" ref={popoverRef}>
      {children}
    </div>
  );
}

export function PopoverTrigger({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="">
      {children}
    </button>
  );
}

interface PopoverContentProps {
  open: boolean;
  align?: "center" | "start" | "end";
  children: ReactNode;
  className?: string;
  sideOffset?: number;
}

export function PopoverContent({ open, align = "center", sideOffset = 4, className, children }: PopoverContentProps) {
  if (!open) return null;
  let alignment = "left-1/2 -translate-x-1/2";
  if (align === "start") alignment = "left-0";
  if (align === "end") alignment = "right-0";
  return (
    <div
      className={cn(
        "absolute z-50 w-72 rounded-md border bg-white dark:bg-zinc-900 p-4 text-gray-900 dark:text-gray-50 shadow-md outline-none mt-2",
        alignment,
        className
      )}
      style={{ top: `calc(100% + ${sideOffset}px)` }}
    >
      {children}
    </div>
  );
}
