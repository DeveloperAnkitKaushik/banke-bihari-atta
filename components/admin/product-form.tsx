"use client";

import { ImagePlus, Loader2, Star, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Pack } from "@/components/site/art";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CATEGORIES, categoryOf, type Product } from "@/lib/types";
import { photoToDataUrl, saveProduct } from "./store";

export function emptyProduct(order: number): Product {
  return {
    id: "",
    name: "",
    nameHi: "",
    category: "atta",
    description: "",
    sizes: ["1 kg"],
    badge: "",
    color: "",
    featured: false,
    visible: true,
    order,
    photos: [],
  };
}

const MAX_PHOTOS = 8;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";

export function ProductForm({ initial, onClose, onSaved }: { initial: Product; onClose: () => void; onSaved: () => void }) {
  const [p, setP] = useState(initial);
  const [sizes, setSizes] = useState(initial.sizes.join(", "));
  // stored photos dropped in this edit; their image docs are deleted on save
  const [removed, setRemoved] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((prev) => ({ ...prev, [k]: v }));
  const isNew = !initial.id;
  const preview: Product = {
    ...p,
    sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
  };

  async function onPick(files: FileList | null) {
    const room = MAX_PHOTOS - p.photos.length;
    const picked = [...(files ?? [])].slice(0, room);
    if (files && files.length > room) toast.warning(`Up to ${MAX_PHOTOS} photos per product`);
    for (const file of picked) {
      try {
        const url = await photoToDataUrl(file);
        setP((prev) => ({ ...prev, photos: [...prev.photos, url] }));
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not read that photo");
      }
    }
  }

  function removePhoto(url: string) {
    set("photos", p.photos.filter((x) => x !== url));
    if (!url.startsWith("data:")) setRemoved((r) => [...r, url]);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const clean: Product = {
      ...preview,
      name: p.name.trim(),
      nameHi: p.nameHi.trim(),
      description: p.description.trim(),
      badge: p.badge.trim(),
      id: p.id || `${slug(p.name)}-${Date.now().toString(36)}`,
    };
    if (!clean.name || !clean.nameHi) return toast.error("Both names are needed");
    if (clean.sizes.length === 0) return toast.error("Add at least one pack size");
    setBusy(true);
    try {
      await saveProduct(clean, removed);
      toast.success(isNew ? "Product added" : "Saved");
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[94dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-normal text-maroon">{isNew ? "Add product" : `Edit · ${initial.nameHi}`}</DialogTitle>
          <DialogDescription>Shown on the website within about a minute of saving.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-[13rem_1fr]">
          <div className="flex flex-col gap-3">
            <div className="grid h-44 w-full place-items-center rounded-2xl bg-muted/60 p-3">
              <Pack product={preview} className="h-full w-auto" />
            </div>
            <p className={LABEL}>Photos · first one is the cover</p>
            <ul className="grid grid-cols-3 gap-2">
              {p.photos.map((url, i) => (
                <li key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local previews and already-resized photos */}
                  <img src={url} alt={`Photo ${i + 1}`} className="size-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/60 p-0.5">
                    <button type="button" aria-label="Make cover photo" disabled={i === 0} onClick={() => set("photos", [url, ...p.photos.filter((x) => x !== url)])} className="grid size-7 place-items-center text-cream disabled:text-gold">
                      <Star className={cn("size-3.5", i === 0 && "fill-current")} />
                    </button>
                    <button type="button" aria-label="Remove photo" onClick={() => removePhoto(url)} className="grid size-7 place-items-center text-cream">
                      <X className="size-3.5" />
                    </button>
                  </div>
                </li>
              ))}
              {p.photos.length < MAX_PHOTOS && (
                <li>
                  <label className="grid aspect-square cursor-pointer place-items-center rounded-lg border border-dashed border-gold text-muted-foreground hover:bg-muted">
                    <ImagePlus className="size-5" />
                    <span className="sr-only">Add photos</span>
                    <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onPick(e.target.files)} />
                  </label>
                </li>
              )}
            </ul>
            {p.photos.length === 0 && <p className="text-xs text-muted-foreground">No photos: the site shows the pack above.</p>}
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name (English)">
                <Input required value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="Chakki Fresh Atta" />
              </Field>
              <Field label="नाम (Hindi)">
                <Input required value={p.nameHi} onChange={(e) => set("nameHi", e.target.value)} placeholder="चक्की आटा" />
              </Field>
            </div>
            <div role="group" aria-label="Category" className="grid gap-1.5">
              <span className={LABEL}>Category</span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => set("category", c.id)}
                    aria-pressed={p.category === c.id}
                    className={cn(
                      "min-h-11 rounded-full border px-3 text-sm transition",
                      p.category === c.id ? "border-maroon bg-maroon text-cream" : "border-input hover:border-maroon",
                    )}
                  >
                    {c.hi} · {c.en}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Description">
              <Textarea rows={3} value={p.description} onChange={(e) => set("description", e.target.value)} placeholder="What makes it special?" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-[1fr_10rem_6rem]">
              <Field label="Pack sizes (comma separated)">
                <Input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="1 kg, 5 kg, 10 kg" />
              </Field>
              <Field label="Badge (optional)">
                <Input value={p.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Bestseller" />
              </Field>
              <Field label="Grain colour">
                <Input type="color" className="h-9 p-1" value={p.color || categoryOf(p.category).grain} onChange={(e) => set("color", e.target.value)} />
              </Field>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <Switch checked={p.visible} onCheckedChange={(v) => set("visible", v)} /> Show on website
              </label>
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <Switch checked={p.featured} onCheckedChange={(v) => set("featured", v)} /> Featured ★
              </label>
            </div>
          </div>

          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="animate-spin" />} {isNew ? "Add product" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const LABEL = "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className={LABEL}>{label}</span>
      {children}
    </label>
  );
}
