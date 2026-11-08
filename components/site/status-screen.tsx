"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Grain } from "./art";

const SCATTER = [
  { x: "12%", y: "20%", r: -30 },
  { x: "84%", y: "16%", r: 40 },
  { x: "8%", y: "72%", r: 70 },
  { x: "88%", y: "68%", r: -60 },
  { x: "50%", y: "88%", r: 15 },
];

/** Full-page message (error, 404) with drifting grains and the logo. */
export function StatusScreen({ code, title, text, children }: { code: string; title: string; text: string; children: ReactNode }) {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4 text-center">
      <div className="ornament absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      {SCATTER.map((s, i) => (
        <motion.div
          key={i}
          aria-hidden
          className="absolute"
          style={{ left: s.x, top: s.y }}
          animate={{ y: [0, -16, 0], rotate: [s.r, s.r + 20, s.r] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          <Grain className="w-7 opacity-70" />
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid max-w-md justify-items-center gap-4"
      >
        <Image src="/logo.webp" alt="Banke Bihari Atta Chakki" width={240} height={160} className="h-28 w-auto" />
        <p className="font-display text-8xl leading-none text-gold/70">{code}</p>
        <h1 className="font-display text-4xl text-maroon">{title}</h1>
        <p className="text-muted-foreground">{text}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div>
      </motion.div>
    </main>
  );
}

export const primaryBtn =
  "inline-flex min-h-12 items-center gap-2 rounded-full bg-maroon px-7 font-semibold text-cream shadow-lg shadow-maroon/25 transition hover:-translate-y-0.5";
export const secondaryBtn =
  "inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-maroon px-7 font-semibold text-maroon transition hover:bg-maroon hover:text-cream";
