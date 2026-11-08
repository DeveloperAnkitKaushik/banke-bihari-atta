"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Loader2, LogOut } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductList } from "./product-list";
import { SettingsForm } from "./settings-form";
import { login, logout, watchUser } from "./store";

function Login() {
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await login(String(form.get("email")), String(form.get("password")));
    } catch {
      toast.error("Wrong email or password");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <form onSubmit={onSubmit} className="grid w-full max-w-sm gap-4 rounded-3xl border border-border bg-card p-8 shadow-xl">
        <Image src="/logo.webp" alt="Banke Bihari Atta Chakki" width={240} height={160} priority className="mx-auto h-28 w-auto" />
        <h1 className="text-center font-display text-2xl text-maroon">Admin login</h1>
        <label className="grid gap-1.5 text-sm">
          Email
          <Input name="email" type="email" required autoComplete="username" className="h-11" />
        </label>
        <label className="grid gap-1.5 text-sm">
          Password
          <Input name="password" type="password" required autoComplete="current-password" className="h-11" />
        </label>
        <Button type="submit" size="lg" className="h-11" disabled={busy}>
          {busy && <Loader2 className="animate-spin" />} Sign in
        </Button>
      </form>
    </main>
  );
}

export function AdminApp() {
  // undefined = still checking, null = signed out
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  useEffect(() => watchUser(setEmail), []);

  if (email === undefined) return <p className="grid min-h-dvh place-items-center text-muted-foreground">Loading…</p>;
  if (email === null) return <Login />;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-border bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2">
          <Image src="/logo.webp" alt="" width={84} height={56} className="h-12 w-auto" />
          <p className="font-display text-xl text-maroon">Admin</p>
          <span className="ml-auto hidden truncate text-sm text-muted-foreground sm:block">{email}</span>
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/" target="_blank" />}>
            <ExternalLink /> Site
          </Button>
          <Button variant="ghost" size="sm" onClick={() => logout()}>
            <LogOut /> Sign out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Tabs defaultValue="products">
          <TabsList className="mb-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="settings">Shop details</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ProductList />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
