"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { Clock, MapPin, Phone } from "lucide-react";
import { useRef } from "react";
import { CATEGORIES, type Settings } from "@/lib/types";
import { telLink, waLink } from "@/lib/wa";
import { Grain, Mandala, WhatsAppIcon } from "./art";

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

function ColumnTitle({ children }: { children: string }) {
  return (
    <p className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.3em] text-gold uppercase">
      <span className="h-px w-5 bg-gold" />
      {children}
    </p>
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

      <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 pt-20 pb-6 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr_1.4fr] lg:gap-10">
        <motion.div className="col-span-2 lg:col-span-1" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="relative inline-block">
            <Mandala className="absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 text-gold/25" />
            <div className="relative rounded-3xl bg-cream p-3 shadow-xl shadow-black/30 ring-2 ring-gold/60">
              <Image src="/logo.webp" alt="Banke Bihari Atta Chakki" width={180} height={120} className="h-20 w-auto" />
            </div>
          </div>
          <p className="mt-6 font-display text-2xl text-gold-soft">घर की रसोई का पूरा भरोसा</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-cream/70">Fresh chakki atta, dals and masale from our shop in Khanpur, New Delhi. Ground slow, packed fresh.</p>
          <a
            href={waLink(settings.whatsapp, "Namaste! I'd like to place an order.")}
            target="_blank"
            rel="noreferrer"
            className="group mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-gradient-to-r from-gold to-gold-soft py-1.5 pr-6 pl-1.5 font-semibold text-maroon-deep shadow-lg shadow-black/25 transition hover:-translate-y-0.5 hover:shadow-gold/30"
          >
            <span className="grid size-9 place-items-center rounded-full bg-whatsapp text-white transition-transform group-hover:rotate-12">
              <WhatsAppIcon className="size-5" />
            </span>
            Order on WhatsApp
          </a>
        </motion.div>

        <motion.nav aria-label="Footer" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
          <ColumnTitle>Explore</ColumnTitle>
          <ul className="space-y-1">
            {LINKS.map(([href, hi, en]) => (
              <li key={href}>
                <a href={href} className="group flex min-h-11 flex-col justify-center leading-tight">
                  <span className="font-display text-lg text-cream transition group-hover:translate-x-1 group-hover:text-gold-soft">{hi}</span>
                  <span className="text-xs text-cream/50">{en}</span>
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
          <ColumnTitle>Range</ColumnTitle>
          <ul className="space-y-1">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <a href="#products" className="group flex min-h-9 items-center gap-2.5 text-sm text-cream/80 transition hover:text-gold-soft">
                  <Grain color={c.grain} className="w-2.5 transition-transform group-hover:rotate-45" />
                  <span className="font-display text-base">{c.hi}</span>
                  <span className="text-xs text-cream/45">{c.en}</span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div className="col-span-2 lg:col-span-1" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
          <ColumnTitle>Visit the chakki</ColumnTitle>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.mapQuery || settings.address)}`}
                target="_blank"
                rel="noreferrer"
                className="flex gap-3 rounded-2xl p-2 -m-2 text-cream/85 transition hover:bg-cream/5"
              >
                <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
                <span className="leading-relaxed">{settings.address}</span>
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
              <span className="text-cream/85">{settings.hours}</span>
            </li>
            <li>
              <a href={telLink(settings.phone)} className="flex gap-3 rounded-2xl p-2 -m-2 font-semibold text-cream transition hover:bg-cream/5">
                <Phone className="mt-0.5 size-5 shrink-0 text-gold" />
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
          className="text-center font-display text-[clamp(4rem,16vw,13rem)] leading-[1.25] whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_rgba(233,201,119,0.45)] select-none"
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
          <p>Khanpur, New Delhi</p>
        </div>
      </div>
    </footer>
  );
}
