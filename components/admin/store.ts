"use client";

import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { app, db } from "@/lib/firebase";
import { SEED_PRODUCTS, SEED_SETTINGS } from "@/lib/seed";
import { imageUrl, type Product, type Settings } from "@/lib/types";

const auth = app ? getAuth(app) : null;

/** No Firebase env vars: everything is saved in this browser only, so the panel can be tried out. */
export const isDemo = !db;

type DemoState = { products: Product[]; settings: Settings; images: Record<string, string> };
const DEMO_KEY = "bb-admin-demo";

function demoRead(): DemoState {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) return JSON.parse(raw) as DemoState;
  } catch {}
  return { products: SEED_PRODUCTS, settings: SEED_SETTINGS, images: {} };
}
function demoUpdate(fn: (s: DemoState) => void) {
  const s = demoRead();
  fn(s);
  localStorage.setItem(DEMO_KEY, JSON.stringify(s));
}

const byOrder = (a: Product, b: Product) => a.order - b.order;

export function watchUser(cb: (email: string | null) => void) {
  if (!auth) {
    cb("demo@local");
    return () => {};
  }
  return onAuthStateChanged(auth, (u) => cb(u?.email ?? null));
}

export async function login(email: string, password: string) {
  if (auth) await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  if (auth) await signOut(auth);
}

export async function listProducts(): Promise<Product[]> {
  if (!db) {
    const s = demoRead();
    return s.products.map((p) => ({ ...p, image: s.images[p.id] })).sort(byOrder);
  }
  const snap = await getDocs(collection(db, "products"));
  return snap.docs
    .map((d) => ({ ...(d.data() as Omit<Product, "id">), id: d.id }))
    .map((p) => ({ ...p, image: imageUrl(p) }))
    .sort(byOrder);
}

function toRow(p: Product): Omit<Product, "id" | "image"> {
  const { name, nameHi, category, description, sizes, badge, color, featured, visible, order, imageVersion } = p;
  return { name, nameHi, category, description, sizes, badge, color, featured, visible, order, imageVersion };
}

/** photo: new data URL to upload, null to remove the photo, undefined to keep it. */
export async function saveProduct(product: Product, photo?: string | null) {
  const imageVersion = photo === null ? 0 : photo ? Date.now() : product.imageVersion;
  const row = toRow({ ...product, imageVersion });
  if (!db) {
    demoUpdate((s) => {
      const i = s.products.findIndex((p) => p.id === product.id);
      const next = { ...row, id: product.id };
      if (i === -1) s.products.push(next);
      else s.products[i] = next;
      if (photo) s.images[product.id] = photo;
      if (photo === null) delete s.images[product.id];
    });
    return;
  }
  const batch = writeBatch(db);
  batch.set(doc(db, "products", product.id), row);
  if (photo) batch.set(doc(db, "images", product.id), { data: photo });
  if (photo === null) batch.delete(doc(db, "images", product.id));
  await batch.commit();
}

export async function deleteProduct(id: string) {
  if (!db) {
    demoUpdate((s) => {
      s.products = s.products.filter((p) => p.id !== id);
      delete s.images[id];
    });
    return;
  }
  const batch = writeBatch(db);
  batch.delete(doc(db, "products", id));
  batch.delete(doc(db, "images", id));
  await batch.commit();
}

export async function saveOrder(ids: string[]) {
  if (!db) {
    demoUpdate((s) => s.products.forEach((p) => (p.order = ids.indexOf(p.id))));
    return;
  }
  const fs = db;
  const batch = writeBatch(fs);
  ids.forEach((id, order) => batch.update(doc(fs, "products", id), { order }));
  await batch.commit();
}

export async function loadSampleCatalog() {
  if (!db) {
    localStorage.removeItem(DEMO_KEY);
    return;
  }
  const fs = db;
  const batch = writeBatch(fs);
  SEED_PRODUCTS.forEach((p) => batch.set(doc(fs, "products", p.id), toRow(p)));
  batch.set(doc(db, "site", "settings"), SEED_SETTINGS, { merge: true });
  await batch.commit();
}

export async function getSettings(): Promise<Settings> {
  if (!db) return demoRead().settings;
  const snap = await getDoc(doc(db, "site", "settings"));
  return { ...SEED_SETTINGS, ...(snap.data() as Partial<Settings> | undefined) };
}

export async function saveSettings(settings: Settings) {
  if (!db) {
    demoUpdate((s) => (s.settings = settings));
    return;
  }
  await setDoc(doc(db, "site", "settings"), settings);
}

/** Resize to webp small enough for one Firestore document (1 MB cap). */
export async function photoToDataUrl(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  for (const [max, quality] of [[1000, 0.82], [800, 0.75], [600, 0.7]] as const) {
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")?.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL("image/webp", quality);
    if (url.length < 700_000) return url;
  }
  throw new Error("Photo is too large even after compressing. Try a smaller one.");
}
