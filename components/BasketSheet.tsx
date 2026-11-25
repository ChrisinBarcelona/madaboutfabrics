"use client";

import Link from "next/link";
import { useEffect } from "react";
import { formatPrice } from "@/lib/format";
import { CartIcon, CloseIcon } from "./Icons";
import { MAX_SAMPLES, useStore } from "./Store";

export function BasketSheet() {
  const { open, setOpen, lines, samples, setMetres, removeLine, toggleSample, totalPence } = useStore();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;
  return (
    <>
      <div className="scrim" onClick={() => setOpen(false)} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Basket">
        <div className="grab" />
        <div className="sheet-head">
          <CartIcon />
          <div>
            Basket ({lines.length})<br />
            Total {formatPrice(totalPence)}
          </div>
          <button className="icon-btn close" aria-label="Close basket" onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 && samples.length === 0 && (
          <p className="muted" style={{ textAlign: "center", padding: "30px 0" }}>
            Your basket is empty.
          </p>
        )}

        {lines.map((l) => (
          <div className="line" key={l.slug}>
            {l.image ? <img src={l.image} alt="" /> : <div />}
            <div>
              <Link href={`/fabric/${l.slug}`} className="t" onClick={() => setOpen(false)}>
                {l.name}
              </Link>
              <div className="muted" style={{ fontSize: 12 }}>
                {formatPrice(l.price_pence)} per metre · {formatPrice(Math.round(l.price_pence * l.metres))}
              </div>
              <div className="mini-stepper">
                <button aria-label="Less" onClick={() => setMetres(l.slug, l.metres - 0.5)} disabled={l.metres <= 0.5}>
                  −
                </button>
                <span>{l.metres} m</span>
                <button aria-label="More" onClick={() => setMetres(l.slug, l.metres + 0.5)}>
                  +
                </button>
              </div>
              <button className="remove" onClick={() => removeLine(l.slug)}>
                Remove
              </button>
            </div>
          </div>
        ))}

        {samples.length > 0 && (
          <>
            <h3>
              Samples ({samples.length} of {MAX_SAMPLES})
            </h3>
            {samples.map((s) => (
              <div className="line" key={s.slug}>
                {s.image ? <img src={s.image} alt="" /> : <div />}
                <div>
                  <Link href={`/fabric/${s.slug}`} className="t" onClick={() => setOpen(false)}>
                    {s.name}
                  </Link>
                  <div className="muted" style={{ fontSize: 12 }}>
                    Sample
                  </div>
                  <button className="remove" onClick={() => toggleSample(s)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        <div style={{ marginTop: 22 }}>
          <button className="btn block" disabled title="Checkout opens in the next phase">
            Continue to checkout
          </button>
          <p className="notice" style={{ marginTop: 8 }}>
            Preview site: checkout with card and Apple Pay arrives in the next phase.
          </p>
        </div>
      </div>
    </>
  );
}
