import Link from "next/link";
import { primaryBtn, StatusScreen } from "@/components/site/status-screen";

export default function NotFound() {
  return (
    <StatusScreen code="404" title="यह पन्ना नहीं मिला" text="This page doesn't exist. The atta, dals and masale are all on the home page.">
      <Link href="/" className={primaryBtn}>
        Go home
      </Link>
      <Link href="/#products" className="inline-flex min-h-12 items-center px-4 font-semibold text-maroon underline-offset-4 hover:underline">
        See products
      </Link>
    </StatusScreen>
  );
}
