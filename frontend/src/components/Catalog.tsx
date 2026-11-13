"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PACKAGES, VIBES, MONTHS, emiFrom, fmtINR, type Pkg, type Region } from "@/lib/data";
import { defaultFilters, isFiltered, matchesFilters, type Filters } from "@/lib/filters";
import { SectionHeading } from "./Reveal";

function PackageCard({
  pkg,
  onOpen,
  onGlobe,
}: {
  pkg: Pkg;
  onOpen: (id: string, mode: "itinerary" | "customize") => void;
  onGlobe: (id: string) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!hover) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % pkg.images.length), 1800);
    return () => clearInterval(t);
  }, [hover, pkg.images.length]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setIdx(0);
      }}
      className="card flex flex-col"
    >
      <button onClick={() => onGlobe(pkg.id)} className="relative block aspect-[16/10] overflow-hidden bg-[#e4ded4] text-left" aria-label={`Show ${pkg.title} on the globe`}>
        {pkg.images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={`${pkg.title}, ${pkg.location}`}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${i === idx ? "opacity-100" : "opacity-0"} ${hover && i === idx ? "scale-[1.04]" : "scale-100"}`}
          />
        ))}
        <span className="absolute left-3 top-3 bg-white/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#1a1714]">
          {pkg.region === "domestic" ? "Domestic" : "International"}
        </span>
        <span className="absolute right-3 top-3 bg-[#1a1714]/80 px-2 py-1 font-mono text-[10px] text-[#f0d48a]">{pkg.rating.toFixed(1)}</span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8175]">{pkg.location}</p>
        <h3 className="mt-1 font-display text-[1.65rem] italic leading-tight text-[#1a1714] dark:text-[#f3eee6]">{pkg.title}</h3>
        <p className="muted mt-2 text-sm leading-relaxed">{pkg.blurb}</p>
        <p className="mt-3 text-[12px] font-medium text-[#1c6b73]">Jain kitchen available · Ex-Vadodara / Ahmedabad</p>
        <p className="muted mt-2 text-xs">
          {pkg.days} days / {pkg.nights} nights · {pkg.reviews} reviews
        </p>
        <div className="mt-5 flex items-end justify-between border-t border-[#e4ded4] pt-4 dark:border-white/10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8a8175]">From</p>
            <p className="font-display text-3xl text-[#1a1714] dark:text-[#f3eee6]">
              {fmtINR(pkg.price)}
              <span className="ml-1 font-sans text-sm text-[#6f6860]">/ person</span>
            </p>
          </div>
          <p className="text-right font-mono text-[11px] text-[#8f4e30]">
            EMI {fmtINR(emiFrom(pkg.price))}
            <span className="block text-[#8a8175]">/ month</span>
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => onOpen(pkg.id, "itinerary")} className="btn-ghost px-2 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]">
            Day-by-day
          </button>
          <button onClick={() => onOpen(pkg.id, "customize")} className="btn-solid px-2 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]">
            Customise &amp; quote
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function Catalog({
  region,
  setRegion,
  filters,
  setFilters,
  onOpen,
  onGlobe,
}: {
  region: Region | "all";
  setRegion: (r: Region | "all") => void;
  filters: Filters;
  setFilters: (f: Filters) => void;
  onOpen: (id: string, mode: "itinerary" | "customize") => void;
  onGlobe: (id: string) => void;
}) {
  const list = PACKAGES.filter((p) => matchesFilters(p, filters, region));
  const tabs: { id: Region | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "domestic", label: "Domestic" },
    { id: "international", label: "International" },
  ];
  const vibeLabel = VIBES.find((v) => v.id === filters.vibe)?.label;

  return (
    <section id="packages" className="scroll-mt-24 surface-stone py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="The collection"
          title="Holidays written for"
          italic="Gujarati travellers"
          sub="Fixed prices in rupees. A Gujarati-speaking manager on group departures. Jain and pure-veg meals planned before you fly."
        />

        <div className="mt-10 flex flex-col gap-4 border-b border-[#e4ded4] pb-4 md:flex-row md:items-end md:justify-between dark:border-white/10">
          <div className="flex gap-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setRegion(t.id)}
                className={`pb-1 text-sm font-medium ${region === t.id ? "border-b border-[#1a1714] text-[#1a1714] dark:border-[#f3eee6] dark:text-[#f3eee6]" : "text-[#8a8175]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6f6860]">
            <span className="font-mono">{list.length} trips</span>
            {filters.vibe !== "all" && <span>{vibeLabel}</span>}
            {filters.month !== "all" && <span>{MONTHS[filters.month as number]}</span>}
            {filters.budget < 250000 && <span>≤ {fmtINR(filters.budget)}</span>}
            {isFiltered(filters) && (
              <button onClick={() => setFilters(defaultFilters)} className="text-[#8f4e30] underline">
                Clear
              </button>
            )}
          </div>
        </div>

        <motion.div layout className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <PackageCard key={p.id} pkg={p} onOpen={onOpen} onGlobe={onGlobe} />
            ))}
          </AnimatePresence>
        </motion.div>

        {list.length === 0 && (
          <div className="mt-10 border border-dashed border-[#cfc6b8] px-8 py-14 text-center dark:border-white/20">
            <p className="font-display text-3xl italic">Nothing sits in that exact brief.</p>
            <p className="muted mt-2 text-sm">Widen the month or the budget — or ask the desk to build it.</p>
            <button
              onClick={() => {
                setFilters(defaultFilters);
                setRegion("all");
              }}
              className="btn-solid mt-6 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
            >
              Show every trip
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
