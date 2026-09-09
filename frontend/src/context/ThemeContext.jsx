import { createContext, useContext, useEffect, useState } from "react";
import { getActiveTheme } from "../api/themes";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    getActiveTheme()
      .then((res) => {
        if (res.data) {
          setTheme(res.data);
          applyTheme(res.data);
        }
      })
      .catch((err) => console.error("Failed to load theme", err));
  }, []);

  const applyTheme = (t) => {
    const root = document.documentElement;
    root.style.setProperty("--gold", t.primary_color);
    root.style.setProperty("--gold-light", t.accent_color);
    root.style.setProperty("--ivory", t.background_color);
  };

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);