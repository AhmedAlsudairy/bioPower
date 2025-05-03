"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAppStore } from "@/lib/store/store";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  toggleTheme: () => null,
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const updateUserPreferences = useAppStore(state => state.updateUserPreferences);

  // Use client-side only for theme detection to prevent hydration mismatch
  useEffect(() => {
    // Check if we already have a theme stored
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    
    if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (theme) {
      const root = window.document.documentElement;
      
      // First remove both classes
      root.classList.remove("light", "dark");
      
      // Then add the current theme class
      root.classList.add(theme);
      
      // Update data-theme attribute for compatibility
      root.setAttribute('data-theme', theme);
      
      // Store in localStorage
      localStorage.setItem("theme", theme);
      
      // Update preferences in store
      updateUserPreferences({ theme });
    }
  }, [theme, updateUserPreferences]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
