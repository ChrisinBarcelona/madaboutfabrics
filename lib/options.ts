import type { Category, Facet } from "./data";
import type { FacetOptions } from "@/components/FilterForm";

/** Turn categories (+ optional result counts) into the four dropdowns. */
export function buildOptions(cats: Category[], counts?: Record<string, number>): FacetOptions {
  const ids = new Set(cats.map((c) => c.id));
  const out = { colour: [], pattern: [], type: [], usage: [] } as FacetOptions;
  for (const f of ["colour", "pattern", "type", "usage"] as Facet[]) {
    const top = cats.filter((c) => c.facet === f && (!c.parent_id || !ids.has(c.parent_id)));
    out[f] = top
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        count: counts?.[c.slug],
        children: cats
          .filter((k) => k.parent_id === c.id)
          .map((k) => ({ slug: k.slug, name: k.name, count: counts?.[k.slug] }))
          .sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.replace(/^(All|The) /, "").localeCompare(b.name.replace(/^(All|The) /, "")));
  }
  return out;
}

/** Friendly name for a selected slug. */
export function nameFor(cats: Category[], slug: string) {
  return cats.find((c) => c.slug === slug)?.name ?? slug.replace(/-/g, " ");
}
