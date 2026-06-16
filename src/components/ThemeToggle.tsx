import { useEffect, useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

type Theme = "dark" | "light";

const STORAGE_KEY = "app-theme";

// Legge la preferenza salvata; se assente ritorna "dark" (default app).
function readSavedTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "light" ? "light" : "dark";
}

// Applica/rimuove la classe .light su <html>, attivando l'override del tema chiaro.
function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") root.classList.add("light");
  else root.classList.remove("light");
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readSavedTheme);

  // Applica il tema al mount e ogni volta che cambia.
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Passa al tema chiaro" : "Passa al tema scuro"}
      title={isDark ? "Passa al tema chiaro" : "Passa al tema scuro"}
      className="px-2 py-1 rounded-md text-secondary hover:bg-surface hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
    </button>
  );
}
