"use client";

import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from "motion/react";
import { ArrowUpRight, Search } from "lucide-react";
import { memo, useDeferredValue, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES, categoryOf, type Product } from "@/lib/types";
import { Grain, Pack } from "./art";
import { Photo } from "./photo";
import { ProductDialog } from "./product-dialog";

const EASE = [0.22, 1, 0.36, 1] as const;
const ALL_PHOTO = "https://images.unsplash.com/photo-1786301326154-3e040dc8db60?w=120&h=120&fit=crop&q=70&auto=format";

const Card = memo(function Card({ product, big, index, onOpen }: { product: Product; big: boolean; index: number; onOpen: (p: Product) => void }) {
  const cat = categoryOf(product.category);
  const [cover, second] = product.photos;
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const packTile = (
    <div className="ornament absolute inset-0 grid place-items-center" style={{ background: `radial-gradient(circle at 50% 40%, ${cat.grain}, ${cat.color})` }}>
      <Pack product={product} className="h-[70%] w-auto drop-shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-3" />
    </div>
  );
  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, rgba(255,236,190,0.28), transparent 70%)`;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 40, clipPath: "inset(12% 12% 12% 12% round 2rem)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 2rem)" }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.7, delay: Math.min(index, 8) * 0.05, ease: EASE }}
      className={cn(big && "col-span-2 row-span-2")}
    >
      <button
        type="button"
        onClick={() => onOpen(product)}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(e.clientX - r.left);
          my.set(e.clientY - r.top);
        }}
        onPointerLeave={() => {
          mx.set(-200);
          my.set(-200);
        }}
        aria-label={`${product.name}, view details`}
        className="group relative block size-full overflow-hidden rounded-[2rem] bg-ink text-left shadow-lg shadow-ink/10 transition-shadow duration-500 hover:shadow-2xl hover:shadow-maroon/25 focus-visible:ring-4 focus-visible:ring-gold/50 focus-visible:outline-none"
      >
        {cover ? (
          <>
            <Photo src={cover} fallback={packTile} eager={index < 4} className="duration-[1.2s] ease-out group-hover:scale-110" />
            {second && (
              // eslint-disable-next-line @next/next/no-img-element -- hover-only second photo, already resized
              <img src={second} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" />
            )}
          </>
        ) : (
          packTile
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 via-35% to-transparent to-70% opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
        <motion.div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: spotlight }} />
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-cream/10 ring-inset transition group-hover:ring-2 group-hover:ring-gold/60" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-4">
          {product.badge ? (
            <span className="rounded-full bg-cream/90 px-3 py-1 text-[11px] font-bold tracking-wide text-maroon backdrop-blur">{product.badge}</span>
          ) : (
            <span />
          )}
          <span className="grid size-9 translate-x-2 -translate-y-2 place-items-center rounded-full bg-gold text-maroon-deep opacity-0 shadow-lg transition-all duration-500 group-hover:translate-0 group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 text-cream sm:p-5">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: cat.grain }}>
            {cat.en}
          </p>
          <h3 className={cn("font-display leading-[1.1] drop-shadow", big ? "text-4xl sm:text-6xl" : "text-2xl sm:text-3xl")}>{product.nameHi}</h3>
          <p className={cn("font-medium text-cream/80", big ? "text-base sm:text-lg" : "text-xs sm:text-sm")}>{product.name}</p>
          {big && <p className="mt-2 hidden max-w-md text-sm text-cream/75 sm:line-clamp-2">{product.description}</p>}
          <div className="grid grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:pt-3">
            <div className="flex flex-wrap gap-1.5 overflow-hidden">
              {product.sizes.map((s) => (
                <span key={s} className="rounded-full border border-cream/30 bg-cream/10 px-2.5 py-0.5 text-[11px] backdrop-blur">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </button>
    </motion.li>
  );
});

function CategoryChip({ active, label, sub, count, photo, onClick }: { active: boolean; label: string; sub: string; count: number; photo?: string; onClick: () => void }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "relative flex min-h-14 shrink-0 items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-left transition-colors",
        active ? "text-cream" : "bg-card text-ink ring-1 ring-border hover:ring-gold",
      )}
    >
      {active && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-maroon shadow-lg shadow-maroon/25" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
      <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-parchment ring-2 ring-gold/60">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny thumbnail of an already-resized photo */}
        {photo && <img src={photo} alt="" className="size-full object-cover" />}
      </span>
      <span className="relative leading-tight">
        <span className="block font-display text-lg">{label}</span>
        <span className={cn("block text-[11px] tracking-wide", active ? "text-cream/75" : "text-muted-foreground")}>
          {sub} · {count}
        </span>
      </span>
    </button>
  );
}

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
  const tabs = [
    { id: "all", hi: "सभी", en: "Everything", count: products.length, photo: ALL_PHOTO },
    ...CATEGORIES.map((c) => {
      const items = products.filter((p) => p.category === c.id);
      return { id: c.id, hi: c.hi, en: c.en, count: items.length, photo: items.find((p) => p.photos[0])?.photos[0] };
    }).filter((t) => t.count > 0),
  ];

  return (
    <section id="products" className="relative scroll-mt-20 bg-parchment/60 pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }}>
          <p className="text-sm font-semibold tracking-[0.3em] text-gold uppercase">Our range · {products.length} products</p>
          <h2 className="mt-2 font-display text-6xl leading-none text-maroon sm:text-7xl">हमारे उत्पाद</h2>
          <p className="mt-3 max-w-md text-muted-foreground">Tap anything for photos and pack sizes, then ask us on WhatsApp for today&apos;s rate.</p>
        </motion.div>

        <div className="mt-8 flex flex-col-reverse gap-4 lg:flex-row lg:items-center">
          {/* padding keeps the chips' hover ring from being clipped by the scroll container */}
          <div role="tablist" aria-label="Categories" className="-mx-4 flex min-w-0 flex-1 gap-2 overflow-x-auto px-4 py-1.5 [scrollbar-width:none] sm:mx-0 sm:px-1">
            {tabs.map((t) => (
              <CategoryChip key={t.id} active={cat === t.id} label={t.hi} sub={t.en} count={t.count} photo={t.photo} onClick={() => setCat(t.id)} />
            ))}
          </div>
          <label className="relative w-full shrink-0 lg:w-72">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute top-1/2 left-5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search atta, दाल, besan…"
              className="h-14 w-full rounded-full border border-input bg-card pr-5 pl-12 text-base shadow-sm transition outline-none focus:border-gold focus:ring-4 focus:ring-gold/20"
            />
          </label>
        </div>

        <motion.ul layout className="mt-6 grid grid-flow-dense auto-rows-[11rem] grid-cols-2 gap-3 sm:auto-rows-[15rem] sm:gap-4 md:grid-cols-3 lg:auto-rows-[17rem] lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <Card key={p.id} product={p} index={i} big={p.featured && !q} onOpen={setOpen} />
            ))}
          </AnimatePresence>
        </motion.ul>
        <AnimatePresence>
          {shown.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid justify-items-center gap-3 py-16 text-center">
              <div className="flex gap-2" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} animate={{ y: [0, -14, 0] }} transition={{ duration: 0.9, delay: i * 0.15, repeat: Infinity }}>
                    <Grain className="w-5" />
                  </motion.span>
                ))}
              </div>
              {products.length === 0 ? (
                <>
                  <p className="font-display text-3xl text-maroon">जल्द आ रहा है</p>
                  <p className="text-muted-foreground">Our product list is being updated. Message us on WhatsApp for today&apos;s stock.</p>
                </>
              ) : (
                <>
                  <p className="font-display text-3xl text-maroon">कुछ नहीं मिला</p>
                  <p className="text-muted-foreground">Nothing matches “{query}”. Try another word, or ask us on WhatsApp.</p>
                </>
              )}
              {products.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCat("all");
                }}
                className="mt-1 inline-flex min-h-11 items-center rounded-full border-2 border-maroon px-5 font-semibold text-maroon transition hover:bg-maroon hover:text-cream"
              >
                Show all products
              </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ProductDialog product={open} onClose={() => setOpen(null)} whatsapp={whatsapp} phone={phone} />
    </section>
  );
}
