"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./art";
import { waLink } from "@/lib/wa";

const LINKS = [
  ["#products", "उत्पाद", "Products"],
  ["#process", "प्रक्रिया", "Process"],
  ["#visit", "संपर्क", "Visit"],
] as const;

export function Navbar({ whatsapp }: { whatsapp: string }) {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
    // scroll-spy: the last section whose top has passed the upper third of the screen
    const current = LINKS.map(([href]) => href).filter((h) => (document.querySelector(h)?.getBoundingClientRect().top ?? Infinity) < innerHeight / 3).pop() ?? "";
    setActive(current);
  });

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
    >
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-3 py-1.5 transition-all duration-500 sm:px-5",
          scrolled ? "border border-border/80 bg-cream/80 shadow-lg shadow-maroon/5 backdrop-blur-xl" : "border border-transparent",
        )}
      >
        <a href="#top" aria-label="Banke Bihari Atta Chakki home" className="shrink-0">
          <Image src="/logo.webp" alt="" width={90} height={60} priority className="h-12 w-auto sm:h-14" />
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map(([href, hi, en]) => (
            <li key={href}>
              <a href={href} aria-current={active === href ? "true" : undefined} className="group relative flex flex-col items-center px-4 py-2 leading-tight">
                <span className="font-display text-lg text-maroon">{hi}</span>
                <span className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{en}</span>
                {active === href ? (
                  <motion.span layoutId="nav-active" className="absolute inset-x-3 bottom-0.5 h-0.5 rounded bg-maroon" transition={{ type: "spring", bounce: 0.25, duration: 0.5 }} />
                ) : (
                  <span className="absolute inset-x-4 bottom-0.5 h-0.5 origin-left scale-x-0 rounded bg-gold transition-transform duration-300 group-hover:scale-x-100" />
                )}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={waLink(whatsapp, "Namaste! I'd like to know about your products.")}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-leaf px-4 text-sm font-semibold text-cream shadow-md shadow-leaf/30 transition hover:-translate-y-0.5 hover:bg-leaf-deep"
        >
          <WhatsAppIcon className="size-4" />
          <span className="hidden sm:inline">WhatsApp करें</span>
          <span className="sm:hidden">Order</span>
        </a>
      </nav>
      <motion.div style={{ scaleX: scrollYProgress }} className="fixed inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-gold via-maroon to-leaf" />
    </motion.header>
  );
}
