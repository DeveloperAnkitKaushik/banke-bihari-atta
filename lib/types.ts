export const CATEGORIES = [
  { id: "atta", en: "Atta", hi: "आटा", color: "#7a1f1f", grain: "#e2b25a" },
  { id: "dal", en: "Dals", hi: "दालें", color: "#1f5a32", grain: "#f0a830" },
  { id: "besan", en: "Besan & Flours", hi: "बेसन", color: "#a5651b", grain: "#f3cf6b" },
  { id: "masale", en: "Masale", hi: "मसाले", color: "#9c2a12", grain: "#d9481e" },
  { id: "other", en: "Dalia & More", hi: "और भी", color: "#4a3b2a", grain: "#d8b98a" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const categoryOf = (id: string) => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];

export type Product = {
  id: string;
  name: string;
  nameHi: string;
  category: CategoryId;
  description: string;
  sizes: string[];
  badge: string;
  /** grain colour on the pack illustration; falls back to the category's */
  color: string;
  featured: boolean;
  visible: boolean;
  order: number;
  /** bumped on every upload; 0 = no photo, show the pack illustration */
  imageVersion: number;
  /** computed on read, never stored */
  image?: string;
};

export type Settings = {
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
  mapQuery: string;
  since: string;
  families: string;
};

export const imageUrl = (p: Pick<Product, "id" | "imageVersion">) =>
  p.imageVersion ? `/api/img/${p.id}?v=${p.imageVersion}` : undefined;
