"use client";

import { useState } from "react";
import { HeartIcon } from "./Icons";
import { MAX_SAMPLES, useStore, type Sample } from "./Store";

export function SaveButton({ slug, name }: { slug: string; name: string }) {
  const { isSaved, toggleSaved, ready } = useStore();
  const on = ready && isSaved(slug);
  return (
    <button
      type="button"
      className="heart"
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from My Fabrics` : `Save ${name} to My Fabrics`}
      onClick={() => toggleSaved(slug)}
    >
      <HeartIcon />
    </button>
  );
}

export function SampleButton({ sample, className = "quick", big = false }: { sample: Sample; className?: string; big?: boolean }) {
  const { hasSample, toggleSample, ready } = useStore();
  const [msg, setMsg] = useState("");
  const on = ready && hasSample(sample.slug);
  return (
    <>
      <button
        type="button"
        className={className}
        aria-pressed={on}
        onClick={() => {
          const r = toggleSample(sample);
          setMsg(r === "full" ? `Up to ${MAX_SAMPLES} samples per order` : "");
        }}
      >
        {on ? (big ? "Sample added ✓" : "Sample ✓") : big ? "Order sample" : "+ Sample"}
      </button>
      {msg && (
        <span className="notice" role="status" style={{ display: "block", marginTop: 4 }}>
          {msg}
        </span>
      )}
    </>
  );
}
