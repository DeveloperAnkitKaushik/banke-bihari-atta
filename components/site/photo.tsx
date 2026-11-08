"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type State = "loading" | "loaded" | "error";

/**
 * Remote photo with a shimmer while loading, a fade-in once ready, and `fallback`
 * if the image fails (e.g. a stock photo removed upstream). Fills its positioned parent.
 */
export function Photo({ src, alt = "", className, fallback, eager }: { src: string; alt?: string; className?: string; fallback: ReactNode; eager?: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<State>("loading");

  // an image cached by the browser can finish before hydration, so onLoad never fires
  useEffect(() => {
    const img = ref.current;
    if (img?.complete) setState(img.naturalWidth > 0 ? "loaded" : "error");
  }, [src]);

  if (state === "error") return <>{fallback}</>;
  return (
    <>
      {state === "loading" && <span aria-hidden className="shimmer absolute inset-0" />}
      {/* eslint-disable-next-line @next/next/no-img-element -- sources are already resized (Unsplash CDN or webp upload) */}
      <img
        ref={ref}
        src={src}
        alt={alt}
        draggable={false}
        loading={eager ? "eager" : "lazy"}
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
        className={cn("absolute inset-0 size-full object-cover transition-[opacity,filter,transform] duration-700", state === "loaded" ? "opacity-100 blur-0" : "opacity-0 blur-md", className)}
      />
    </>
  );
}
