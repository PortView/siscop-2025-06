import React, { useState, ReactNode, Children, isValidElement, cloneElement } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  defaultValue?: string;
  value?: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
  children: ReactNode;
}

export function Tabs({ defaultValue, value, orientation = "horizontal", className, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(value || defaultValue || "");
  // Atualiza ativo se value mudar externamente
  React.useEffect(() => {
    if (value !== undefined) setActiveTab(value);
  }, [value]);
  // Clona filhos e injeta props
  return (
    <div className={cn(orientation === "vertical" ? "flex flex-row" : "flex flex-col", className)}>
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        // Injeta activeTab e setActiveTab apenas em componentes customizados, nunca em elementos DOM
        const isCustom = typeof child.type !== 'string';
        return isCustom
          ? cloneElement(child as any, { activeTab, setActiveTab, orientation })
          : child;
      })}
    </div>
  );
}

export function TabsList({ children, className, activeTab, setActiveTab, orientation }: any) {
  return (
    <div className={cn(
      orientation === "vertical"
        ? "flex flex-col bg-[#d0e0f0] rounded-r-none"
        : "flex flex-row bg-[#d0e0f0] rounded-b-none",
      className
    )}>
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        return cloneElement(child as any, { activeTab, setActiveTab, orientation });
      })}
    </div>
  );
}

export function TabsTrigger({ value, children, className, activeTab, setActiveTab, orientation }: any) {
  const isActive = activeTab === value;
  return (
    <button
      type="button"
      className={cn(
        "px-2 py-6 h-24 w-10 flex items-center justify-center text-xs font-medium transition-all",
        orientation === "vertical" ? "-rotate-90 origin-center whitespace-nowrap" : "",
        isActive ? "bg-white text-blue-800" : "text-gray-600",
        className
      )}
      onClick={() => setActiveTab(value)}
      aria-selected={isActive}
      tabIndex={isActive ? 0 : -1}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className, activeTab }: any) {
  if (activeTab !== value) return null;
  return <div className={cn("w-full h-full", className)}>{children}</div>;
}
