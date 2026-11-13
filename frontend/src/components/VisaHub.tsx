"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VISAS, fmtINR, waLink } from "@/lib/data";
import { SectionHeading } from "./Reveal";
import { WhatsAppIcon } from "./ItineraryDrawer";

export default function VisaHub() {
  const [id, setId] = useState(VISAS[0].id);
  const v = VISAS.find((x) => x.id === id) ?? VISAS[0];

  const start = () => {
    const message = `Visa enquiry — Aura Voyages\n\nCountry: ${v.country}\nType: ${v.type}\nProcessing: ${v.time}\nFee: ${fmtINR(v.fee)}\n\nI would like to start the application from Vadodara / Ahmedabad.`;
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "visa", destination: v.country, message, totalInr: v.fee }),
    }).catch(() => {});
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <section id="visa" className="scroll-mt-24 bg-[#121816] py-20 text-[#f3eee6] lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          light
          eyebrow="Passport desk"
          title="Know the visa"
          italic="before you pack"
          sub="Processing time, documents and an all-in fee in rupees. The file is prepared at the Alkapuri desk."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[280px_1fr]">
          <div className="border-t border-white/15">
            {VISAS.map((x) => (
              <button
                key={x.id}
                onClick={() => setId(x.id)}
                className={`flex w-full items-center justify-between border-b border-white/15 py-4 text-left text-sm ${id === x.id ? "text-white" : "text-white/55 hover:text-white"}`}
              >
                <span>
                  <span className="mr-2">{x.flag}</span>
                  {x.country}
                </span>
                {id === x.id && <span className="font-mono text-[10px] tracking-widest text-[#e6c98a]">OPEN</span>}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={v.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <p className="font-mono text-[10px] tracking-[0.22em] text-[#e6c98a]">
                {v.flag} {v.country.toUpperCase()}
              </p>
              <h3 className="display mt-3 text-4xl italic md:text-5xl">{v.type}</h3>
              <div className="mt-8 grid gap-6 border-y border-white/15 py-6 sm:grid-cols-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Processing</p>
                  <p className="mt-2 text-lg">{v.time}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Fee, all in</p>
                  <p className="mt-2 font-mono text-2xl text-[#e6c98a]">{fmtINR(v.fee)}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Filed from</p>
                  <p className="mt-2 text-lg">Vadodara / Ahmedabad</p>
                </div>
              </div>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Documents</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {v.docs.map((d) => (
                  <li key={d} className="border border-white/10 px-3 py-2.5 text-sm text-white/85">
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65">{v.note}</p>
              <button onClick={start} className="mt-8 inline-flex items-center gap-2 bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white">
                <WhatsAppIcon /> Start the application on WhatsApp
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
