"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircle, PhoneCall, Send, Sparkles, X } from "lucide-react";
import { PACKAGES, fmtINR, getPkg, waLink } from "@/lib/data";

type Action = { label: string; type: "pkg" | "visa" | "wa" };
type Msg = { id: number; from: "bot" | "user"; text: string; actions?: Action[]; form?: boolean };

const PROMPTS = [
  "Build a 5-day Kashmir itinerary under ₹25,000",
  "Which international trips have Visa-on-Arrival?",
  "Do you provide Gujarati & Jain food on Europe tours?",
  "Request Callback from Senior Travel Expert",
];

function reply(input: string): { text: string; actions?: Action[]; form?: boolean; pkg?: string } {
  const t = input.toLowerCase();
  if (t.includes("callback") || t.includes("call back") || t.includes("senior travel expert")) {
    return { text: "Absolutely! Share your name and mobile number and a Senior Travel Expert from our Alkapuri office will call you within 15 minutes (9 AM – 10 PM).", form: true };
  }
  if (t.includes("kashmir")) {
    const p = getPkg("kashmir");
    return {
      text: `Here's a 5-day Kashmir plan within ₹25,000 (3★, per person, land package ${fmtINR(p.price)}):\n\n• Day 1 — Srinagar arrival, Dal Lake shikara sunset\n• Day 2 — Mughal Gardens & Old Srinagar\n• Day 3 — Gulmarg Gondola Phase 2 & snow play\n• Day 4 — Pahalgam, Betaab & Aru Valley\n• Day 5 — Pashmina shopping & departure\n\nJain / pure-veg meals included daily. Flights are an optional add-on (~${fmtINR(p.flight)}).`,
      actions: [{ label: "Open Kashmir Cost Studio", type: "pkg" }],
      pkg: "kashmir",
    };
  }
  if (t.includes("visa-on-arrival") || t.includes("visa on arrival") || t.includes("voa") || t.includes("visa-free") || t.includes("visa free")) {
    return {
      text: "Indian passport holders enjoy easy entry to:\n\n• 🇮🇩 Bali — Visa on Arrival (₹3,000, e-VOA available)\n• 🇲🇻 Maldives — Free 30-day visa on arrival\n• 🇹🇭 Thailand — Visa-exemption / e-visa (we confirm current rules)\n• 🇦🇪 Dubai & 🇻🇳 Vietnam — E-Visa in 2–5 days\n\nWe handle the paperwork for all of them.",
      actions: [{ label: "Open Visa Hub", type: "visa" }, { label: "Bali Trip", type: "pkg" }],
      pkg: "bali",
    };
  }
  if (t.includes("jain") || t.includes("gujarati") || t.includes("veg") || t.includes("food")) {
    return {
      text: "Yes! 🌿 Every Aura tour supports Pure Veg & Jain meals. On Europe group departures we travel with a dedicated Gujarati chef (thepla, khichdi, dal-bhat, Jain dinners) and pre-book Indian restaurants in Zurich, Lucerne & Paris. Private trips get Jain-friendly restaurant lists and hotel kitchen requests.",
      actions: [{ label: "See Swiss & Paris Tour", type: "pkg" }],
      pkg: "swiss",
    };
  }
  const hit = PACKAGES.find((p) => t.includes(p.id) || t.includes(p.location.split(" ")[0].toLowerCase()) || (p.id === "swiss" && (t.includes("europe") || t.includes("paris"))) || (p.id === "spiti" && t.includes("himachal")));
  if (hit) {
    return {
      text: `${hit.title}: ${hit.days}D/${hit.nights}N from ${fmtINR(hit.price)} per person ⭐ ${hit.rating}. Highlights — ${hit.highlights.join(", ")}.`,
      actions: [{ label: `Customize ${hit.location.split(" ·")[0]}`, type: "pkg" }],
      pkg: hit.id,
    };
  }
  if (t.includes("honeymoon") || t.includes("romantic")) {
    return { text: "For honeymoons our top picks are Bali Private Pool Villa (₹49,999), Maldives Overwater Villa (₹78,000) and Kashmir Houseboat (₹24,999). Add a Candlelight Setup in the configurator!", actions: [{ label: "Customize Bali", type: "pkg" }], pkg: "bali" };
  }
  if (t.includes("budget") || t.includes("price") || t.includes("cheap") || t.includes("cost")) {
    return { text: "Starting prices (per person, land package): Spiti ₹14,999 · Kashmir ₹24,999 · Vietnam ₹46,500 · Bali ₹49,999 · Dubai ₹54,999 · Swiss & Paris ₹1,45,000. Book with just a ₹2,999 token and pay the rest in easy EMIs.", actions: [{ label: "Chat with Expert", type: "wa" }] };
  }
  return { text: "I can plan itineraries, compare budgets, check visas and Jain-food support. Try one of the quick prompts below, or tap WhatsApp to chat with a human expert.", actions: [{ label: "Chat on WhatsApp", type: "wa" }] };
}

