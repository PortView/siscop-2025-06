import React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function Avatar({ src, alt, fallback, className, children }: AvatarProps) {
  return (
    <span
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-800",
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover rounded-full"
        />
      ) : fallback ? (
        <span
          className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-300"
        >
          {fallback}
        </span>
      ) : (
        children
      )}
    </span>
  )
}
