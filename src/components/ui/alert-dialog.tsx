import React, { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/80 transition-opacity" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-lg mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
        {children}
      </div>
    </div>
  );
}

export function AlertDialogTrigger({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="">
      {children}
    </button>
  );
}

export function AlertDialogContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function AlertDialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-2">{children}</div>;
}

export function AlertDialogFooter({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>;
}

export function AlertDialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold mb-2">{children}</h2>;
}

export function AlertDialogDescription({ children }: { children: ReactNode }) {
  return <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{children}</p>;
}

export function AlertDialogAction({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
    >
      {children}
    </button>
  );
}

export function AlertDialogCancel({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 transition-colors ml-2"
    >
      {children}
    </button>
  );
}
