import { Hero } from "@/components/site/hero";
import { Navbar } from "@/components/site/navbar";
import { Process } from "@/components/site/process";
import { Products } from "@/components/site/products";
import { Stats } from "@/components/site/stats";
import { VelocityMarquee } from "@/components/site/velocity-marquee";
import { Footer } from "@/components/site/footer";
import { Visit } from "@/components/site/visit";
import { WhatsAppFab } from "@/components/site/whatsapp-fab";
import { getCatalog } from "@/lib/data";

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
      <Footer settings={settings} year={year} />
      <WhatsAppFab whatsapp={settings.whatsapp} />
    </>
  );
}
