import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/BuyBox";
import { SaveButton } from "@/components/Buttons";
import { Gallery } from "@/components/Gallery";
import { formatPrice, getColourways, getProduct } from "@/lib/data";

export const revalidate = 300;
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return { title: "Fabric not found" };
  const price = formatPrice(p.sale_price_pence ?? p.price_pence);
  return {
    title: `${p.name} fabric`,
    description: `${p.name}${p.composition ? ` — ${p.composition}` : ""}. ${price} per metre. Order a sample from Mad About Fabrics, Belfast.`,
    openGraph: { images: p.images[0] ? [p.images[0].url] : [] },
  };
}

export default async function FabricPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();
  const colourways = await getColourways(p.design, p.slug);
  const price = p.sale_price_pence ?? p.price_pence;
  const onSale = p.sale_price_pence != null && p.sale_price_pence < p.price_pence;
  const uses = p.categories.filter((c) => c.facet === "usage");
  const tags = p.categories.filter((c) => c.facet && c.facet !== "usage" && !/^All /.test(c.name));
  const self = { slug: p.slug, name: p.name, colour_name: p.colour_name, image: p.images[0]?.url ?? null };
  const allColours = [self, ...colourways].sort((a, b) => a.name.localeCompare(b.name));

  const spec: [string, string | null][] = [
    ["Fabric", p.name],
    ["Design", p.design],
    ["Colour", p.colour_name],
    ["Composition", p.composition?.replace(/\s*\|\s*/g, ", ") ?? null],
    ["Width", p.width],
    ["Pattern repeat", p.pattern_repeat],
    ["Care", p.care],
    ["Product code", p.sku],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku ?? undefined,
    image: p.images.map((i) => i.url),
    brand: { "@type": "Brand", name: "Mad About Fabrics" },
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: (price / 100).toFixed(2),
      availability: p.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      unitText: "metre",
    },
  };

  return (
    <div className="pdp">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pdp-inner">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/fabrics">‹ Back to fabrics</Link>
          {uses[0] && (
            <>
              <span>/</span>
              <Link href={`/fabrics?usage=${uses[0].slug}`}>{uses[0].name}</Link>
            </>
          )}
        </nav>

        <div className="range-head">
          <h2 className="range-title">{p.design ?? p.name}</h2>
          <span className="caps muted">Range · {allColours.length} {allColours.length === 1 ? "colour" : "colours"}</span>
        </div>

        <div>
          <Gallery images={p.images} name={p.name} />
        </div>

        <div className="buy">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <h1>{p.colour_name ?? p.name}</h1>
              <div className="price">
                {formatPrice(price)}
                {onSale && <s>{formatPrice(p.price_pence)}</s>}
              </div>
              <div className="per">Per metre</div>
            </div>
            <SaveButton slug={p.slug} name={p.name} />
          </div>
          <span className={p.in_stock ? "stock" : "stock no"}>{p.in_stock ? "In stock" : "Out of stock"}</span>
          {p.description && <p className="desc">{p.description}</p>}

          <BuyBox slug={p.slug} name={p.name} image={p.images[0]?.url ?? null} pricePence={price} inStock={p.in_stock} />

          {allColours.length > 1 && (
            <div className="colourways">
              <h2>Select your colour</h2>
              <div className="swatches">
                {allColours.map((c) => (
                  <Link key={c.slug} href={`/fabric/${c.slug}`} aria-current={c.slug === p.slug} title={c.colour_name ?? c.name} aria-label={c.name}>
                    {c.image && <Image src={c.image} alt="" width={44} height={44} />}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="spec">
            <h2>Fabric composition</h2>
            <table>
              <tbody>
                {spec
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <tr key={k}>
                      <th scope="row">{k}</th>
                      <td>{v}</td>
                    </tr>
                  ))}
                {uses.length > 0 && (
                  <tr>
                    <th scope="row">Use</th>
                    <td>
                      <div className="uses" style={{ marginTop: 0 }}>
                        {uses.map((u) => (
                          <Link key={u.slug} href={`/fabrics?usage=${u.slug}`}>
                            {u.name.replace(/ Fabric$/, "")}
                          </Link>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {tags.length > 0 && (
            <div className="colourways">
              <h2>More like this</h2>
              <div className="tag-links">
                {tags.map((t) => (
                  <Link key={t.slug} href={`/fabrics?${t.facet}=${t.slug}`}>
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
