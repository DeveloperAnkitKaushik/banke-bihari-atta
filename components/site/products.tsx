"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Search, Star } from "lucide-react";
import { memo, useDeferredValue, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES, categoryOf, type Product } from "@/lib/types";
import { ProductVisual } from "./art";
import { ProductDialog } from "./product-dialog";

const Card = memo(function Card({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 200, damping: 20 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 20 });
  const cat = categoryOf(product.category);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        onClick={() => onOpen(product)}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-left shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-maroon/10 focus-visible:ring-4 focus-visible:ring-gold/40 focus-visible:outline-none"
      >
        <div className="relative grid aspect-[4/4.2] place-items-center overflow-hidden [perspective:800px]" style={{ background: `radial-gradient(circle at 50% 60%, ${cat.grain}55, transparent 70%)` }}>
          <div className="ornament absolute inset-0 opacity-60" />
          <motion.div
            className="absolute size-[70%] rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
            style={{ background: cat.grain }}
          />
          <motion.div style={{ rotateX, rotateY }} className="relative h-[82%] transition-transform duration-500 group-hover:scale-105">
            <ProductVisual product={product} className="h-full w-auto drop-shadow-[0_18px_18px_rgba(43,26,18,0.25)]" />
          </motion.div>
          {product.badge && (
            <span className="absolute top-3 left-3 rounded-full bg-maroon px-3 py-1 text-xs font-semibold text-cream shadow">{product.badge}</span>
          )}
          {product.featured && (
            <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-gold text-cream shadow" aria-label="Featured">
              <Star className="size-4 fill-current" />
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 border-t border-border/70 p-4 sm:p-5">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: cat.color }}>
            {cat.en}
          </span>
          <h3 className="font-display text-2xl leading-tight text-maroon">{product.nameHi}</h3>
          <p className="text-sm font-medium text-ink/80">{product.name}</p>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
            {product.sizes.map((s) => (
              <span key={s} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-ink/70">
                {s}
              </span>
            ))}
          </div>
        </div>
      </button>
    </motion.li>
  );
});

export function Products({ products, whatsapp, phone }: { products: Product[]; whatsapp: string; phone: string }) {
  const [cat, setCat] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Product | null>(null);
  const q = useDeferredValue(query.trim().toLowerCase());

  const shown = useMemo(
    () =>
      products.filter(
        (p) => (cat === "all" || p.category === cat) && (!q || `${p.name} ${p.nameHi} ${p.description}`.toLowerCase().includes(q)),
      ),
    [products, cat, q],
  );
  const tabs = [{ id: "all", hi: "सभी", en: "All" }, ...CATEGORIES.filter((c) => products.some((p) => p.category === c.id))];

  return (
    <section id="products" className="relative scroll-mt-20 bg-parchment/60 py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-sm font-semibold tracking-[0.3em] text-gold uppercase">Our range</p>
          <h2 className="mt-2 font-display text-5xl text-maroon sm:text-6xl">हमारे उत्पाद</h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">Tap any product for details, then ask us on WhatsApp for today&apos;s rate and availability.</p>
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <label className="relative w-full max-w-md">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search atta, दाल, besan…"
              className="h-12 w-full rounded-full border border-input bg-card pr-4 pl-11 shadow-sm transition outline-none focus:border-gold focus:ring-4 focus:ring-gold/20"
            />
          </label>
          <div role="tablist" aria-label="Categories" className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-card p-1 shadow-sm [scrollbar-width:none]">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={cat === t.id}
                onClick={() => setCat(t.id)}
                className={cn("relative min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-colors", cat === t.id ? "text-cream" : "text-ink/70 hover:text-maroon")}
              >
                {cat === t.id && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-maroon" transition={{ type: "spring", bounce: 0.25, duration: 0.5 }} />}
                <span className="relative">
                  {t.hi} <span className="opacity-70">· {t.en}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {shown.map((p) => (
              <Card key={p.id} product={p} onOpen={setOpen} />
            ))}
          </AnimatePresence>
        </motion.ul>
        {shown.length === 0 && <p className="py-16 text-center text-muted-foreground">कुछ नहीं मिला · Nothing matches “{query}”.</p>}
      </div>
      <ProductDialog product={open} onClose={() => setOpen(null)} whatsapp={whatsapp} phone={phone} />
    </section>
  );
}
