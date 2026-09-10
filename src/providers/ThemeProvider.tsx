"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme } from "@/types/common";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "expenseiq_theme_preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
      return savedTheme || "system";
    }
    return "system";
  });
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Sync class on <html> element
  const applyTheme = (targetTheme: "light" | "dark") => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(targetTheme);
    root.setAttribute("data-theme", targetTheme);
    setResolvedTheme(targetTheme);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const resolveAndApply = (selectedTheme: Theme) => {
      if (selectedTheme === "system") {
        applyTheme(mediaQuery.matches ? "dark" : "light");
      } else {
        applyTheme(selectedTheme);
      }
    };

    resolveAndApply(theme);

    // Listener for system color scheme changes if set to system
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const currentTheme = (localStorage.getItem(STORAGE_KEY) as Theme) || "system";
      if (currentTheme === "system") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);

    if (newTheme === "system") {
      const systemIsDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(systemIsDark ? "dark" : "light");
    } else {
      applyTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    if (theme === "system") {
      const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    } else {
      const nextTheme = theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
