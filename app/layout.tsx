import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BasketSheet } from "@/components/BasketSheet";
import { Header } from "@/components/Header";
import { StoreProvider } from "@/components/Store";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://madaboutfabrics.com"),
  title: { default: "Mad About Fabrics | Curtain & Upholstery Fabric, Belfast", template: "%s | Mad About Fabrics" },
  description:
    "Over 1,200 curtain, upholstery and tablecloth fabrics from Mad About Fabrics, Belfast. Filter by colour, pattern, texture and use, and order free samples.",
};

export const viewport: Viewport = { themeColor: "#060a1f", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <StoreProvider>
          <Suspense fallback={<div className="site-header" style={{ height: 170 }} />}>
            <Header />
          </Suspense>
          <main>{children}</main>
          <BasketSheet />
          <footer className="site-footer">
            <div className="cols">
              <div>
                <div className="logo">
                  <small>Mad About</small> <span>Fabrics</span>
                </div>
                <p style={{ opacity: 0.75, marginTop: 14 }}>Fabric specialists in Belfast. Curtains, upholstery and everything in between.</p>
              </div>
              <div>
                <h4>Shop in store</h4>
                <p>
                  16–18 Duncrue Industrial Estate
                  <br />
                  Dargan Crescent, Belfast BT3 9JP
                </p>
              </div>
              <div>
                <h4>Shop</h4>
                <p>
                  <Link href="/fabrics">All fabrics</Link>
                  <br />
                  <Link href="/fabrics?usage=curtain-fabric">Curtain fabric</Link>
                  <br />
                  <Link href="/fabrics?usage=upholstery-fabric">Upholstery fabric</Link>
                  <br />
                  <Link href="/saved">My Fabrics</Link>
                </p>
              </div>
              <div>
                <h4>Contact</h4>
                <p>
                  <a href="mailto:hello@madaboutfabrics.com">hello@madaboutfabrics.com</a>
                  <br />
                  <Link href="/contact">Visit &amp; opening hours</Link>
                </p>
              </div>
            </div>
            <div className="fine">© {new Date().getFullYear()} Mad About Fabrics · Preview of the new site</div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
