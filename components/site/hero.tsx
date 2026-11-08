"use client";

import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowDown, MessageCircle, Sparkles } from "lucide-react";
import { useRef } from "react";
import { waLink } from "@/lib/wa";
import { Grain, WheatStalk } from "./art";

const EASE = [0.22, 1, 0.36, 1] as const;

// deterministic so server and client render the same positions
const RAIN = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37 + 7) % 100,
  delay: (i * 0.83) % 7,
  duration: 9 + ((i * 13) % 8),
  size: 10 + ((i * 7) % 12),
  rotate: (i * 47) % 360,
  color: ["#d9a441", "#e2b25a", "#c9962b", "#f0a830"][i % 4],
}));

const FLOAT = [
  { x: "8%", y: "18%", d: 30, r: -20 },
  { x: "82%", y: "12%", d: 50, r: 30 },
  { x: "88%", y: "70%", d: 24, r: 60 },
  { x: "4%", y: "76%", d: 40, r: -45 },
  { x: "50%", y: "4%", d: 18, r: 10 },
];

function FloatingGrain({ mx, my, f, i }: { mx: MotionValue<number>; my: MotionValue<number>; f: (typeof FLOAT)[number]; i: number }) {
  const x = useTransform(mx, (v) => v * f.d);
  const y = useTransform(my, (v) => v * f.d);
  return (
    <motion.div style={{ left: f.x, top: f.y, x, y }} className="absolute">
      <motion.div
        animate={{ y: [0, -14, 0], rotate: [f.r, f.r + 15, f.r] }}
        transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
      >
        <Grain className="w-6 drop-shadow-md sm:w-8" />
      </motion.div>
    </motion.div>
  );
}

export function Hero({ whatsapp, since }: { whatsapp: string; since: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const rotX = useTransform(my, (v) => v * -8);
  const rotY = useTransform(mx, (v) => v * 8);

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative isolate flex min-h-dvh items-center overflow-hidden pt-28 pb-32"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,#f6deb0_0%,transparent_55%),radial-gradient(ellipse_at_10%_90%,#e8f0dc_0%,transparent_45%)]" />
      <div className="ornament absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {RAIN.map((g, i) => (
          <motion.div
            key={i}
            className="absolute -top-10"
            style={{ left: `${g.left}%` }}
            initial={{ y: "-10vh", rotate: g.rotate, opacity: 0 }}
            animate={{ y: "110vh", rotate: g.rotate + 360, opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration: g.duration, delay: g.delay, repeat: Infinity, ease: "linear" }}
          >
            <Grain color={g.color} style={{ width: g.size }} />
          </motion.div>
        ))}
      </div>

      <motion.div
        aria-hidden
        className="absolute bottom-20 left-2 hidden w-14 origin-bottom sm:block"
        animate={{ rotate: [-4, 5, -4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <WheatStalk />
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute right-3 bottom-20 hidden w-16 origin-bottom sm:block"
        animate={{ rotate: [5, -4, 5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <WheatStalk />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: fade }} className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[1.1fr_1fr]">
        <div className="text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ duration: 1.2, ease: EASE }}
            className="font-display text-lg text-gold"
          >
            ॥ श्री राधे ॥
          </motion.p>
          <h1 className="mt-2 font-display text-[clamp(3.4rem,11vw,7.5rem)] leading-[1.05] text-maroon drop-shadow-[0_3px_0_rgba(201,150,43,0.35)]">
            {["बांके", "बिहारी"].map((w, i) => (
              <span key={w} className="inline-block overflow-hidden pb-3 align-bottom">
                <motion.span
                  className="inline-block pr-[0.25em]"
                  initial={{ y: "110%", rotate: 6, filter: "blur(8px)" }}
                  animate={{ y: 0, rotate: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1, delay: 0.25 + i * 0.15, ease: EASE }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <div className="mt-1 flex items-center justify-center gap-4 md:justify-start">
            <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.8 }} className="h-0.5 w-10 origin-right bg-maroon/60" />
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              className="font-display text-3xl text-ink sm:text-4xl"
            >
              आटा चक्की
            </motion.span>
            <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.8 }} className="h-0.5 w-10 origin-left bg-maroon/60" />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease: EASE }}
            className="mx-auto mt-6 max-w-md text-lg text-muted-foreground md:mx-0"
          >
            Stone-ground atta, hand-sorted dals and fresh masale, milled in our own chakki and packed the same day.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
            className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start"
          >
            <a
              href="#products"
              className="group relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-full bg-maroon px-7 font-semibold text-cream shadow-xl shadow-maroon/25 transition hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Sparkles className="size-4" /> उत्पाद देखें
            </a>
            <a
              href={waLink(whatsapp, "Namaste! I'd like to know about your products.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-leaf px-7 font-semibold text-leaf transition hover:bg-leaf hover:text-cream"
            >
              <MessageCircle className="size-4" /> Ask on WhatsApp
            </a>
          </motion.div>
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 1.3 } } }}
            className="mt-8 flex flex-wrap justify-center gap-2 text-sm md:justify-start"
          >
            {["पत्थर की चक्की", "No preservatives", `Since ${since}`].map((t) => (
              <motion.li
                key={t}
                variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                className="rounded-full border border-gold/50 bg-cream/70 px-3 py-1 text-ink/80"
              >
                ✦ {t}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[30rem] [perspective:1000px]">
          {FLOAT.map((f, i) => (
            <FloatingGrain key={i} mx={mx} my={my} f={f} i={i} />
          ))}
          <motion.svg
            viewBox="0 0 400 400"
            aria-hidden
            initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.6, ease: EASE }}
            className="absolute inset-0"
          >
            <g className="animate-spin-slow origin-center [transform-box:fill-box]">
              <circle cx="200" cy="200" r="190" fill="none" stroke="#c9962b" strokeWidth="1.5" strokeDasharray="2 10" />
              {Array.from({ length: 24 }, (_, i) => (
                <path key={i} d="M200 22 q8 14 0 28 q-8 -14 0 -28" fill="#c9962b" opacity=".55" transform={`rotate(${i * 15} 200 200)`} />
              ))}
            </g>
            <g className="animate-spin-slower origin-center [transform-box:fill-box]">
              <circle cx="200" cy="200" r="150" fill="none" stroke="#1d4d2b" strokeOpacity=".35" strokeWidth="1" strokeDasharray="14 8" />
            </g>
            <circle cx="200" cy="200" r="135" fill="#fffaf0" stroke="#c9962b" strokeOpacity=".5" />
          </motion.svg>
          <motion.div
            style={{ rotateX: rotX, rotateY: rotY }}
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
            className="absolute inset-[6%] flex items-center justify-center"
          >
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
              <Image src="/logo.webp" alt="Banke Bihari Atta Chakki logo" width={1219} height={809} priority className="w-full drop-shadow-[0_24px_30px_rgba(74,13,16,0.25)]" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#products"
        aria-label="Scroll to products"
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs tracking-[0.3em] text-muted-foreground uppercase md:flex"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scroll <ArrowDown className="size-4" />
      </motion.a>
    </section>
  );
}
