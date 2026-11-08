"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef } from "react";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("en-IN") + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export function Stats({ years, families, productCount }: { years: number; families: string; productCount: number }) {
  const items = [
    { n: years, s: "+", hi: "साल का भरोसा", en: "Years of trust" },
    { n: Number(families) || 0, s: "+", hi: "परिवार", en: "Happy families" },
    { n: productCount, s: "", hi: "उत्पाद", en: "Products" },
    { n: 100, s: "%", hi: "शुद्धता", en: "Pure, no mixing" },
  ];
  return (
    <section aria-label="Numbers" className="relative overflow-hidden bg-leaf py-16 text-cream">
      <div className="ornament absolute inset-0 opacity-20" />
      <ul className="relative mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4">
        {items.map((it, i) => (
          <motion.li
            key={it.en}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="text-center"
          >
            <p className="font-display text-5xl text-gold-soft sm:text-6xl">
              <CountUp to={it.n} suffix={it.s} />
            </p>
            <p className="mt-1 font-display text-xl">{it.hi}</p>
            <p className="text-xs tracking-[0.2em] text-cream/70 uppercase">{it.en}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
