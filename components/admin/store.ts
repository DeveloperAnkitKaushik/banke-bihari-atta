"use client";

import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { app, db } from "@/lib/firebase";
import { SEED_PRODUCTS, SEED_SETTINGS } from "@/lib/seed";
import type { Product, Settings } from "@/lib/types";

const auth = getAuth(app);

export const watchUser = (cb: (email: string | null) => void) => onAuthStateChanged(auth, (u) => cb(u?.email ?? null));

export async function login(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  await signInWithPopup(auth, new GoogleAuthProvider());
}

/** Must match the email list in firestore.rules; the rules are the real lock, this only hides the panel. */
export const ADMIN_EMAILS = ["ankitkaushik6269@gmail.com"];

export const logout = () => signOut(auth);

export async function listProducts(): Promise<Product[]> {
  const snap = await getDocs(collection(db, "products"));
  return snap.docs
    .map((d) => ({ ...(d.data() as Omit<Product, "id">), id: d.id }))
    .sort((a, b) => a.order - b.order);
}

function toRow(p: Product): Omit<Product, "id"> {
  const { name, nameHi, category, description, sizes, badge, color, featured, visible, order, photos } = p;
  return { name, nameHi, category, description, sizes, badge, color, featured, visible, order, photos };
}

const UPLOADED = "/api/img/";

/**
 * product.photos may hold new uploads as data URLs; each is stored as its own image doc
 * and replaced by its /api/img URL. `removed` lists photo URLs dropped in the editor.
 */
export async function saveProduct(product: Product, removed: string[] = []) {
  const batch = writeBatch(db);
  const photos = product.photos.map((url) => {
    if (!url.startsWith("data:")) return url;
    const ref = doc(collection(db, "images"));
    batch.set(ref, { data: url });
    return UPLOADED + ref.id;
  });
  removed.filter((url) => url.startsWith(UPLOADED)).forEach((url) => batch.delete(doc(db, "images", url.slice(UPLOADED.length))));
  batch.set(doc(db, "products", product.id), toRow({ ...product, photos }));
  await batch.commit();
}

export async function deleteProduct(product: Product) {
  const batch = writeBatch(db);
  batch.delete(doc(db, "products", product.id));
  product.photos.filter((url) => url.startsWith(UPLOADED)).forEach((url) => batch.delete(doc(db, "images", url.slice(UPLOADED.length))));
  await batch.commit();
}

export async function saveOrder(ids: string[]) {
  const batch = writeBatch(db);
  ids.forEach((id, order) => batch.update(doc(db, "products", id), { order }));
  await batch.commit();
}

export async function loadSampleCatalog() {
  const batch = writeBatch(db);
  SEED_PRODUCTS.forEach((p) => batch.set(doc(db, "products", p.id), toRow(p)));
  batch.set(doc(db, "site", "settings"), SEED_SETTINGS, { merge: true });
  await batch.commit();
}

export async function getSettings(): Promise<Settings> {
  const snap = await getDoc(doc(db, "site", "settings"));
  return { ...SEED_SETTINGS, ...(snap.data() as Partial<Settings> | undefined) };
}

export async function saveSettings(settings: Settings) {
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
