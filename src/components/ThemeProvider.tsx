"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // Sync with DOM attribute set by inline script in <head>
  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") {
      setTheme(attr); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={domAnimation}>
          {children}
        </LazyMotion>
      </MotionConfig>
    </ThemeContext.Provider>
  );
}
