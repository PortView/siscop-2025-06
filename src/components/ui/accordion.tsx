import React, { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AccordionProps {
  defaultOpenIndex?: number;
  children: React.ReactElement<AccordionItemProps>[];
  className?: string;
}

export function Accordion({ defaultOpenIndex = 0, children, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);
  // Clona AccordionItem e injeta props
  return (
    <div className={cn("border rounded-md divide-y divide-gray-200 dark:divide-zinc-700", className)}>
      {React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          isOpen: openIndex === idx,
          onToggle: () => setOpenIndex(openIndex === idx ? null : idx),
        });
      })}
    </div>
  );
}

interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function AccordionItem({ title, children, isOpen = false, onToggle, className }: AccordionItemProps) {
  return (
    <div className={cn("bg-white dark:bg-zinc-900", className)}>
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between p-4 font-medium transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800 focus:outline-none",
          isOpen ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-gray-100"
        )}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={cn(
            "h-5 w-5 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all",
          isOpen ? "max-h-96 p-4 pt-0 opacity-100" : "max-h-0 p-0 opacity-0"
        )}
        style={{ transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        {isOpen && <div>{children}</div>}
      </div>
    </div>
  );
}
