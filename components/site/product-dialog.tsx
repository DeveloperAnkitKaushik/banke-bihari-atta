"use client";

import { motion } from "motion/react";
import { MessageCircle, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { categoryOf, type Product } from "@/lib/types";
import { telLink, waLink } from "@/lib/wa";
import { ProductVisual } from "./art";

export function ProductDialog({ product, onClose, whatsapp, phone }: { product: Product | null; onClose: () => void; whatsapp: string; phone: string }) {
  const cat = product && categoryOf(product.category);
  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto border-gold/40 bg-cream p-0 sm:max-w-3xl">
        {product && cat && (
          <div className="grid md:grid-cols-2">
            <div className="ornament relative grid place-items-center p-8" style={{ background: `radial-gradient(circle, ${cat.grain}66, transparent 70%)` }}>
              <motion.div
                initial={{ rotate: -12, scale: 0.7, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                className="h-64 sm:h-80"
              >
                <ProductVisual product={product} className="h-full w-auto drop-shadow-2xl" />
              </motion.div>
            </div>
            <div className="flex flex-col gap-3 p-6 sm:p-8">
              <span className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: cat.color }}>
                {cat.hi} · {cat.en}
              </span>
              <DialogTitle className="font-display text-4xl leading-tight font-normal text-maroon">{product.nameHi}</DialogTitle>
              <p className="-mt-2 font-semibold text-ink/80">{product.name}</p>
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
              <div className="mt-auto grid gap-2 pt-4 sm:grid-cols-2">
                <a
                  href={waLink(whatsapp, `Namaste! I'd like to know the rate and availability of ${product.name} (${product.nameHi}).`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-leaf font-semibold text-cream transition hover:bg-leaf-deep"
                >
                  <MessageCircle className="size-4" /> WhatsApp पूछें
                </a>
                <a href={telLink(phone)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-maroon font-semibold text-maroon transition hover:bg-maroon hover:text-cream">
                  <Phone className="size-4" /> Call us
                </a>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
