"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "h-10 w-10 rounded-full border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300",
          className
        )}
      >
        <div className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "h-10 w-10 rounded-full border-2 transition-all duration-300 group",
        theme === "light"
          ? "border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:border-gray-300/70"
          : "border-gray-600/50 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/90 hover:border-gray-500/70",
        className
      )}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
      ) : (
        <Sun className="h-4 w-4 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}