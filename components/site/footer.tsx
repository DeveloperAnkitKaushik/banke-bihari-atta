"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUp, Clock, MapPin, Phone } from "lucide-react";
import { useRef } from "react";
import { CATEGORIES, type Settings } from "@/lib/types";
import { telLink, waLink } from "@/lib/wa";
import { Chakki, Mandala, WhatsAppIcon } from "./art";

// deterministic wheat field along the footer's top edge
const STALKS = Array.from({ length: 48 }, (_, i) => ({ x: i * 2.1 + ((i * 7) % 2), h: 52 + ((i * 13) % 38), d: 3 + ((i * 5) % 4), delay: (i % 7) * 0.3 }));

function WheatField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-24 h-24 overflow-hidden">
      {STALKS.map((s, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 12 60"
          className="absolute -bottom-1 w-5 origin-bottom text-gold"
          style={{ left: `${s.x}%`, height: s.h }}
          animate={{ rotate: [-5, 6, -5] }}
          transition={{ duration: s.d, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 60 V18" stroke="currentColor" strokeWidth="1.2" />
          {[0, 1, 2, 3].map((k) => (
            <g key={k}>
              <ellipse cx="3.6" cy={8 + k * 4.5} rx="2" ry="3.4" transform={`rotate(-25 3.6 ${8 + k * 4.5})`} fill="currentColor" />
              <ellipse cx="8.4" cy={8 + k * 4.5} rx="2" ry="3.4" transform={`rotate(25 8.4 ${8 + k * 4.5})`} fill="currentColor" opacity=".8" />
            </g>
          ))}
          <ellipse cx="6" cy="5" rx="1.8" ry="3.2" fill="currentColor" />
        </motion.svg>
      ))}
    </div>
  );
}

const LINKS = [
  ["#products", "उत्पाद", "Products"],
  ["#process", "प्रक्रिया", "How it's made"],
  ["#visit", "संपर्क", "Visit us"],
] as const;

export function Footer({ settings, year }: { settings: Settings; year: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const nameY = useTransform(scrollYProgress, [0.3, 1], ["60%", "0%"]);
  const nameOpacity = useTransform(scrollYProgress, [0.3, 0.9], [0, 1]);
  const spin = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <footer ref={ref} className="relative mt-24 bg-maroon-deep text-cream">
      <WheatField />
      {/* scalloped temple edge, echoing the logo frame */}
      <svg aria-hidden viewBox="0 0 1200 24" preserveAspectRatio="none" className="absolute inset-x-0 -top-[23px] h-6 w-full text-maroon-deep">
        <path fill="currentColor" d={`M0 24 ${Array.from({ length: 24 }, (_, i) => `Q${i * 50 + 25} 0 ${(i + 1) * 50} 24`).join(" ")} Z`} />
      </svg>
      <div className="ornament absolute inset-0 opacity-15" />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Mandala className="absolute -bottom-40 -left-40 size-[30rem] text-gold/[0.09]" />
        <Mandala className="absolute -top-16 -right-24 size-72 text-gold/[0.07]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pt-20 pb-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1.2fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="relative inline-block">
            <Mandala className="absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 text-gold/25" />
            <div className="relative rounded-3xl bg-cream p-3 shadow-xl shadow-black/30 ring-2 ring-gold/60">
              <Image src="/logo.webp" alt="Banke Bihari Atta Chakki" width={180} height={120} className="h-24 w-auto" />
            </div>
          </div>
          <p className="mt-5 font-display text-2xl text-gold-soft">घर की रसोई का पूरा भरोसा</p>
          <p className="mt-2 max-w-xs text-sm text-cream/70">Fresh chakki atta, dals and masale from our shop in Khanpur, New Delhi. Ground slow, packed fresh, priced fair.</p>
          <a
            href={waLink(settings.whatsapp, "Namaste! I'd like to place an order.")}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-whatsapp px-6 font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="size-5" /> Order on WhatsApp
          </a>
        </motion.div>

        <motion.nav aria-label="Footer" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="grid grid-cols-2 gap-6 md:grid-cols-1">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Explore</p>
            <ul className="mt-3 space-y-1">
              {LINKS.map(([href, hi, en]) => (
                <li key={href}>
                  <a href={href} className="group inline-flex min-h-10 items-center gap-2 text-cream/85 transition hover:text-gold-soft">
                    <span className="h-px w-3 bg-gold transition-all duration-300 group-hover:w-6" />
                    <span className="font-display text-lg">{hi}</span>
                    <span className="text-xs text-cream/50">{en}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Range</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <a href="#products" className="inline-flex min-h-9 items-center rounded-full border border-cream/20 px-3 text-sm text-cream/80 transition hover:border-gold hover:bg-gold hover:text-maroon-deep">
                    {c.hi}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.nav>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
          <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Visit the chakki</p>
          <ul className="mt-3 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.mapQuery || settings.address)}`} target="_blank" rel="noreferrer" className="text-cream/85 underline-offset-4 hover:underline">
                {settings.address}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
              <span className="text-cream/85">{settings.hours}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-gold" />
              <a href={telLink(settings.phone)} className="font-semibold text-cream underline-offset-4 hover:underline">
                {settings.phone}
              </a>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* giant outlined name rising into view */}
      <div aria-hidden className="relative overflow-hidden">
        <motion.p
          style={{ y: nameY, opacity: nameOpacity }}
          className="text-center font-display text-[clamp(4.5rem,19vw,16rem)] leading-[1.15] whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_rgba(233,201,119,0.45)] select-none"
        >
          बांके बिहारी
        </motion.p>
      </div>

      <div className="relative border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-cream/60 sm:px-6">
          <p>
            © {year} Banke Bihari Atta Chakki ·{" "}
            <Link href="/admin" className="underline-offset-4 hover:text-cream hover:underline">
              Admin
            </Link>
          </p>
          <a href="#top" className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-cream/20 py-1 pr-4 pl-1 text-cream/80 transition hover:border-gold hover:text-cream">
            <motion.span style={{ rotate: spin }} className="size-9">
              <Chakki className="size-full" />
            </motion.span>
            Back to top
            <ArrowUp className="size-4 transition-transform group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </footer>
  );
}
