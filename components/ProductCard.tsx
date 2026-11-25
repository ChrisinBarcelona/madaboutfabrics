import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductCard as P } from "@/lib/data";
import { SampleButton, SaveButton } from "./Buttons";

export function ProductCard({ p, priority = false }: { p: P; priority?: boolean }) {
  const sale = p.sale_price_pence != null && p.sale_price_pence < p.price_pence;
  return (
    <article className="card">
      <Link href={`/fabric/${p.slug}`} className="media" aria-label={p.name}>
        {!p.in_stock && <span className="out">Out of stock</span>}
        {p.image_url && (
          <Image
            className="first"
            src={p.image_url}
            alt={p.name}
            fill
            sizes="(min-width:1280px) 22vw, (min-width:700px) 30vw, 46vw"
            priority={priority}
          />
        )}
        {p.image_url_2 && (
          <Image className="second" src={p.image_url_2} alt="" fill sizes="(min-width:1280px) 22vw, (min-width:700px) 30vw, 46vw" />
        )}
      </Link>
      <div className="save">
        <SaveButton slug={p.slug} name={p.name} />
      </div>
      <div className="info">
        {p.design && <div className="design">{p.design}</div>}
        <Link href={`/fabric/${p.slug}`} className="name">
          {p.name}
        </Link>
        <div className="price">
          {sale ? (
            <>
              <span style={{ color: "var(--sale)" }}>{formatPrice(p.sale_price_pence!)}</span>{" "}
              <s className="muted">{formatPrice(p.price_pence)}</s>
            </>
          ) : (
            formatPrice(p.price_pence)
          )}{" "}
          <small>per metre</small>
        </div>
        <SampleButton sample={{ slug: p.slug, name: p.name, image: p.image_url }} />
      </div>
    </article>
  );
}
