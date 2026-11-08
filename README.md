# Banke Bihari Atta Chakki

Showcase site for the shop's atta, dals, besan and masale, plus an admin panel to manage the listing. No prices and no cart: visitors browse, then ask on WhatsApp or call.

Built with Next.js 16, Tailwind v4, shadcn/ui, Motion, and Firebase (Auth + Firestore). Everything runs on free tiers: Vercel Hobby and the Firebase Spark plan.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for the admin.

## Firebase

The site uses the Firebase project `atta-project-7d7aa`. Its web config is in `lib/firebase.ts`. That config is public by design, and `firestore.rules` is what protects the data.

- **Login:** Authentication → Users. Only emails listed in `firestore.rules` can edit.
- **Rules:** after changing `firestore.rules`, paste it into Firestore → Rules and click Publish.
- **Photos:** Firebase Storage needs the paid Blaze plan, so it isn't used. Uploaded photos are shrunk to WebP in the browser and stored in Firestore (`images/{productId}`), then served through `/api/img/[id]`.

## Deploy on Vercel (free)

1. Push this folder to a GitHub repo and import it on https://vercel.com. No environment variables are needed.
2. In Firebase → Authentication → Settings → Authorized domains, add the Vercel domain (for example `your-app.vercel.app`) so the admin login works there.

Changes made in the admin appear on the live site within about a minute, because the catalogue is cached for 60 seconds.

## Where things are

| Path | What it is |
| --- | --- |
| `app/page.tsx` | Home page: hero, marquee, products, stats, process, visit |
| `components/site/` | Public site sections and the SVG pack art |
| `app/admin/`, `components/admin/` | Admin: login, product list, product form, shop details |
| `components/admin/store.ts` | Every admin read and write to Firebase |
| `lib/seed.ts` | Sample products and default shop details |
| `lib/types.ts` | Product and settings types, plus the category list and colours |
| `firestore.rules` | Security rules: anyone can read, only the owner's email can write |

## Editing

- **Products**: add, edit, hide/show, feature, reorder and delete in `/admin`. Products without a photo get a branded pack illustration in the grain colour you pick.
- **Shop details**: phone, WhatsApp, address, hours, map location, "since" year and the families count, under `/admin` → Shop details.
- **Categories**: edit `CATEGORIES` in `lib/types.ts`.