export default function ChatBot({ onOpenPkg, onVisa }: { onOpenPkg: (id: string) => void; onVisa: () => void }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, from: "bot", text: "Good day. I'm Aura, the desk assistant. Ask about a route, a visa, or a Jain kitchen — or leave a number and a planner will call." },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [lastPkg, setLastPkg] = useState("kashmir");
  const [form, setForm] = useState({ name: "", phone: "" });
  const [formState, setFormState] = useState<"idle" | "sending" | "done">("idle");
  const end = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing, open, formState]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMsgs((m) => [...m, { id: idRef.current++, from: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const r = reply(q);
      if (r.pkg) setLastPkg(r.pkg);
      setMsgs((m) => [...m, { id: idRef.current++, from: "bot", text: r.text, actions: r.actions, form: r.form }]);
      setTyping(false);
    }, 750);
  };

  const runAction = (a: Action) => {
    if (a.type === "pkg") onOpenPkg(lastPkg);
    if (a.type === "visa") onVisa();
    if (a.type === "wa") window.open(waLink("Hi Aura Voyages! I'd like help planning a trip from Vadodara."), "_blank", "noopener,noreferrer");
    if (a.type !== "wa") setOpen(false);
  };

  const submitCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2 || form.phone.replace(/\D/g, "").length < 10) return;
    setFormState("sending");
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "callback", name: form.name, phone: form.phone, message: "Callback requested via Aura AI" }),
      });
    } catch {
      /* still confirm; WhatsApp fallback below */
    }
    setFormState("done");
    setMsgs((m) => [...m, { id: idRef.current++, from: "bot", text: `Thank you ${form.name.split(" ")[0]}! ✅ Your callback request is confirmed. A Senior Travel Expert will call ${form.phone} shortly.` }]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[70] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className="mb-3 flex h-[min(600px,calc(100vh-110px))] w-[calc(100vw-2rem)] flex-col overflow-hidden border border-[#e4ded4] bg-white shadow-[0_24px_60px_rgba(18,24,22,0.18)] dark:border-white/10 dark:bg-[#171c1b] sm:w-[390px]"
          >
            <div className="flex items-center gap-3 bg-[#121816] px-5 py-4 text-white">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1a1714]">
                <Bot className="h-5 w-5" />
              </span>
              <div className="flex-1 leading-tight">
                <p className="font-display text-lg font-medium">Aura, at the desk</p>
                <p className="font-mono text-[10px] tracking-[0.16em] text-[#e6c98a]">REPLIES AT ONCE</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1.5 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-[#f4f1eb] p-4 dark:bg-[#121816]/40">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[88%]">
                    <div
                      className={`whitespace-pre-line rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                        m.from === "user" ? "rounded-br-md bg-[#1a1714] text-white" : "rounded-bl-md bg-white text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.actions && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.actions.map((a) => (
                          <button key={a.label} onClick={() => runAction(a)} className="rounded-full border border-[#1c6b73]/40 bg-[#1c6b73]/10 px-3 py-1.5 text-[11px] font-bold text-[#1c6b73] hover:bg-[#1c6b73] hover:text-white">
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {m.form && formState !== "done" && (
                      <form onSubmit={submitCallback} className="mt-2 space-y-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-800">
                        <input
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-[#1a1714] dark:border-white/15 dark:text-white"
                        />
                        <input
                          required
                          inputMode="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="Mobile number (+91…)"
                          className="w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[#1a1714] dark:border-white/15 dark:text-white"
                        />
                        <button disabled={formState === "sending"} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a1714] py-2.5 text-xs font-bold text-white disabled:opacity-60">
                          <PhoneCall className="h-4 w-4" /> {formState === "sending" ? "Requesting…" : "Request Callback"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex">
                  <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm dark:bg-slate-800">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={end} />
            </div>

            <div className="border-t border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
              <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-2">
                {PROMPTS.map((p) => (
                  <button key={p} onClick={() => ask(p)} className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:border-[#1a1714] hover:text-[#8f4e30] dark:border-white/15 dark:bg-white/5 dark:text-slate-200">
                    {p}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about trips, visas, Jain food…"
                  className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-[#1a1714] dark:border-white/15 dark:bg-white/5 dark:text-white"
                />
                <button aria-label="Send" className="grid h-10 w-10 place-items-center rounded-full bg-[#1a1714] text-white">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Open Aura AI Trip Architect"
          className="flex items-center gap-2 bg-[#1a1714] px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(0,0,0,0.2)]"
        >
          {open ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          <span className="hidden sm:inline">{open ? "Close" : "Aura AI Planner"}</span>
          {!open && <MessageCircle className="h-4 w-4 sm:hidden" />}
        </button>
      </div>
    </div>
  );
}
