# Banke Bihari Atta Chakki

Showcase site for the shop's atta, dals, besan and masale, plus an admin panel to manage the listing. No prices and no cart: visitors browse, then ask on WhatsApp or call.

Built with Next.js 16, Tailwind v4, shadcn/ui, Motion, and Firebase (Auth + Firestore). Everything runs on free tiers: Vercel Hobby and the Firebase Spark plan.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the site and http://localhost:3000/admin for the admin.

With no `.env.local`, the site shows the sample catalogue and the admin runs in **demo mode**: changes are saved in your browser only. That's enough to try everything out.

## Go live with Firebase (free)

1. Go to https://console.firebase.google.com and create a project. Google Analytics isn't needed.
2. **Firestore**: Build → Firestore Database → Create database (production mode, any region near India, e.g. `asia-south1`).
3. **Rules**: Firestore → Rules. Paste `firestore.rules` from this repo, replace `owner@example.com` with the owner's email, and Publish.
4. **Login**: Build → Authentication → Get started → enable **Email/Password**. On the Users tab, add the owner's account with the same email as in the rules.
5. **Web config**: Project settings → General → Your apps → Add app → Web. Copy the values into `.env.local` using the names in `.env.example`.
6. Run `npm run dev`, open `/admin`, sign in, and click **Load sample products**, or add your own.

Firebase Storage is not used because new Storage buckets need the paid Blaze plan. Uploaded photos are shrunk to WebP in the browser and stored in Firestore (`images/{productId}`), then served through `/api/img/[id]`.

## Deploy on Vercel (free)

1. Push this folder to a GitHub repo.
2. On https://vercel.com, import the repo.
3. Add the four `NEXT_PUBLIC_FIREBASE_*` variables under Settings → Environment Variables, then deploy.
4. In Firebase → Authentication → Settings → Authorized domains, add the Vercel domain.

Changes made in the admin appear on the live site within about a minute, because the catalogue is cached for 60 seconds.

## Where things are

| Path | What it is |
| --- | --- |
| `app/page.tsx` | Home page: hero, marquee, products, stats, process, visit |
| `components/site/` | Public site sections and the SVG pack art |
| `app/admin/`, `components/admin/` | Admin: login, product list, product form, shop details |
| `components/admin/store.ts` | Every admin read and write (Firestore, or localStorage in demo mode) |
| `lib/seed.ts` | Sample products and default shop details |
| `lib/types.ts` | Product and settings types, plus the category list and colours |
| `firestore.rules` | Security rules: anyone can read, only the owner's email can write |

## Editing

- **Products**: add, edit, hide/show, feature, reorder and delete in `/admin`. Products without a photo get a branded pack illustration in the grain colour you pick.
- **Shop details**: phone, WhatsApp, address, hours, map location, "since" year and the families count, under `/admin` → Shop details.
- **Categories**: edit `CATEGORIES` in `lib/types.ts`.
