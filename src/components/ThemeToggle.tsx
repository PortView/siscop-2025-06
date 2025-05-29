"use client";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      aria-label="Alternar tema escuro/claro"
      onClick={toggleTheme}
      className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
      title={theme === "dark" ? "Modo claro" : "Modo escuro"}
      type="button"
    >
      {theme === "dark" ? (
        // Ícone Sol (modo claro)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={22} height={22} className="text-yellow-400">
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
      ) : (
        // Ícone Lua (modo escuro)
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width={22} height={22} className="text-gray-800 dark:text-gray-100">
          <path d="M21 12.79A9 9 0 0111.21 3c0 .34-.02.67-.05 1A7 7 0 1012 21c.33 0 .66-.02 1-.05A9 9 0 0121 12.79z" fill="currentColor" />
        </svg>
      )}
    </button>
  );
}
