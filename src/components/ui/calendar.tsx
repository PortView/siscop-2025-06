import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

const WEEK_DAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function Calendar({ value, onChange, className }: CalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selected, setSelected] = useState<Date | undefined>(value);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  function handlePrev() {
    setCurrentMonth(new Date(year, month - 1, 1));
  }
  function handleNext() {
    setCurrentMonth(new Date(year, month + 1, 1));
  }
  function handleSelect(day: number) {
    const date = new Date(year, month, day);
    setSelected(date);
    if (onChange) onChange(date);
  }

  // Gera matriz de dias para o mês atual (incluindo dias vazios no início)
  const days: (number | null)[] = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );
  while (days.length % 7 !== 0) days.push(null);

  return (
    <div className={cn("p-4 bg-white dark:bg-zinc-900 rounded-lg shadow w-fit", className)}>
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handlePrev}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
          aria-label="Mês anterior"
        >
          &#8592;
        </button>
        <span className="font-semibold text-lg">
          {currentMonth.toLocaleString("default", { month: "long" })} {year}
        </span>
        <button
          onClick={handleNext}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
          aria-label="Próximo mês"
        >
          &#8594;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEK_DAYS.map((d, i) => (
          <div key={i} className="text-center text-xs font-bold text-gray-500 dark:text-gray-300">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <button
            key={i}
            disabled={day === null}
            className={cn(
              "h-9 w-9 rounded flex items-center justify-center text-sm transition-colors",
              day && selected &&
                selected.getDate() === day &&
                selected.getMonth() === month &&
                selected.getFullYear() === year
                ? "bg-blue-600 text-white font-bold"
                : day
                ? "hover:bg-blue-100 dark:hover:bg-zinc-800 text-gray-900 dark:text-gray-100"
                : "",
              day === today.getDate() && month === today.getMonth() && year === today.getFullYear() && day !== null
                ? "border border-blue-500"
                : ""
            )}
            onClick={() => day && handleSelect(day)}
            aria-selected={
              !!(
                day && selected &&
                selected.getDate() === day &&
                selected.getMonth() === month &&
                selected.getFullYear() === year
              )
            }
          >
            {day || ""}
          </button>
        ))}
      </div>
    </div>
  );
}
