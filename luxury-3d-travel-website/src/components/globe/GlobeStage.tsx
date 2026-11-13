"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DESTINATIONS, fmtINR, getPkg, type Destination } from "@/lib/data";
import { useAtmosphere } from "@/components/ThemeProvider";

const GlobeScene = dynamic(() => import("./GlobeScene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function BoardingPass({ dest, onInspect }: { dest: Destination; onInspect: () => void }) {
  const pkg = getPkg(dest.id);
  return (
    <div className="bg-[#f4efe6] text-[#1a1714] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between bg-[#1a1714] px-4 py-2.5 text-[#f4efe6]">
        <span className="font-mono text-[10px] tracking-[0.28em]">AURA VOYAGES</span>
        <span className="font-mono text-[10px] tracking-[0.22em] text-[#e6c98a]">BOARDING PASS</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={dest.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="px-4 py-4 sm:px-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] tracking-[0.22em] text-[#8a8175]">FROM</p>
              <p className="display text-3xl">BDQ</p>
              <p className="text-[11px] text-[#6f6860]">Vadodara · AMD</p>
            </div>
            <div className="mb-5 flex-1 border-t border-dashed border-[#cfc6b8]" />
            <div className="text-right">
              <p className="font-mono text-[9px] tracking-[0.22em] text-[#8a8175]">TO</p>
              <p className="display text-3xl text-[#8f4e30]">{dest.code}</p>
              <p className="text-[11px] text-[#6f6860]">{dest.short}</p>
            </div>
          </div>
          <p className="mt-3 font-display text-lg italic leading-snug">{pkg.title}</p>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#e4d9c8] pt-4 sm:grid-cols-4">
            <Field label="Duration" value={`${pkg.days}D / ${pkg.nights}N`} />
            <Field label="Weather" value={dest.weather} />
            <Field label="Visa" value={dest.visaStatus} />
            <Field label="From" value={`${fmtINR(pkg.price)} / person`} accent />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="barcode h-8 w-28 text-[#1a1714] opacity-80" />
            <button onClick={onInspect} className="btn-solid px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em]">
              Inspect trip
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8a8175]">{label}</p>
      <p className={`mt-1 text-[13px] font-medium leading-snug ${accent ? "font-mono text-[#8f4e30]" : ""}`}>{value}</p>
    </div>
  );
}

export default function GlobeStage({
  activeId,
  onSelect,
  onInspect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
  onInspect: (id: string) => void;
}) {
  const { atmosphere } = useAtmosphere();
  const night = atmosphere === "night";
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const active = DESTINATIONS.find((d) => d.id === activeId) ?? DESTINATIONS[0];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(hasWebGL());
  }, []);

  return (
    <div>
      <div className="relative h-[520px] w-full overflow-hidden bg-[#07090c] shadow-[0_30px_80px_rgba(18,24,22,0.18)] lg:h-[640px]">
        {webgl === true && <GlobeScene activeId={activeId} onSelect={onSelect} night={night} />}
        {webgl === false && (
          <div className="absolute inset-0 grid place-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/globe/earth-day.jpg" alt="Earth" className="h-[78%] rounded-full object-cover" style={{ aspectRatio: "1", objectFit: "cover", clipPath: "circle(50%)" }} />
          </div>
        )}
        {webgl === null && (
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-mono text-[10px] tracking-[0.28em] text-white/50">LOADING EARTH</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.55)]" />
        <p className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] tracking-[0.22em] text-white/55">LIVE ROUTE · VADODARA</p>

        <div className="absolute inset-x-3 bottom-3 z-10">
          <div className="no-scrollbar flex gap-1 overflow-x-auto bg-black/45 p-1 backdrop-blur-md">
            {DESTINATIONS.map((d) => {
              const on = d.id === activeId;
              return (
                <button
                  key={d.id}
                  onClick={() => onSelect(d.id)}
                  className={`shrink-0 px-3 py-2 text-left text-[11px] font-medium tracking-wide transition ${
                    on ? "bg-[#f4efe6] text-[#1a1714]" : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <span className="block font-mono text-[9px] tracking-[0.16em] opacity-70">{d.code}</span>
                  {d.short}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-px">
        <BoardingPass dest={active} onInspect={() => onInspect(active.id)} />
      </div>
      <p className="mt-3 text-center font-mono text-[10px] tracking-[0.2em] text-[#8a8175]">DRAG TO ORBIT · SELECT A CITY</p>
    </div>
  );
}
