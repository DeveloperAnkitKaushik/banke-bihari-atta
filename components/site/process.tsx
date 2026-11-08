"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Chakki } from "./art";

const STEPS = [
  ["चुनिंदा अनाज", "Handpicked grain", "We buy wheat, chana and millets straight from mandis we have trusted for years, one lot at a time."],
  ["सफ़ाई", "Cleaned thrice", "Stones, husk and dust come out in three rounds of sieving and hand-sorting before anything is milled."],
  ["पत्थर की चक्की", "Slow stone grinding", "Our stone chakki turns slow and cool, so the atta keeps its natural oils, fibre and smell."],
  ["ताज़ा पैकिंग", "Packed the same day", "Every batch is packed fresh. You get flour that was grain only a day or two ago."],
] as const;

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 900]);
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" ref={ref} className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-sm font-semibold tracking-[0.3em] text-gold uppercase">From farm to kitchen</p>
          <h2 className="mt-2 font-display text-5xl text-maroon sm:text-6xl">खेत से रसोई तक</h2>
          <p className="mt-4 max-w-sm text-muted-foreground">Scroll and watch the chakki turn. This is how every pack is made.</p>
          <div className="relative mx-auto mt-10 aspect-square w-64 sm:w-80 md:mx-0">
            <div className="absolute inset-[-8%] rounded-full bg-[radial-gradient(circle,#f8ecd0_40%,#efdcae_70%,transparent_72%)]" />
            <motion.div style={{ rotate }} className="absolute inset-0">
              <Chakki className="size-full drop-shadow-2xl" />
            </motion.div>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute size-1.5 rounded-full bg-cream shadow"
                style={{ left: `${15 + i * 14}%`, bottom: "-4%" }}
                animate={{ y: [0, 30], opacity: [0, 1, 0], x: [0, (i - 2.5) * 8] }}
                transition={{ duration: 1.8, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
          </div>
        </div>

        <ol className="relative space-y-6 pl-10">
          <span className="absolute top-2 bottom-2 left-3 w-0.5 bg-border" />
          <motion.span style={{ scaleY: line }} className="absolute top-2 bottom-2 left-3 w-0.5 origin-top bg-gradient-to-b from-gold via-maroon to-leaf" />
          {STEPS.map(([hi, en, text], i) => (
            <motion.li
              key={hi}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-gold/10 sm:p-8"
            >
              <span className="absolute top-7 -left-10 grid size-7 place-items-center rounded-full border-2 border-gold bg-cream font-display text-sm text-maroon transition-colors group-hover:bg-maroon group-hover:text-cream">
                {i + 1}
              </span>
              <p className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">{en}</p>
              <h3 className="mt-1 font-display text-3xl text-maroon">{hi}</h3>
              <p className="mt-2 text-muted-foreground">{text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
