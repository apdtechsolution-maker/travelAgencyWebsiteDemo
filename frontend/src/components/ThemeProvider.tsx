"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Atmosphere = "day" | "night";

type Ctx = { atmosphere: Atmosphere; toggle: () => void };

const ThemeCtx = createContext<Ctx>({ atmosphere: "day", toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [atmosphere, setAtmosphere] = useState<Atmosphere>("day");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (localStorage.getItem("aura-atmosphere") === "night") setAtmosphere("night");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", atmosphere === "night");
    localStorage.setItem("aura-atmosphere", atmosphere);
  }, [atmosphere]);

  const toggle = useCallback(() => setAtmosphere((a) => (a === "day" ? "night" : "day")), []);
  const value = useMemo(() => ({ atmosphere, toggle }), [atmosphere, toggle]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useAtmosphere = () => useContext(ThemeCtx);
