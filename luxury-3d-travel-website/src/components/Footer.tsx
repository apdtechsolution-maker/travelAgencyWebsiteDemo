"use client";

import { WHATSAPP_NUMBER, waLink } from "@/lib/data";
import { Reveal } from "./Reveal";

const phone = `+${WHATSAPP_NUMBER.replace(/^(\d{2})(\d{5})(\d{5})$/, "$1 $2 $3")}`;

const TRUST = ["IATA accredited agent", "Ministry of Tourism, Govt. of India", "Gujarat Tourism partner", "TAAI · ADTOI", "UPI, card & EMI"];

export default function Footer() {
  return (
    <footer className="bg-[#121816] text-[#d9d3c8]">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
          <Reveal>
            <p className="kicker">For other agencies</p>
            <h2 className="display mt-4 max-w-4xl text-4xl text-white md:text-5xl">
              Flagship 3D interactive travel &amp; automated itinerary engine, engineered by <span className="italic text-[#e6c98a]">APD Solutions, Vadodara</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/70">Upgrade your travel agency website today.</p>
            <a
              href={waLink("Hello APD Solutions — I saw the Aura Voyages site and would like a 3D travel website for my agency.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block bg-[#f3eee6] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-[#1a1714] transition hover:bg-[#1c6b73] hover:text-white"
            >
              Talk to APD Solutions
            </a>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap gap-x-8 gap-y-2 px-4 py-5 text-[11px] uppercase tracking-[0.16em] text-white/45 lg:px-8">
        {TRUST.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 border-t border-white/10 px-4 py-14 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-3xl text-white">
            Aura <span className="italic">Voyages</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">Experiential holidays from a desk on Jetalpur Road. Domestic, international, and the paperwork in between.</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#e6c98a]">Studio</p>
          <p className="mt-4 text-sm leading-relaxed">
            Alkapuri / Jetalpur Road
            <br />
            Vadodara, Gujarat 390007
          </p>
          <p className="mt-3 font-mono text-sm">{phone}</p>
          <p className="mt-1 text-xs text-white/45">Every day, 9:00 – 22:00 IST</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#e6c98a]">Index</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["Globe", "#globe"],
              ["Collection", "#packages"],
              ["Departures", "#groups"],
              ["Visas", "#visa"],
              ["Guests", "#stories"],
            ].map(([l, h]) => (
              <li key={h}>
                <a href={h} className="text-white/70 transition hover:text-white">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="px-4 text-center font-mono text-[11px] tracking-wide text-white/40">
          © {new Date().getFullYear()} Aura Voyages. Flagship 3D travel &amp; booking engine engineered by APD Solutions, Vadodara.
        </p>
      </div>
    </footer>
  );
}
