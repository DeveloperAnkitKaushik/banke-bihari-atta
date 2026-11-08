import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import type { Settings } from "@/lib/types";
import { telLink, waLink } from "@/lib/wa";
import { Reveal } from "./reveal";

export function Visit({ settings }: { settings: Settings }) {
  const place = encodeURIComponent(settings.mapQuery || settings.address);
  const rows = [
    { icon: MapPin, label: "पता · Address", value: settings.address },
    { icon: Clock, label: "समय · Hours", value: settings.hours },
    { icon: Phone, label: "फ़ोन · Phone", value: settings.phone, href: telLink(settings.phone) },
  ];
  return (
    <section id="visit" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-maroon text-cream shadow-2xl shadow-maroon/30">
        <div className="ornament absolute inset-0 opacity-25" />
        <div className="pointer-events-none absolute inset-3 rounded-[1.6rem] border border-gold/40" />
        <svg aria-hidden viewBox="0 0 200 200" className="animate-spin-slower pointer-events-none absolute -bottom-24 -left-24 size-80 text-gold/15">
          {Array.from({ length: 16 }, (_, i) => (
            <ellipse key={i} cx="100" cy="45" rx="14" ry="42" fill="currentColor" transform={`rotate(${i * 22.5} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="22" fill="currentColor" />
        </svg>
        <div className="relative grid gap-2 md:grid-cols-[1fr_1.1fr]">
          <div className="p-8 sm:p-12">
            <p className="text-sm font-semibold tracking-[0.3em] text-gold-soft uppercase">Visit the chakki</p>
            <h2 className="mt-2 font-display text-5xl sm:text-6xl">आइए, मिलिए</h2>
            <p className="mt-3 max-w-sm text-cream/80">Come see the chakki running, smell the fresh atta and take a pack home. Or message us and we&apos;ll keep it ready.</p>
            <div className="mt-8 space-y-3">
              {rows.map(({ icon: Icon, label, value, href }, i) => (
                <Reveal key={label} delay={0.15 + i * 0.1} y={16}>
                  <div className="flex items-center gap-4 rounded-2xl bg-cream/5 p-3 ring-1 ring-cream/10 transition hover:bg-cream/10">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold text-maroon-deep">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs tracking-[0.2em] text-cream/60 uppercase">{label}</p>
                      {href ? (
                        <a href={href} className="text-lg font-semibold underline-offset-4 hover:underline">
                          {value}
                        </a>
                      ) : (
                        <p className="text-lg font-semibold">{value}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waLink(settings.whatsapp, "Namaste! I'd like to place an order / ask about products.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-6 font-semibold text-maroon-deep shadow-lg transition hover:-translate-y-0.5 hover:bg-gold-soft"
              >
                <MessageCircle className="size-4" /> WhatsApp करें
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${place}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-cream/40 px-6 font-semibold transition hover:border-cream hover:bg-cream hover:text-maroon"
              >
                <Navigation className="size-4" /> Directions
              </a>
            </div>
          </div>
          <div className="relative min-h-80 p-3 md:p-5">
            <div className="group relative size-full min-h-80 overflow-hidden rounded-3xl ring-4 ring-gold/50">
              <iframe
                title="Shop location on Google Maps"
                src={`https://www.google.com/maps?q=${place}&z=15&output=embed`}
                loading="lazy"
                className="absolute inset-0 size-full border-0 [filter:sepia(.45)_saturate(.9)_hue-rotate(-8deg)] transition-[filter] duration-700 group-hover:[filter:none]"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-cream/95 p-3 text-ink shadow-xl backdrop-blur sm:inset-x-auto sm:left-3 sm:max-w-xs">
                <Image src="/logo.webp" alt="" width={72} height={48} className="h-12 w-auto" />
                <div className="min-w-0">
                  <p className="font-display text-lg leading-tight text-maroon">बांके बिहारी आटा चक्की</p>
                  <p className="truncate text-xs text-muted-foreground">{settings.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Footer({ year }: { year: number }) {
  return (
    <footer className="border-t border-border bg-parchment/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6">
        <Image src="/logo.webp" alt="Banke Bihari Atta Chakki" width={180} height={120} className="h-24 w-auto" />
        <p className="font-display text-2xl text-maroon">घर की रसोई का पूरा भरोसा</p>
        <p className="text-sm text-muted-foreground">
          © {year} Banke Bihari Atta Chakki ·{" "}
          <Link href="/admin" className="underline-offset-4 hover:underline">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
