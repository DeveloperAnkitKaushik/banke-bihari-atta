"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Loader2, LogOut } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChakkiLoader } from "@/components/site/loader";
import { ProductList } from "./product-list";
import { SettingsForm } from "./settings-form";
import { ADMIN_EMAILS, login, loginWithGoogle, logout, watchUser } from "./store";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.29 14.28a7.2 7.2 0 0 1 0-4.56v-3.1H1.28a12 12 0 0 0 0 10.76l4.01-3.1z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.28 6.62l4.01 3.1C6.23 6.88 8.88 4.77 12 4.77z" />
    </svg>
  );
}

function Login() {
  const [busy, setBusy] = useState(false);
  async function onGoogle() {
    setBusy(true);
    try {
      await loginWithGoogle();
    } catch (e) {
      const code = typeof e === "object" && e && "code" in e ? String(e.code) : "";
      if (code === "auth/operation-not-allowed") toast.error("Turn on Google sign-in in Firebase → Authentication → Sign-in method");
      else if (code !== "auth/popup-closed-by-user") toast.error("Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }
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
        <Button type="button" variant="outline" size="lg" className="h-12 gap-3 bg-card text-base" disabled={busy} onClick={onGoogle}>
          <GoogleLogo /> Continue with Google
        </Button>
        <p className="flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">or with email</p>
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

  if (email === undefined)
    return (
      <main className="grid min-h-dvh place-items-center">
        <ChakkiLoader label="Checking login…" />
      </main>
    );
  if (email === null) return <Login />;
  if (!ADMIN_EMAILS.includes(email.toLowerCase()))
    return (
      <main className="grid min-h-dvh place-items-center p-4 text-center">
        <div className="grid max-w-sm gap-4 rounded-3xl border border-border bg-card p-8 shadow-xl">
          <p className="font-display text-2xl text-maroon">No admin access</p>
          <p className="text-sm text-muted-foreground">{email} isn&apos;t an admin for this site.</p>
          <Button variant="outline" onClick={() => logout()}>
            <LogOut /> Use another account
          </Button>
        </div>
      </main>
    );

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
