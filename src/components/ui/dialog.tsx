import React, { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/80 transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-lg mx-auto bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
        {children}
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => onOpenChange(false)}
        >
          <span className="sr-only">Fechar</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Exemplo de uso:
// const [open, setOpen] = useState(false);
// <Dialog open={open} onOpenChange={setOpen}>Conteúdo do Modal</Dialog>

// Componentes auxiliares para manter compatibilidade com API antiga
export function DialogTrigger({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="">
      {children}
    </button>
  );
}

export function DialogContent({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-2">{children}</div>;
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold mb-2">{children}</h2>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{children}</p>;
}
