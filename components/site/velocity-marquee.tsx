"use client";

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from "motion/react";
import { useRef } from "react";

function Row({ items, speed, className }: { items: string[]; speed: number; className: string }) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const skew = useTransform(velocity, [-2000, 2000], [8, -8]);
  const dir = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    const b = boost.get();
    if (b !== 0) dir.current = b < 0 ? -1 : 1;
    base.set(base.get() + dir.current * speed * (delta / 1000) * (1 + Math.abs(b)));
  });

  return (
    <div className="overflow-hidden">
      <motion.div style={{ x, skewX: skew }} className={`flex w-max items-center whitespace-nowrap ${className}`}>
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex items-center">
            {items.map((t, i) => (
              <span key={i} className="flex items-center gap-8 px-4">
                {t}
                <svg viewBox="0 0 20 20" className="size-5 shrink-0 fill-gold" aria-hidden>
                  <path d="M10 0 L12.5 7.5 L20 10 L12.5 12.5 L10 20 L7.5 12.5 L0 10 L7.5 7.5Z" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function VelocityMarquee() {
  return (
    // wider than the screen and pulled over both neighbours, so the tilted edges never show a gap
    <section aria-label="Our promise" className="relative z-10 -my-16 -ml-[5%] w-[110%] -rotate-2 space-y-2 border-y-4 border-gold bg-maroon py-5 shadow-2xl">
      <Row speed={-2} className="font-display text-4xl text-cream sm:text-6xl" items={["शुद्ध", "ताज़ा", "चक्की पिसा", "देसी स्वाद", "घर का भरोसा"]} />
      <Row speed={1.5} className="text-lg font-semibold tracking-[0.3em] text-gold-soft uppercase sm:text-xl" items={["Pure", "Fresh daily", "Stone ground", "No preservatives", "Hand sorted", "Since generations"]} />
    </section>
  );
}
