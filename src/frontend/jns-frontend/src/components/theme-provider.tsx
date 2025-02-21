import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
}

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "jns-theme" }: ThemeProviderProps) {
  return (
    <NextThemesProvider defaultTheme={defaultTheme} storageKey={storageKey}>
      {children}
    </NextThemesProvider>
  )
}
