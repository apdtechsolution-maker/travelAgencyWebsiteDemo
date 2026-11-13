"use client";

import { motion } from "framer-motion";
import GlobeStage from "./globe/GlobeStage";
import { MONTHS, VIBES, fmtINR } from "@/lib/data";
import { BUDGET_MAX, BUDGET_MIN, defaultFilters, isFiltered, type Filters } from "@/lib/filters";

export default function Hero({
  activeId,
  onSelect,
  onInspect,
  filters,
  setFilters,
  matchCount,
  onSearch,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  onInspect: (id: string) => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  matchCount: number;
  onSearch: () => void;
}) {
  const pct = ((filters.budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  return (
    <section id="globe" className="scroll-mt-24 surface pb-16 pt-12 lg:pb-20 lg:pt-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div className="lg:col-span-5">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="kicker">
            Gujarat · Experiential holidays
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="display mt-5 text-[3.1rem] text-[#1a1714] sm:text-6xl lg:text-[4.4rem] dark:text-[#f3eee6]"
          >
            Don&apos;t just book a ticket.
            <span className="mt-1 block italic">Preview your world in 3D.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="muted mt-6 max-w-md text-[17px] leading-relaxed"
          >
            A studio in Vadodara for families who want the route, the villa and the visa settled before they leave. Spin the earth. The fare updates with it.
          </motion.p>
          <ul className="mt-8 space-y-3 border-t border-[#e4ded4] pt-6 text-sm dark:border-white/10">
            {[
              ["01", "Departures from Vadodara and Ahmedabad"],
              ["02", "Jain and pure-veg kitchens, on request"],
              ["03", "Visa desk — most e-visas inside 48 hours"],
            ].map(([n, t]) => (
              <li key={n} className="flex gap-4">
                <span className="font-mono text-[11px] tracking-widest text-[#a68456]">{n}</span>
                <span className="text-[#3c3832] dark:text-[#e7e1d6]">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <motion.div className="lg:col-span-7" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.8 }}>
          <GlobeStage activeId={activeId} onSelect={onSelect} onInspect={onInspect} />
        </motion.div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 lg:px-8">
        <div className="border border-[#e4ded4] bg-white dark:border-white/10 dark:bg-[#171c1b]">
          <div className="flex items-center justify-between border-b border-[#e4ded4] px-5 py-3 dark:border-white/10">
            <p className="kicker">Mood &amp; budget</p>
            {isFiltered(filters) && (
              <button onClick={() => setFilters(defaultFilters)} className="text-[12px] font-medium text-[#8f4e30] underline-offset-4 hover:underline">
                Reset
              </button>
            )}
          </div>
          <div className="grid gap-px bg-[#e4ded4] dark:bg-white/10 md:grid-cols-[1.3fr_0.8fr_1.2fr_auto]">
            <label className="bg-white px-5 py-4 dark:bg-[#171c1b]">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8175]">Travel style</span>
              <select
                value={filters.vibe}
                onChange={(e) => setFilters({ ...filters, vibe: e.target.value as Filters["vibe"] })}
                className="mt-1 w-full bg-transparent text-sm font-medium outline-none dark:text-[#f3eee6]"
              >
                <option value="all">Any style</option>
                {VIBES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="bg-white px-5 py-4 dark:bg-[#171c1b]">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8175]">Month</span>
              <select
                value={filters.month === "all" ? "all" : String(filters.month)}
                onChange={(e) => setFilters({ ...filters, month: e.target.value === "all" ? "all" : Number(e.target.value) })}
                className="mt-1 w-full bg-transparent text-sm font-medium outline-none dark:text-[#f3eee6]"
              >
                <option value="all">Any month</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <div className="bg-white px-5 py-4 dark:bg-[#171c1b]">
              <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8175]">
                Budget / person
                <span className="tracking-normal text-[#8f4e30]">{fmtINR(filters.budget)}</span>
              </span>
              <input
                type="range"
                className="aura-range mt-4 w-full"
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                step={5000}
                value={filters.budget}
                onChange={(e) => setFilters({ ...filters, budget: Number(e.target.value) })}
                aria-label="Budget per person"
                style={{ background: `linear-gradient(90deg, #1a1714 ${pct}%, #d9d2c6 ${pct}%)` }}
              />
            </div>
            <button onClick={onSearch} className="btn-solid px-8 py-5 text-[12px] font-semibold uppercase tracking-[0.16em]">
              {matchCount > 0 ? `Show ${matchCount} trip${matchCount > 1 ? "s" : ""}` : "View all trips"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
