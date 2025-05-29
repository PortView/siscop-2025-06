import React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";
