"use client";

import { motion } from "motion/react";
import { Chakki } from "./art";

const DUST = [0, 1, 2, 3, 4, 5, 6, 7];

/** Spinning chakki with flour falling out: the brand's loading indicator. */
export function ChakkiLoader({ label = "ताज़ा पीस रहे हैं…", size = "md" }: { label?: string; size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-16" : "size-28";
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-5">
      <div className={`relative ${box}`}>
        <motion.div className="size-full" animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}>
          <Chakki className="size-full drop-shadow-xl" />
        </motion.div>
        {DUST.map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute top-full size-1.5 rounded-full bg-gold-soft"
            style={{ left: `${20 + i * 8}%` }}
            animate={{ y: [0, 28], opacity: [0, 1, 0], x: [0, (i - 3.5) * 5] }}
            transition={{ duration: 1.4, delay: i * 0.17, repeat: Infinity, ease: "easeIn" }}
          />
        ))}
      </div>
      <p className="mt-4 font-display text-xl text-maroon">{label}</p>
    </div>
  );
}
