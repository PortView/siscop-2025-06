import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
