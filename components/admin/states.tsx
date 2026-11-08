"use client";

import { motion } from "motion/react";
import { CloudOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Placeholder rows shaped like the real list so the layout doesn't jump. */
export function RowsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <ul aria-busy className="space-y-2">
      {Array.from({ length: rows }, (_, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3"
        >
          <span className="shimmer size-14 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <span className="shimmer block h-5 w-1/3 rounded" />
            <span className="shimmer block h-3 w-1/2 rounded" />
          </div>
          <span className="shimmer hidden h-6 w-24 rounded-full sm:block" />
        </motion.li>
      ))}
    </ul>
  );
}

export function LoadError({ what, onRetry }: { what: string; onRetry: () => void }) {
  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid justify-items-center gap-3 rounded-2xl border border-dashed border-destructive/40 bg-card p-10 text-center"
    >
      <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
        <CloudOff className="size-7" />
      </motion.span>
      <p className="font-display text-2xl text-maroon">Couldn&apos;t load {what}</p>
      <p className="max-w-sm text-sm text-muted-foreground">Check the internet connection. If it keeps failing, sign out and back in.</p>
      <Button onClick={onRetry}>
        <RotateCcw /> Try again
      </Button>
    </motion.div>
  );
}
