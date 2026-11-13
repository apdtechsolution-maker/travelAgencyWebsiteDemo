"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAtmosphere } from "./ThemeProvider";
import { WHATSAPP_NUMBER, type Region } from "@/lib/data";

const phone = `+${WHATSAPP_NUMBER.replace(/^(\d{2})(\d{5})(\d{5})$/, "$1 $2 $3")}`;

export function UtilityBar() {
  return (
    <div className="bg-deep text-[#e7e1d6]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] tracking-[0.14em] lg:px-8">
        <p className="truncate">Direct departures from Vadodara &amp; Ahmedabad · Pure veg &amp; Jain kitchens · Visa desk in-house</p>
        <a href={`tel:+${WHATSAPP_NUMBER}`} className="hidden shrink-0 font-mono tracking-normal sm:inline">
          {phone}
        </a>
      </div>
    </div>
  );
}

export default function Navbar({ onRegion, onPlan }: { onRegion: (r: Region | "all") => void; onPlan: () => void }) {
  const { atmosphere, toggle } = useAtmosphere();
  const [open, setOpen] = useState(false);
  const night = atmosphere === "night";

  const links: { label: string; href?: string; action?: () => void }[] = [
    { label: "Globe", href: "#globe" },
    { label: "Domestic", href: "#packages", action: () => onRegion("domestic") },
    { label: "International", href: "#packages", action: () => onRegion("international") },
    { label: "Trip builder", action: onPlan },
    { label: "Visas", href: "#visa" },
    { label: "Departures", href: "#groups" },
  ];

  const go = (l: (typeof links)[number]) => {
    l.action?.();
    setOpen(false);
    if (l.href) {
      setTimeout(() => document.querySelector(l.href!)?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
    }
  };

  const setMode = (next: "day" | "night") => {
    if ((next === "night") !== night) toggle();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e4ded4] bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-[#101413]/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 lg:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-[#1a1714] text-[11px] font-semibold tracking-[0.14em] text-[#1a1714] dark:border-[#f3eee6] dark:text-[#f3eee6]">
            AV
          </span>
          <span className="leading-none">
            <span className="font-display text-[1.7rem] font-medium tracking-tight text-[#1a1714] dark:text-[#f3eee6]">
              Aura <span className="italic">Voyages</span>
            </span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.28em] text-[#8a8175]">Tour studio · Vadodara</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 xl:flex">
          {links.map((l) => (
            <button key={l.label} onClick={() => go(l)} className="text-[13px] font-medium text-[#3c3832] transition hover:text-[#1c6b73] dark:text-[#e7e1d6]">
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden border border-[#e4ded4] text-[10px] font-semibold uppercase tracking-[0.16em] sm:flex dark:border-white/15">
            <button onClick={() => setMode("day")} className={`px-2.5 py-2 ${!night ? "bg-[#1a1714] text-white" : "text-[#6f6860] dark:text-[#b7b0a6]"}`}>
              Day
            </button>
            <button onClick={() => setMode("night")} className={`px-2.5 py-2 ${night ? "bg-[#1a1714] text-white dark:bg-[#f3eee6] dark:text-[#1a1714]" : "text-[#6f6860] dark:text-[#b7b0a6]"}`}>
              Night
            </button>
          </div>
          <button onClick={onPlan} className="btn-solid hidden px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] md:inline-block">
            Plan my trip
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center border border-[#e4ded4] text-[#1a1714] dark:border-white/15 dark:text-[#f3eee6] xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[#e4ded4] xl:hidden dark:border-white/10"
          >
            <div className="flex flex-col px-4 py-3">
              {links.map((l) => (
                <button key={l.label} onClick={() => go(l)} className="border-b border-[#e4ded4] py-3.5 text-left text-sm font-medium dark:border-white/10">
                  {l.label}
                </button>
              ))}
              <div className="mt-4 flex gap-2">
                <button onClick={() => setMode("day")} className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest ${!night ? "btn-solid" : "btn-ghost"}`}>
                  Day
                </button>
                <button onClick={() => setMode("night")} className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-widest ${night ? "btn-solid" : "btn-ghost"}`}>
                  Night
                </button>
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  onPlan();
                }}
                className="btn-solid mt-3 py-3 text-sm font-semibold uppercase tracking-[0.14em]"
              >
                Plan my trip
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
