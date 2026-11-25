"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { SampleButton } from "./Buttons";
import { useStore } from "./Store";

export function BuyBox({
  slug,
  name,
  image,
  pricePence,
  inStock,
}: {
  slug: string;
  name: string;
  image: string | null;
  pricePence: number;
  inStock: boolean;
}) {
  const { addLine } = useStore();
  const [m, setM] = useState(1);
  const step = (d: number) => setM((x) => Math.max(0.5, Math.min(100, x + d)));
  return (
    <>
      <div className="stepper" role="group" aria-label="Metres">
        <button type="button" aria-label="Fewer metres" onClick={() => step(-0.5)} disabled={m <= 0.5}>
          −
        </button>
        <output aria-live="polite">
          <b>{m}</b> {m === 1 ? "metre" : "metres"}
        </output>
        <button type="button" aria-label="More metres" onClick={() => step(0.5)}>
          +
        </button>
      </div>
      <div className="actions">
        <button
          type="button"
          className="btn block"
          disabled={!inStock}
          onClick={() => addLine({ slug, name, image, price_pence: pricePence, metres: m })}
        >
          {inStock ? `Add to basket · ${formatPrice(Math.round(pricePence * m))}` : "Out of stock"}
        </button>
        <SampleButton sample={{ slug, name, image }} className="btn block outline" big />
      </div>
    </>
  );
}
