"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { primaryBtn, secondaryBtn, StatusScreen } from "@/components/site/status-screen";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StatusScreen code="उफ़!" title="चक्की थोड़ी अटक गई" text="Something went wrong while loading. Check your internet and try again.">
      <button type="button" onClick={reset} className={primaryBtn}>
        <RotateCcw className="size-4" /> Try again
      </button>
      <Link href="/" className={secondaryBtn}>
        Home
      </Link>
    </StatusScreen>
  );
}
