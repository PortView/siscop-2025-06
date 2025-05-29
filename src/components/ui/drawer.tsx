import React, { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Drawer({ open, onOpenChange, children }: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="fixed inset-0 bg-black/80 transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-lg mx-auto rounded-t-[10px] border bg-white dark:bg-zinc-900 shadow-lg flex flex-col animate-slide-up">
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-gray-300 dark:bg-zinc-700" />
        {children}
      </div>
    </div>
  );
}

export function DrawerTrigger({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="">
      {children}
    </button>
  );
}

export function DrawerClose({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="absolute top-2 right-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800">
      {children}
    </button>
  );
}

export function DrawerContent({ children }: { children: ReactNode }) {
  return <div className="p-4 flex-1 flex flex-col">{children}</div>;
}

export function DrawerHeader({ children }: { children: ReactNode }) {
  return <div className="grid gap-1.5 p-4 text-center sm:text-left">{children}</div>;
}

export function DrawerFooter({ children }: { children: ReactNode }) {
  return <div className="mt-auto flex flex-col gap-2 p-4">{children}</div>;
}

export function DrawerTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold leading-none tracking-tight">{children}</h2>;
}

export function DrawerDescription({ children }: { children: ReactNode }) {
  return <p className="text-sm text-gray-500 dark:text-gray-300">{children}</p>;
}

