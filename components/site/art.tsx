import type { SVGProps } from "react";
import { categoryOf, type Product } from "@/lib/types";

/** WhatsApp brand glyph (lucide has no brand icons). */
export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.5 2 2 6.47 2 11.98c0 1.76.46 3.48 1.34 5L2 22l5.15-1.34a10.06 10.06 0 0 0 4.89 1.25h.01c5.53 0 10.03-4.47 10.03-9.98A9.95 9.95 0 0 0 12.04 2zm0 18.23h-.01a8.36 8.36 0 0 1-4.26-1.16l-.31-.18-3.06.8.82-2.97-.2-.31a8.2 8.2 0 0 1-1.27-4.43c0-4.58 3.75-8.3 8.3-8.3 2.22 0 4.3.86 5.87 2.43a8.22 8.22 0 0 1 2.43 5.87c0 4.58-3.74 8.25-8.31 8.25z" />
    </svg>
  );
}

export function Grain({ color = "#d9a441", ...props }: SVGProps<SVGSVGElement> & { color?: string }) {
  return (
    <svg viewBox="0 0 20 32" aria-hidden {...props}>
      <ellipse cx="10" cy="16" rx="8" ry="14" fill={color} />
      <path d="M10 4 Q7 16 10 28" stroke="#000" strokeOpacity=".18" strokeWidth="1.4" fill="none" />
      <ellipse cx="7" cy="11" rx="2" ry="5" fill="#fff" fillOpacity=".35" />
    </svg>
  );
}

export function WheatStalk(props: SVGProps<SVGSVGElement>) {
  const grains = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 60 220" aria-hidden {...props}>
      <path d="M30 220 Q28 140 30 60" stroke="#b8862b" strokeWidth="3" fill="none" />
      {grains.map((i) => (
        <g key={i} transform={`translate(30 ${70 + i * 18})`}>
          <ellipse cx="-9" cy="-6" rx="6" ry="11" transform="rotate(-28)" fill="#d9a441" />
          <ellipse cx="9" cy="-6" rx="6" ry="11" transform="rotate(28)" fill="#c9962b" />
        </g>
      ))}
      <ellipse cx="30" cy="52" rx="6" ry="12" fill="#e2b25a" />
      {grains.map((i) => (
        <path key={i} d={`M${i % 2 ? 36 : 24} ${60 + i * 18} l${i % 2 ? 14 : -14} -40`} stroke="#c9962b" strokeWidth="1" />
      ))}
    </svg>
  );
}

/** Top-down stone chakki: grooved upper stone with a wooden handle. */
export function Chakki(props: SVGProps<SVGSVGElement>) {
  const grooves = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 200 200" aria-hidden {...props}>
      <defs>
        <radialGradient id="stone" cx="40%" cy="35%">
          <stop offset="0" stopColor="#a39a8e" />
          <stop offset=".7" stopColor="#7d7469" />
          <stop offset="1" stopColor="#5c544b" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#stone)" stroke="#4a433b" strokeWidth="3" />
      {grooves.map((a) => (
        <path key={a} d="M100 100 L100 14" transform={`rotate(${a} 100 100)`} stroke="#4a433b" strokeOpacity=".35" strokeWidth="2" />
      ))}
      <circle cx="100" cy="100" r="62" fill="none" stroke="#4a433b" strokeOpacity=".3" strokeDasharray="4 6" />
      <circle cx="100" cy="100" r="18" fill="#3b342d" />
      <circle cx="100" cy="100" r="11" fill="#e2b25a" />
      <circle cx="100" cy="30" r="10" fill="#6b3b1d" stroke="#3b200f" strokeWidth="2" />
      <circle cx="97" cy="27" r="3" fill="#a7653a" />
    </svg>
  );
}

export function ProductVisual({ product, className }: { product: Product; className?: string }) {
  return product.photos[0] ? (
    // eslint-disable-next-line @next/next/no-img-element -- sources are already resized (Unsplash CDN or webp upload)
    <img src={product.photos[0]} alt={product.name} className={`object-cover ${className ?? ""}`} loading="lazy" />
  ) : (
    <Pack product={product} className={className} />
  );
}

/** Branded pouch illustration, used until the owner uploads a real photo. */
export function Pack({ product, className }: { product: Pick<Product, "id" | "name" | "nameHi" | "category" | "color" | "sizes">; className?: string }) {
  const cat = categoryOf(product.category);
  const id = `p-${product.id}`;
  const grain = product.color || cat.grain;
  const hiSize = product.nameHi.length > 10 ? 17 : 22;
  return (
    <svg viewBox="0 0 220 300" className={className} role="img" aria-label={product.name}>
      <defs>
        <linearGradient id={`${id}-shade`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".35" />
          <stop offset=".25" stopColor="#000" stopOpacity="0" />
          <stop offset=".4" stopColor="#fff" stopOpacity=".18" />
          <stop offset=".55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".3" />
        </linearGradient>
        <pattern id={`${id}-grain`} width="16" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <ellipse cx="4" cy="5" rx="3.6" ry="2.3" fill={grain} />
          <ellipse cx="12" cy="1" rx="3.6" ry="2.3" fill={grain} opacity=".8" />
          <ellipse cx="12" cy="10" rx="3.6" ry="2.3" fill={grain} opacity=".9" />
        </pattern>
      </defs>
      <ellipse cx="110" cy="292" rx="80" ry="6" fill="#000" opacity=".15" />
      <path d="M32 32 H188 L196 260 Q196 286 170 286 H50 Q24 286 24 260 Z" fill={cat.color} />
      <rect x="44" y="200" width="132" height="66" rx="16" fill="#fff8e6" />
      <rect x="44" y="200" width="132" height="66" rx="16" fill={`url(#${id}-grain)`} />
      <rect x="44" y="200" width="132" height="66" rx="16" fill="none" stroke="#c9962b" strokeWidth="2.5" />
      <rect x="44" y="58" width="132" height="132" rx="16" fill="#fbf5e6" stroke="#c9962b" strokeWidth="2" />
      <image href="/logo.webp" x="54" y="62" width="112" height="74" preserveAspectRatio="xMidYMid meet" />
      <text x="110" y="163" textAnchor="middle" fontSize={hiSize} fill="#6e1518" style={{ fontFamily: "var(--font-display)" }}>
        {product.nameHi}
      </text>
      <text x="110" y="180" textAnchor="middle" fontSize="9.5" letterSpacing="1.2" fill="#6f5a48" style={{ fontFamily: "var(--font-body)", textTransform: "uppercase" }}>
        {product.name}
      </text>
      <path d="M32 32 H188 L196 260 Q196 286 170 286 H50 Q24 286 24 260 Z" fill={`url(#${id}-shade)`} />
      <rect x="28" y="14" width="164" height="24" rx="4" fill="#c9962b" />
      {Array.from({ length: 20 }, (_, i) => (
        <rect key={i} x={34 + i * 8} y="17" width="3" height="18" fill="#000" opacity=".12" />
      ))}
      <rect x="28" y="14" width="164" height="24" rx="4" fill={`url(#${id}-shade)`} />
      {product.sizes[0] && (
        <g>
          <rect x="140" y="44" width="58" height="22" rx="11" fill="#1d4d2b" stroke="#c9962b" />
          <text x="169" y="59" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fbf5e6" style={{ fontFamily: "var(--font-body)" }}>
            {product.sizes[0]}
          </text>
        </g>
      )}
    </svg>
  );
}
