"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  italic,
  sub,
  light,
  center = false,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  sub?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="kicker">{eyebrow}</p>
      <h2 className={`display mt-4 text-4xl md:text-5xl ${light ? "text-white" : "text-[#1a1714] dark:text-[#f3eee6]"}`}>
        {title}
        {italic && <span className="italic"> {italic}</span>}
      </h2>
      {sub && <p className={`mt-4 text-[15px] leading-relaxed ${light ? "text-white/70" : "muted"}`}>{sub}</p>}
    </Reveal>
  );
}
