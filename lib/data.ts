import "server-only";
import { cacheLife } from "next/cache";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { SEED_PRODUCTS, SEED_SETTINGS } from "./seed";
import type { Product, Settings } from "./types";

export async function getCatalog(): Promise<{ products: Product[]; settings: Settings; year: number }> {
  "use cache";
  // shortcut: admin edits show up within ~1 min; add on-demand revalidation if instant updates are needed
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
  const year = new Date().getFullYear();
  const [snap, settingsSnap] = await Promise.all([
    getDocs(collection(db, "products")),
    getDoc(doc(db, "site", "settings")),
  ]);
  // shortcut: an empty catalogue shows the demo products until the owner saves real ones from /admin
  if (snap.empty) return { products: SEED_PRODUCTS, settings: { ...SEED_SETTINGS, ...(settingsSnap.data() as Partial<Settings> | undefined) }, year };
  // small catalogue: filter + sort in memory instead of needing a composite index
  const products = snap.docs
    .map((d) => ({ ...(d.data() as Omit<Product, "id">), id: d.id }))
    .filter((p) => p.visible)
    .sort((a, b) => a.order - b.order);
  const settings = { ...SEED_SETTINGS, ...(settingsSnap.data() as Partial<Settings> | undefined) };
  return { products, settings, year };
}
