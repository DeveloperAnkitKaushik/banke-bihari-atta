import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Photos live in Firestore as compressed data URLs (Firebase Storage needs the paid plan).
export async function GET(_req: Request, ctx: RouteContext<"/api/img/[id]">) {
  const { id } = await ctx.params;
  const snap = await getDoc(doc(db, "images", id));
  const match = /^data:(image\/[a-z+]+);base64,(.+)$/.exec(String(snap.data()?.data ?? ""));
  if (!match) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(match[2], "base64"), {
    headers: {
      "Content-Type": match[1],
      // every upload gets a new document id, so a URL never changes content
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
