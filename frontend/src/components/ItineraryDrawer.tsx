"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BedDouble, CalendarDays, ChevronDown, Download, Flame, MapPin, Minus, Plane, Plus, ShieldCheck, Users, Utensils, X } from "lucide-react";
import {
  CANDLE_PRICE,
  GROUP_TYPES,
  HOTEL_TIERS,
  TOKEN_AMOUNT,
  calcQuote,
  defaultConfig,
  emiFrom,
  fmtINR,
  px,
  waLink,
  type Config,
  type Pkg,
} from "@/lib/data";

const HOTEL_IMAGES = [px(6466496, 900, 600), px(40624417, 900, 600), px(34645081, 900, 600)];

function mealsFor(i: number, n: number) {
  if (i === 0) return "Welcome Drink, Lunch, Jain Dinner";
  if (i === n - 1) return "Breakfast";
  return "Breakfast, Lunch, Jain Dinner";
}

function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ItineraryDrawer({ pkg, mode, onClose }: { pkg: Pkg; mode: "itinerary" | "customize"; onClose: () => void }) {
  const [cfg, setCfg] = useState<Config>({ ...defaultConfig });
  const [open, setOpen] = useState(0);
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  });
  const [sent, setSent] = useState(false);
  const cfgRef = useRef<HTMLDivElement>(null);
  const q = useMemo(() => calcQuote(pkg, cfg), [pkg, cfg]);
  const hotel = HOTEL_TIERS[cfg.hotel];
  const group = GROUP_TYPES.find((g) => g.id === cfg.group)!;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (mode !== "customize") return;
    const t = setTimeout(() => cfgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 500);
    return () => clearTimeout(t);
  }, [mode]);

  const addons = [cfg.flights && "Return Flights", cfg.insurance && "Travel Insurance & Visa", cfg.candle && "Candlelight Setup"].filter(Boolean) as string[];

  const message = [
    "✈️ *AURA VOYAGES — Boarding Pass Quote Request*",
    "",
    `📍 Destination: *${pkg.title}* (${pkg.location})`,
    `🗓️ Duration: ${pkg.days} Days / ${pkg.nights} Nights`,
    `🛫 Departure: Vadodara / Ahmedabad on ${fmtDate(date)}`,
    `🏨 Hotel: ${hotel.label} — ${pkg.hotels[cfg.hotel]}`,
    `👥 Group: ${group.label}`,
    `🧳 Passengers: ${cfg.pax}`,
    `➕ Add-ons: ${addons.length ? addons.join(", ") : "None"}`,
    `🌿 Meals: Pure Veg / Jain preferred`,
    "",
    `💰 *Total: ${fmtINR(q.total)}*  (${fmtINR(q.perPerson)} per person)`,
    "",
    `Please confirm availability and share the payment link for the ${fmtINR(TOKEN_AMOUNT)} token booking.`,
  ].join("\n");

  const saveLead = () => {
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "quote", destination: pkg.title, message, totalInr: q.total }),
    }).catch(() => {});
  };

  const sendWhatsApp = () => {
    saveLead();
    setSent(true);
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  };

  const downloadPass = () => {
    const W = 1000;
    const H = 420;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d");
    if (!g) return;
    const bg = g.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#061320");
    bg.addColorStop(1, "#0B2A45");
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    g.fillStyle = "#FAF7F2";
    g.beginPath();
    g.roundRect(24, 24, W - 48, H - 48, 24);
    g.fill();
    g.fillStyle = "#061320";
    g.fillRect(24, 24, W - 48, 62);
    g.fillStyle = "#D4AF37";
    g.font = "bold 22px monospace";
    g.fillText("AURA VOYAGES  ·  BOARDING PASS QUOTE", 52, 64);
    g.fillStyle = "#64748b";
    g.font = "14px monospace";
    g.fillText("ORIGIN", 52, 130);
    g.fillText("DESTINATION", 300, 130);
    g.fillStyle = "#061320";
    g.font = "bold 44px monospace";
    g.fillText("BDQ/AMD", 52, 178);
    g.fillStyle = "#FF5A36";
    g.fillText("→", 250, 178);
    g.font = "bold 28px serif";
    g.fillText(pkg.title.slice(0, 34), 300, 176);
    g.fillStyle = "#475569";
    g.font = "16px monospace";
    const rows = [
      `Date: ${fmtDate(date)}   ·   ${pkg.days}D/${pkg.nights}N   ·   Pax: ${cfg.pax}`,
      `Hotel: ${hotel.label} (${pkg.hotels[cfg.hotel]})`,
      `Group: ${group.label}`,
      `Add-ons: ${addons.length ? addons.join(", ") : "None"}`,
    ];
    rows.forEach((r, i) => g.fillText(r.slice(0, 80), 52, 225 + i * 28));
    g.fillStyle = "#FF5A36";
    g.font = "bold 40px monospace";
    g.fillText(fmtINR(q.total), 52, 365);
    g.fillStyle = "#64748b";
    g.font = "15px monospace";
    g.fillText(`${fmtINR(q.perPerson)} per person · Token ${fmtINR(TOKEN_AMOUNT)}`, 330, 362);
    g.fillStyle = "#061320";
    for (let x = 740; x < 950; x += 7) g.fillRect(x, 290, x % 3 === 0 ? 4 : 2, 70);
    const a = document.createElement("a");
    a.download = `aura-voyages-quote-${pkg.id}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
    saveLead();
  };

  const set = <K extends keyof Config>(k: K, v: Config[K]) => setCfg((c) => ({ ...c, [k]: v }));

  return (
    <motion.div className="fixed inset-0 z-[80]" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }}>
      <motion.div
        className="absolute inset-0 bg-[#121816]/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={`${pkg.title} itinerary studio`}
        className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-[#f4f1eb] shadow-2xl dark:bg-[#121816]"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 280 }}
      >
        {/* header */}
        <div className="relative h-44 shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pkg.images[0]} alt={pkg.title} className="kenburns h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121816] via-[#121816]/50 to-transparent" />
          <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-slate-900 shadow-lg hover:scale-105">
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#a68456]">Itinerary & Cost Studio</p>
            <h3 className="font-display text-2xl font-bold italic leading-tight sm:text-3xl">{pkg.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
              <MapPin className="h-3.5 w-3.5" /> {pkg.location} · {pkg.days}D/{pkg.nights}N · ★ {pkg.rating}
            </p>
          </div>
        </div>

        {/* body */}
        <div className="drawer-scroll flex-1 overflow-y-auto px-5 py-6">
          <h4 className="flex items-center gap-2 font-display text-xl font-bold text-slate-900 dark:text-white">
            <Plane className="h-5 w-5 rotate-45 text-[#8f4e30]" /> Day-by-Day Timeline
          </h4>
          <div className="relative mt-5 space-y-3 pl-6 before:absolute before:bottom-2 before:left-[9px] before:top-2 before:w-px before:bg-gradient-to-b before:from-[#1a1714] before:to-[#a68456]">
            {pkg.itinerary.map((d, i) => {
              const isOpen = open === i;
              return (
                <div key={d.day} className="relative">
                  <span className={`absolute -left-6 top-4 h-[19px] w-[19px] rounded-full border-4 border-[#f4f1eb] dark:border-[#101413] ${isOpen ? "bg-[#1a1714]" : "bg-[#a68456]"}`} />
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
                    <button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
                      <span>
                        <span className="font-mono text-[11px] font-bold tracking-widest text-[#8f4e30]">{d.day.toUpperCase()}</span>
                        <span className="block text-[15px] font-bold text-slate-900 dark:text-white">{d.title}</span>
                      </span>
                      <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} className="overflow-hidden" transition={{ duration: 0.3 }}>
                      <div className="grid gap-4 px-4 pb-4 sm:grid-cols-[1fr_150px]">
                        <div>
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{d.desc}</p>
                          <p className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <Utensils className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {mealsFor(i, pkg.itinerary.length)}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {d.tags.map((t) => (
                              <span key={t} className="rounded-full border border-[#1c6b73]/30 bg-[#1c6b73]/10 px-2.5 py-1 text-[11px] font-semibold text-[#1c6b73]">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="relative hidden h-32 overflow-hidden rounded-xl sm:block">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={i === 0 ? HOTEL_IMAGES[cfg.hotel] : pkg.images[i % pkg.images.length]} alt={i === 0 ? "Your hotel" : d.title} className="h-full w-full object-cover" loading="lazy" />
                          {i === 0 && (
                            <span className="absolute bottom-1 left-1 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                              <BedDouble className="h-3 w-3" /> {hotel.short} stay
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* configurator */}
          <div ref={cfgRef} className="mt-10 scroll-mt-4 border border-[#e4ded4] bg-white p-5 dark:border-white/10 dark:bg-[#171c1b]">
            <h4 className="flex items-center gap-2 font-display text-xl font-bold text-slate-900 dark:text-white">
              <Flame className="h-5 w-5 text-[#8f4e30]" /> Live Package Price Configurator
            </h4>

            {/* hotel */}
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">Hotel Category</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {HOTEL_TIERS.map((h) => (
                <button
                  key={h.id}
                  onClick={() => set("hotel", h.id as 0 | 1 | 2)}
                  className={`rounded-xl border p-3 text-center text-xs font-bold transition ${
                    cfg.hotel === h.id ? "border-[#1a1714] bg-[#1a1714] text-white shadow-lg shadow-black/10" : "border-slate-200 bg-white text-slate-700 hover:border-[#1a1714]/40 dark:border-white/15 dark:bg-white/5 dark:text-slate-200"
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={HOTEL_IMAGES[cfg.hotel]} alt={pkg.hotels[cfg.hotel]} className="h-16 w-24 rounded-xl object-cover" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{pkg.hotels[cfg.hotel]}</p>
                <p className="text-xs text-slate-500">{hotel.label} · breakfast + Jain dinner included</p>
              </div>
            </div>

            {/* group */}
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">Travel Group Type</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {GROUP_TYPES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setCfg((c) => ({ ...c, group: g.id, pax: g.pax }))}
                  className={`rounded-xl border p-3 text-center text-xs font-bold transition ${
                    cfg.group === g.id ? "border-[#1c6b73] bg-[#1c6b73] text-white shadow-lg shadow-black/10" : "border-slate-200 bg-white text-slate-700 hover:border-[#1c6b73]/40 dark:border-white/15 dark:bg-white/5 dark:text-slate-200"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <Users className="h-3.5 w-3.5" /> Travellers
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <button
                    disabled={cfg.group !== "group" || cfg.pax <= 2}
                    onClick={() => set("pax", cfg.pax - 1)}
                    className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 text-slate-700 disabled:opacity-30 dark:border-white/20 dark:text-white"
                    aria-label="Fewer travellers"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">{cfg.pax}</span>
                  <button
                    disabled={cfg.group !== "group" || cfg.pax >= 40}
                    onClick={() => set("pax", cfg.pax + 1)}
                    className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 text-slate-700 disabled:opacity-30 dark:border-white/20 dark:text-white"
                    aria-label="More travellers"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {cfg.group !== "group" && <p className="mt-1 text-[10px] text-slate-400">Fixed for this group type</p>}
              </div>
              <label className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" /> Travel Date
                </p>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => e.target.value && setDate(e.target.value)}
                  className="mt-2 w-full bg-transparent font-mono text-sm font-bold text-slate-900 outline-none dark:text-white dark:[color-scheme:dark]"
                />
              </label>
            </div>

            {/* add-ons */}
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">Add-ons</p>
            <div className="mt-2 space-y-2">
              {[
                { k: "flights" as const, label: "Include Return Flights", sub: `${fmtINR(pkg.flight)} / person · Ex-AMD/BDQ`, icon: <Plane className="h-4 w-4" /> },
                { k: "insurance" as const, label: "Travel Insurance & Visa", sub: `${fmtINR(pkg.visaIns)} / person`, icon: <ShieldCheck className="h-4 w-4" /> },
                { k: "candle" as const, label: "Candlelight Setup", sub: `${fmtINR(CANDLE_PRICE)} flat · Romantic dinner`, icon: <Flame className="h-4 w-4" /> },
              ].map((a) => (
                <button
                  key={a.k}
                  onClick={() => set(a.k, !cfg[a.k])}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                    cfg[a.k] ? "border-[#a68456] bg-[#a68456]/12" : "border-slate-200 bg-white dark:border-white/15 dark:bg-white/5"
                  }`}
                  aria-pressed={cfg[a.k]}
                >
                  <span className="flex items-center gap-3">
                    <span className={`grid h-9 w-9 place-items-center rounded-full ${cfg[a.k] ? "bg-[#a68456] text-[#121816]" : "bg-slate-100 text-slate-500 dark:bg-white/10"}`}>{a.icon}</span>
                    <span>
                      <span className="block text-sm font-bold text-slate-900 dark:text-white">{a.label}</span>
                      <span className="block font-mono text-[11px] text-slate-500">{a.sub}</span>
                    </span>
                  </span>
                  <span className={`relative h-6 w-11 rounded-full transition ${cfg[a.k] ? "bg-[#1a1714]" : "bg-slate-300 dark:bg-white/20"}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${cfg[a.k] ? "left-[22px]" : "left-0.5"}`} />
                  </span>
                </button>
              ))}
            </div>

            {/* breakdown */}
            <div className="mt-6 rounded-2xl bg-[#121816] p-5 text-white">
              <div className="space-y-1.5 font-mono text-xs text-slate-300">
                <Row l={`Land package · ${fmtINR(q.landPerPerson)} × ${cfg.pax}`} r={fmtINR(q.landTotal)} />
                {cfg.flights && <Row l="Return flights" r={fmtINR(q.flights)} />}
                {cfg.insurance && <Row l="Insurance & visa" r={fmtINR(q.insurance)} />}
                {cfg.candle && <Row l="Candlelight setup" r={fmtINR(q.candle)} />}
              </div>
              <div className="mt-4 flex items-end justify-between border-t border-white/15 pt-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#a68456]">Total (INR)</p>
                  <motion.p key={q.total} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-mono text-3xl font-bold text-white">
                    {fmtINR(q.total)}
                  </motion.p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#a68456]">Per person</p>
                  <p className="font-mono text-xl font-bold text-[#8f4e30]">{fmtINR(q.perPerson)}</p>
                  <p className="font-mono text-[10px] text-slate-400">EMI from {fmtINR(emiFrom(q.total))}/mo</p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 pb-4 text-center text-[11px] text-slate-500">Indicative pricing. Final quote confirmed on WhatsApp. Book with {fmtINR(TOKEN_AMOUNT)} token.</p>
        </div>

        {/* sticky action bar */}
        <div className="shrink-0 border-t border-slate-200 bg-white/90 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#121816]/95">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500">
              {hotel.short} · {group.label.split(" ")[0]} · {cfg.pax} pax
            </span>
            <span className="font-mono text-lg font-bold text-[#8f4e30]">{fmtINR(q.total)}</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-[1.4fr_1fr]">
            <button onClick={sendWhatsApp} className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/30 transition hover:brightness-105">
              <WhatsAppIcon /> {sent ? "Sent! Open WhatsApp Again" : "Send Quote to WhatsApp"}
            </button>
            <button onClick={downloadPass} className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3.5 text-sm font-bold text-slate-800 transition hover:border-[#1a1714] hover:text-[#8f4e30] dark:border-white/20 dark:text-white">
              <Download className="h-4 w-4" /> Boarding Pass PNG
            </button>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}

function Row({ l, r }: { l: string; r: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span>{l}</span>
      <span className="text-white">{r}</span>
    </div>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.200z" />
    </svg>
  );
}
