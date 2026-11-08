"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Settings } from "@/lib/types";
import { LoadError, RowsSkeleton } from "./states";
import { getSettings, saveSettings } from "./store";

const FIELDS: { key: keyof Settings; label: string; hint?: string }[] = [
  { key: "phone", label: "Phone (shown on site)", hint: "+91 98765 43210" },
  { key: "whatsapp", label: "WhatsApp number", hint: "With country code, digits only: 919876543210" },
  { key: "address", label: "Shop address" },
  { key: "hours", label: "Opening hours", hint: "Mon–Sun · 7:00 AM – 9:00 PM" },
  { key: "mapQuery", label: "Google Maps search", hint: "Shop name + area, exactly as it appears on Google Maps" },
  { key: "since", label: "Running since (year)", hint: "1998" },
  { key: "families", label: "Happy families (number)", hint: "5000" },
];

export function SettingsForm() {
  const [s, setS] = useState<Settings | null>(null);
  const [failed, setFailed] = useState(false);
  const load = () =>
    getSettings()
      .then(setS)
      .catch(() => setFailed(true));
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    load();
  }, []);

  if (failed && !s)
    return (
      <LoadError
        what="shop details"
        onRetry={() => {
          setFailed(false);
          load();
        }}
      />
    );
  if (!s) return <RowsSkeleton rows={4} />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!s) return;
    const clean = { ...s, whatsapp: s.whatsapp.replace(/\D/g, "") };
    if (clean.whatsapp.length < 11) return toast.error("WhatsApp number needs the country code, e.g. 91XXXXXXXXXX");
    if (!/^\d{4}$/.test(clean.since)) return toast.error("“Running since” should be a year like 1998");
    setBusy(true);
    try {
      await saveSettings(clean);
      setS(clean);
      toast.success("Settings saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-2xl gap-4 rounded-2xl border border-border bg-card p-5 sm:p-8">
      {FIELDS.map(({ key, label, hint }) => (
        <label key={key} className="grid gap-1.5">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
          <Input className="h-11" value={s[key]} onChange={(e) => setS({ ...s, [key]: e.target.value })} />
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </label>
      ))}
      <Button type="submit" size="lg" className="h-11 justify-self-start" disabled={busy}>
        {busy && <Loader2 className="animate-spin" />} Save settings
      </Button>
    </form>
  );
}
