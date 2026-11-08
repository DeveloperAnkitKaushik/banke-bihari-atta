"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Phone, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { categoryOf, type Product } from "@/lib/types";
import { telLink, waLink } from "@/lib/wa";
import { Pack, WhatsAppIcon } from "./art";
import { Photo } from "./photo";

const PACK = "pack";

/** Photos first, then the branded pack illustration as the last slide. */
function Gallery({ product }: { product: Product }) {
  const slides = [...product.photos, PACK];
  const [[index, dir], setSlide] = useState([0, 0]);
  const go = (to: number) => setSlide([(to + slides.length) % slides.length, to > index ? 1 : -1]);
  const cat = categoryOf(product.category);

  return (
    <div className="flex flex-col gap-3 p-3 pt-6 sm:p-6">
      <div className="relative aspect-[1/0.9] overflow-hidden rounded-2xl sm:aspect-square" style={{ background: `radial-gradient(circle, ${cat.grain}66, transparent 70%)` }}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d >= 0 ? "100%" : "-100%", opacity: 0.4 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d >= 0 ? "-100%" : "100%", opacity: 0.4 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
            drag={slides.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1);
              else if (info.offset.x > 60) go(index - 1);
            }}
            className="absolute inset-0 grid cursor-grab place-items-center active:cursor-grabbing"
          >
            {slides[index] === PACK ? (
              <Pack product={product} className="ornament h-[85%] w-auto drop-shadow-2xl" />
            ) : (
              <Photo src={slides[index]} alt={product.name} eager fallback={<Pack product={product} className="ornament h-[85%] w-auto drop-shadow-2xl" />} />
            )}
          </motion.div>
        </AnimatePresence>
        {slides.length > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => go(index - 1)} className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-maroon shadow backdrop-blur transition hover:bg-cream">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => go(index + 1)} className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-maroon shadow backdrop-blur transition hover:bg-cream">
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>
      {slides.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {slides.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={src === PACK ? "Show pack" : `Show photo ${i + 1}`}
              onClick={() => go(i)}
              className={cn("relative size-16 shrink-0 overflow-hidden rounded-xl border-2 transition", i === index ? "border-maroon" : "border-transparent opacity-60 hover:opacity-100")}
            >
              {src === PACK ? (
                <Pack product={product} className="mx-auto h-full w-auto bg-parchment" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- thumbnails of already-resized images
                <img src={src} alt="" className="size-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductDialog({ product, onClose, whatsapp, phone }: { product: Product | null; onClose: () => void; whatsapp: string; phone: string }) {
  const cat = product && categoryOf(product.category);
  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92dvh] gap-0 overflow-y-auto overscroll-contain border-gold/40 bg-cream p-0 max-sm:top-auto max-sm:bottom-0 max-sm:max-w-full max-sm:translate-y-0 max-sm:rounded-t-[1.75rem] max-sm:rounded-b-none max-sm:data-open:slide-in-from-bottom-1/2 sm:max-w-4xl"
      >
        <span aria-hidden className="absolute top-2 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-ink/20 sm:hidden" />
        <DialogClose
          aria-label="Close"
          className="absolute top-4 right-4 z-10 grid size-11 place-items-center rounded-full bg-cream/90 text-maroon shadow-lg backdrop-blur transition hover:bg-cream sm:top-3 sm:right-3"
        >
          <X className="size-5" />
        </DialogClose>
        {product && cat && (
          <div className="grid md:grid-cols-[1.1fr_1fr]">
            <Gallery key={product.id} product={product} />
            <div className="flex flex-col gap-3 px-5 pt-1 sm:p-8 md:pt-14">
              <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: cat.color }}>
                {cat.hi} · {cat.en}
              </span>
              <DialogTitle className="font-display text-4xl leading-tight font-normal text-maroon">{product.nameHi}</DialogTitle>
              <p className="-mt-2 font-semibold text-ink/80">{product.name}</p>
              {product.badge && <span className="w-fit rounded-full bg-maroon px-3 py-1 text-xs font-semibold text-cream">{product.badge}</span>}
              <DialogDescription className="text-base text-muted-foreground">{product.description}</DialogDescription>
              <div>
                <p className="mb-2 text-sm font-semibold text-ink">उपलब्ध पैक · Available packs</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <span key={s} className="rounded-full border border-gold/60 bg-card px-3 py-1 text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="sticky bottom-0 -mx-5 mt-auto grid grid-cols-[1fr_auto] gap-2 border-t border-border bg-cream/95 px-5 py-3 backdrop-blur sm:static sm:mx-0 sm:grid-cols-2 sm:border-0 sm:bg-transparent sm:px-0 sm:pt-4 sm:pb-0">
                <a
                  href={waLink(whatsapp, `Namaste! I'd like to know the rate and availability of ${product.name} (${product.nameHi}).`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-leaf font-semibold text-cream transition hover:bg-leaf-deep"
                >
                  <WhatsAppIcon className="size-4" /> WhatsApp पूछें
                </a>
                <a href={telLink(phone)} className="inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full border-2 border-maroon font-semibold text-maroon transition hover:bg-maroon hover:text-cream">
                  <Phone className="size-4" /> <span className="max-sm:sr-only">Call us</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
