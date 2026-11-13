"use client";

import { STORIES } from "@/lib/data";
import { Reveal, SectionHeading } from "./Reveal";

const REVIEWS = [
  { n: "Kinjal Mehta", t: "Alkapuri", r: "They arranged Jain food for my in-laws in Dubai — every meal, without our having to ask twice." },
  { n: "Rahul Desai", t: "Sayajigunj", r: "The figure on the configurator was the figure we paid. No surprise line on the Bali invoice." },
  { n: "Aarti & Jay Shah", t: "Waghodia Road", r: "Schengen file in eleven days, and a Switzerland trip that matched the preview." },
];

export default function Stories() {
  return (
    <section id="stories" className="scroll-mt-24 surface py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="From the road" title="Guests, not" italic="stock smiles" sub="Families and couples who left from Vadodara. The photographs are of the places; the words are theirs." />
          <p className="font-mono text-sm text-[#1a1714] dark:text-[#f3eee6]">
            Google · <span className="text-[#8f4e30]">4.9 / 5</span>
            <span className="mt-1 block text-[11px] tracking-normal text-[#8a8175]">1,800+ travellers</span>
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {STORIES.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <figure>
                <div className="aspect-[3/4] overflow-hidden bg-[#e4ded4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt={`${s.name} in ${s.place}`} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <figcaption className="mt-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#a68456]">{s.place}</p>
                  <p className="mt-1 font-display text-xl italic">{s.name}</p>
                  <p className="text-[11px] text-[#8a8175]">{s.from}</p>
                  <p className="muted mt-2 text-sm leading-relaxed">“{s.quote}”</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 grid gap-8 border-t border-[#e4ded4] pt-10 md:grid-cols-3 dark:border-white/10">
          {REVIEWS.map((r) => (
            <figure key={r.n}>
              <blockquote className="font-display text-xl italic leading-snug text-[#1a1714] dark:text-[#f3eee6]">“{r.r}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-medium">{r.n}</span>
                <span className="text-[#8a8175]"> · {r.t}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
