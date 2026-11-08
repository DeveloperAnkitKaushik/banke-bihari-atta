import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Settings } from "@/lib/types";
import { telLink, waLink } from "@/lib/wa";
import { Reveal } from "./reveal";

export function Visit({ settings }: { settings: Settings }) {
  const rows = [
    { icon: MapPin, label: "पता · Address", value: settings.address },
    { icon: Clock, label: "समय · Hours", value: settings.hours },
    { icon: Phone, label: "फ़ोन · Phone", value: settings.phone, href: telLink(settings.phone) },
  ];
  return (
    <section id="visit" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-maroon text-cream shadow-2xl shadow-maroon/30">
        <div className="ornament absolute inset-0 opacity-25" />
        <div className="relative grid md:grid-cols-2">
          <div className="p-8 sm:p-12">
            <p className="text-sm font-semibold tracking-[0.3em] text-gold-soft uppercase">Visit the chakki</p>
            <h2 className="mt-2 font-display text-5xl sm:text-6xl">आइए, मिलिए</h2>
            <p className="mt-3 max-w-sm text-cream/80">Come see the chakki running, smell the fresh atta, and take home a pack. Or just message us and we&apos;ll keep it ready.</p>
            <ul className="mt-8 space-y-5">
              {rows.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream/10 ring-1 ring-gold/50">
                    <Icon className="size-5 text-gold-soft" />
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
                </li>
              ))}
            </ul>
            <a
              href={waLink(settings.whatsapp, "Namaste! I'd like to place an order / ask about products.")}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-7 font-semibold text-maroon-deep shadow-lg transition hover:-translate-y-0.5 hover:bg-gold-soft"
            >
              <MessageCircle className="size-4" /> WhatsApp पर ऑर्डर करें
            </a>
          </div>
          <div className="min-h-72 p-3 md:p-4">
            <iframe
              title="Shop location on Google Maps"
              src={`https://www.google.com/maps?q=${encodeURIComponent(settings.mapQuery || settings.address)}&z=15&output=embed`}
              loading="lazy"
              className="size-full min-h-72 rounded-3xl border-0 sepia-[.3]"
              referrerPolicy="no-referrer-when-downgrade"
            />
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
