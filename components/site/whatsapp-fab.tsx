"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { waLink } from "@/lib/wa";
import { WhatsAppIcon } from "./art";

/** Floating WhatsApp button; hidden on the hero, which has its own WhatsApp button. */
export function WhatsAppFab({ whatsapp }: { whatsapp: string }) {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > window.innerHeight * 0.7));

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={waLink(whatsapp, "Namaste! I'd like to know about your products.")}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 90, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", bounce: 0.45, duration: 0.6 }}
          className="group fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-whatsapp text-white shadow-xl shadow-black/25 sm:right-6 sm:bottom-6"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp/40 motion-reduce:hidden" />
          <WhatsAppIcon className="relative size-7" />
          <span className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-ink px-3 py-1.5 text-sm whitespace-nowrap text-cream opacity-0 shadow-lg transition group-hover:opacity-100 sm:block">
            Order on WhatsApp
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
