"use client";

import { ArrowDown, ArrowUp, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductVisual } from "@/components/site/art";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { categoryOf, type Product } from "@/lib/types";
import { emptyProduct, ProductForm } from "./product-form";
import { LoadError, RowsSkeleton } from "./states";
import { deleteProduct, listProducts, loadSampleCatalog, saveOrder, saveProduct } from "./store";

type RowProps = {
  product: Product;
  first: boolean;
  last: boolean;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onToggle: (p: Product, key: "visible" | "featured", v: boolean) => void;
};

const Row = memo(function Row({ product: p, first, last, onEdit, onDelete, onMove, onToggle }: RowProps) {
  const cat = categoryOf(p.category);
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-nowrap sm:gap-4">
      <div className="flex flex-col">
        <Button variant="ghost" size="icon-sm" aria-label={`Move ${p.name} up`} disabled={first} onClick={() => onMove(p.id, -1)}>
          <ArrowUp />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label={`Move ${p.name} down`} disabled={last} onClick={() => onMove(p.id, 1)}>
          <ArrowDown />
        </Button>
      </div>
      <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
        <ProductVisual product={p} className="size-full" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-xl text-maroon">{p.nameHi}</p>
        <p className="truncate text-sm">
          {p.name} <span className="text-muted-foreground">· {p.sizes.join(", ")}</span>
        </p>
        <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: cat.color }}>
          {cat.en}
          {p.badge && <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-ink normal-case">{p.badge}</span>}
        </p>
      </div>
      <label className="flex min-h-11 items-center gap-2 text-xs">
        <Switch checked={p.visible} onCheckedChange={(v) => onToggle(p, "visible", v)} /> Visible
      </label>
      <label className="flex min-h-11 items-center gap-2 text-xs">
        <Switch checked={p.featured} onCheckedChange={(v) => onToggle(p, "featured", v)} /> Featured
      </label>
      <div className="flex gap-1">
        <Button variant="outline" size="icon" aria-label={`Edit ${p.name}`} onClick={() => onEdit(p)}>
          <Pencil />
        </Button>
        <Button variant="outline" size="icon" aria-label={`Delete ${p.name}`} onClick={() => onDelete(p)} className="text-destructive">
          <Trash2 />
        </Button>
      </div>
    </li>
  );
});

export function ProductList() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [query, setQuery] = useState("");

  const [failed, setFailed] = useState(false);
  const reload = useCallback(() => {
    listProducts()
      .then(setProducts)
      .catch(() => setFailed(true));
  }, []);
  useEffect(reload, [reload]);

  const onMove = useCallback((id: string, dir: -1 | 1) => {
    setProducts((prev) => {
      if (!prev) return prev;
      const i = prev.findIndex((p) => p.id === id);
      const next = [...prev];
      [next[i], next[i + dir]] = [next[i + dir], next[i]];
      const withOrder = next.map((p, order) => ({ ...p, order }));
      saveOrder(withOrder.map((p) => p.id)).catch(() => toast.error("Could not save order"));
      return withOrder;
    });
  }, []);

  const onToggle = useCallback((p: Product, key: "visible" | "featured", v: boolean) => {
    const next = { ...p, [key]: v };
    setProducts((prev) => prev?.map((x) => (x.id === p.id ? next : x)) ?? prev);
    saveProduct(next).catch(() => {
      toast.error("Could not save");
      setProducts((prev) => prev?.map((x) => (x.id === p.id ? p : x)) ?? prev);
    });
  }, []);

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await deleteProduct(deleting);
      toast.success(`${deleting.name} deleted`);
      setProducts((prev) => prev?.filter((p) => p.id !== deleting.id) ?? prev);
    } catch {
      toast.error("Delete failed");
    }
    setDeleting(null);
  }

  if (failed && !products)
    return (
      <LoadError
        what="products"
        onRetry={() => {
          setFailed(false);
          reload();
        }}
      />
    );
  if (!products) return <RowsSkeleton />;

  const q = query.trim().toLowerCase();
  const shown = q ? products.filter((p) => `${p.name} ${p.nameHi}`.toLowerCase().includes(q)) : products;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-48 flex-1">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="h-11 pl-9" />
        </label>
        <p className="text-sm text-muted-foreground">
          {products.filter((p) => p.visible).length} of {products.length} visible
        </p>
        <Button size="lg" className="h-11" onClick={() => setEditing(emptyProduct(products.length))}>
          <Plus /> Add product
        </Button>
      </div>

      {products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gold p-10 text-center">
          <p className="font-display text-2xl text-maroon">Your catalogue is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">Start from the sample products and edit them, or add your own.</p>
          <Button className="mt-4" onClick={() => loadSampleCatalog().then(reload).catch(() => toast.error("Could not load samples"))}>
            Load sample products
          </Button>
        </div>
      )}

      <ul className="space-y-2">
        {shown.map((p, i) => (
          <Row
            key={p.id}
            product={p}
            first={q !== "" || i === 0}
            last={q !== "" || i === shown.length - 1}
            onEdit={setEditing}
            onDelete={setDeleting}
            onMove={onMove}
            onToggle={onToggle}
          />
        ))}
      </ul>

      {editing && (
        <ProductForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            reload();
          }}
        />
      )}

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>This removes it and its photo for good. To hide it for a while, turn off “Visible” instead.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
