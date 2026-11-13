"use client";

import { useEffect, useState } from "react";
import { GROUP_DEPARTURES, fmtINR, getPkg } from "@/lib/data";
import { Reveal, SectionHeading } from "./Reveal";

function Countdown({ target }: { target: number | null }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = target && now ? Math.max(0, target - now) : 0;
  const parts = [
    ["Days", Math.floor(diff / 86400000)],
    ["Hrs", Math.floor(diff / 3600000) % 24],
    ["Min", Math.floor(diff / 60000) % 60],
    ["Sec", Math.floor(diff / 1000) % 60],
  ] as const;
  return (
    <div className="flex gap-4">
      {parts.map(([l, v]) => (
        <div key={l}>
          <p className="font-mono text-xl text-[#1a1714] dark:text-[#f3eee6]">{target && now ? String(v).padStart(2, "0") : "--"}</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8175]">{l}</p>
        </div>
      ))}
    </div>
  );
}

export default function GroupDepartures({ onOpen }: { onOpen: (id: string, mode: "itinerary" | "customize") => void }) {
  const [targets, setTargets] = useState<number[] | null>(null);
  useEffect(() => {
    const base = new Date();
    base.setHours(6, 30, 0, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTargets(GROUP_DEPARTURES.map((g) => base.getTime() + g.offsetDays * 86400000));
  }, []);

  return (
    <section id="groups" className="scroll-mt-24 surface-stone py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          eyebrow="Fixed departures"
          title="Travel with the"
          italic="group"
          sub="A tour manager on the coach, and a Jain chef where the route needs one. Seats are held with the same ₹2,999 token."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {GROUP_DEPARTURES.map((g, i) => {
            const p = getPkg(g.pkgId);
            return (
              <Reveal key={g.id} delay={i * 0.06}>
                <article className="card flex h-full flex-col">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]} alt={g.label} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#a68456]">{p.location}</p>
                    <h3 className="mt-1 font-display text-2xl italic">{g.label}</h3>
                    <p className="muted mt-1 text-sm">{g.from}</p>
                    <div className="mt-5">
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#8a8175]">Departs in</p>
                      <Countdown target={targets ? targets[i] : null} />
                    </div>
                    <p className="mt-5 text-sm">
                      <span className="font-mono text-[#8f4e30]">{g.seats}</span> seats left of 30
                    </p>
                    <div className="mt-2 h-px bg-[#e4ded4] dark:bg-white/10">
                      <div className="h-px bg-[#1a1714] dark:bg-[#f3eee6]" style={{ width: `${((30 - g.seats) / 30) * 100}%` }} />
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-6">
                      <p className="font-display text-2xl">
                        {fmtINR(p.price)} <span className="font-sans text-xs text-[#8a8175]">/ person</span>
                      </p>
                      <button onClick={() => onOpen(p.id, "customize")} className="btn-solid px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em]">
                        Reserve
                      </button>
                    </div>
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
