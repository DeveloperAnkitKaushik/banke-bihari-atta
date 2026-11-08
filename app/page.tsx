import { MessageCircle } from "lucide-react";
import { Hero } from "@/components/site/hero";
import { Navbar } from "@/components/site/navbar";
import { Process } from "@/components/site/process";
import { Products } from "@/components/site/products";
import { Stats } from "@/components/site/stats";
import { VelocityMarquee } from "@/components/site/velocity-marquee";
import { Footer, Visit } from "@/components/site/visit";
import { getCatalog } from "@/lib/data";
import { waLink } from "@/lib/wa";

export default async function Home() {
  const { products, settings, year } = await getCatalog();
  return (
    <>
      <Navbar whatsapp={settings.whatsapp} />
      <main className="overflow-x-clip">
        <Hero whatsapp={settings.whatsapp} since={settings.since} />
        <VelocityMarquee />
        <Products products={products} whatsapp={settings.whatsapp} phone={settings.phone} />
        <Stats years={Math.max(1, year - (Number(settings.since) || year))} families={settings.families} productCount={products.length} />
        <Process />
        <Visit settings={settings} />
      </main>
      <Footer year={year} />
      <a
        href={waLink(settings.whatsapp, "Namaste! I'd like to know about your products.")}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed right-4 bottom-4 z-40 grid size-14 place-items-center rounded-full bg-leaf text-cream shadow-xl shadow-leaf/40 transition hover:scale-110 sm:right-6 sm:bottom-6"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-leaf/40 motion-reduce:hidden" />
        <MessageCircle className="relative size-6" />
      </a>
    </>
  );
}
