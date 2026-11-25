"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Opt = { slug: string; name: string; count?: number; children?: Opt[] };
export type FacetOptions = { colour: Opt[]; pattern: Opt[]; type: Opt[]; usage: Opt[] };
type Current = { colour: string[]; pattern: string[]; type: string[]; usage: string[]; q: string };

const LABELS = { colour: "Colour", pattern: "Pattern", type: "Texture & type", usage: "Use" } as const;

const label = (o: Opt) => (o.count != null ? `${o.name} (${o.count})` : o.name);

export function FilterForm({
  options,
  current,
  title = "Filter Fabrics",
  intro = "Find the perfect fabric for you in four easy steps",
  showKeyword = true,
  onDone,
}: {
  options: FacetOptions;
  current: Current;
  title?: string;
  intro?: string;
  showKeyword?: boolean;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [v, setV] = useState({
    colour: current.colour[0] ?? "",
    pattern: current.pattern[0] ?? "",
    type: current.type[0] ?? "",
    usage: current.usage[0] ?? "",
    q: current.q,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    for (const k of ["colour", "pattern", "type", "usage", "q"] as const) if (v[k].trim()) p.set(k, v[k].trim());
    onDone?.();
    router.push("/fabrics" + (p.toString() ? "?" + p : ""));
  };

  const select = (k: keyof FacetOptions) => (
    <div className="field" key={k}>
      <label htmlFor={`f-${k}`}>{LABELS[k]}</label>
      <select id={`f-${k}`} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })}>
        <option value="">Any {LABELS[k].toLowerCase()}</option>
        {options[k].map((o) =>
          o.children && o.children.length ? (
            <optgroup key={o.slug} label={o.name}>
              <option value={o.slug} disabled={o.count === 0}>
                {"All " + label(o).replace(/^All /, "")}
              </option>
              {o.children.map((c) => (
                <option key={c.slug} value={c.slug} disabled={c.count === 0}>
                  {label(c)}
                </option>
              ))}
            </optgroup>
          ) : (
            <option key={o.slug} value={o.slug} disabled={o.count === 0}>
              {label(o)}
            </option>
          ),
        )}
      </select>
    </div>
  );

  return (
    <form className="filter-form" onSubmit={submit}>
      <h2>{title}</h2>
      <p className="intro">{intro}</p>
      {select("usage")}
      {select("colour")}
      {select("pattern")}
      {select("type")}
      {showKeyword && (
        <div className="field keyword">
          <label htmlFor="f-q">Keyword (optional)</label>
          <input id="f-q" type="search" value={v.q} placeholder="e.g. linen, velvet, Foxford" onChange={(e) => setV({ ...v, q: e.target.value })} />
        </div>
      )}
      <div className="actions">
        <button className="btn light" type="submit">
          Search
        </button>
        <Link href="/fabrics" className="btn ghost-light" onClick={onDone}>
          Reset
        </Link>
      </div>
    </form>
  );
}
