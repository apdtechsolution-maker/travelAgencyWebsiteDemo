"use client";

import { DESTINATIONS, fmtINR, getPkg } from "@/lib/data";
import { Reveal, SectionHeading } from "./Reveal";

export function TrustBand() {
  const items = [
    { n: "1,800+", l: "Travellers from Gujarat" },
    { n: "4.9", l: "Average guest rating" },
    { n: "48 hrs", l: "Typical e-visa desk" },
    { n: "₹2,999", l: "To hold any seat" },
  ];
  return (
    <section className="border-y border-[#e4ded4] bg-[#f4f1eb] dark:border-white/10 dark:bg-[#171c1b]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <div key={it.l} className={`px-6 py-8 ${i % 2 === 1 ? "border-l border-[#e4ded4] dark:border-white/10" : ""} ${i >= 2 ? "border-t border-[#e4ded4] lg:border-t-0 lg:border-l dark:border-white/10" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
            <p className="display text-4xl text-[#1a1714] dark:text-[#f3eee6]">{it.n}</p>
            <p className="muted mt-2 text-sm">{it.l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function DestinationStrip({
  activeId,
  onSelect,
  onOpen,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <section id="destinations" className="scroll-mt-24 surface py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="From the Vadodara desk" title="Choose a" italic="destination" sub="Six routes we fly often. Select one to draw it on the globe, or open the stay." />
          <a href="#globe" className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#1c6b73]">
            Back to the globe
          </a>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
          {DESTINATIONS.map((d, i) => {
            const pkg = getPkg(d.id);
            const on = d.id === activeId;
            return (
              <Reveal key={d.id} delay={i * 0.04}>
                <article className={`${on ? "ring-1 ring-[#1a1714] dark:ring-[#f3eee6]" : ""}`}>
                  <button onClick={() => onOpen(d.id)} className="group block w-full text-left" aria-label={`Open ${d.short} itinerary`}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#e4ded4]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pkg.images[0]} alt={pkg.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <p className="font-mono text-[10px] tracking-[0.2em] text-white/70">{d.code}</p>
                        <h3 className="font-display text-2xl italic leading-tight">{d.short}</h3>
                        <p className="mt-1 font-mono text-sm text-[#f0d48a]">From {fmtINR(pkg.price)}</p>
                      </div>
                    </div>
                  </button>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-[#3c3832] dark:text-[#e7e1d6]">{pkg.days} days</p>
                    <button onClick={() => onSelect(d.id)} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1c6b73]">
                      Show route
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
