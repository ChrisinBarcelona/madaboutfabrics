import { cache } from "react";
import { db } from "./supabase";

export type Facet = "colour" | "pattern" | "type" | "usage";
export const FACETS: { key: Facet; label: string; hint: string }[] = [
  { key: "colour", label: "Colour", hint: "Any colour" },
  { key: "pattern", label: "Pattern", hint: "Any pattern" },
  { key: "type", label: "Texture & Type", hint: "Any type" },
  { key: "usage", label: "Use", hint: "Any use" },
];

export type Category = {
  id: number;
  slug: string;
  name: string;
  parent_id: number | null;
  facet: Facet | null;
};

export type ProductCard = {
  id: number;
  slug: string;
  name: string;
  design: string | null;
  price_pence: number;
  sale_price_pence: number | null;
  in_stock: boolean;
  image_url: string | null;
  image_url_2: string | null;
  total_count: number;
};

export type Filters = {
  colour: string[];
  pattern: string[];
  type: string[];
  usage: string[];
  q: string;
  sort: "newest" | "price_asc" | "price_desc" | "name" | "relevance";
  page: number;
};

export const PAGE_SIZE = 24;

const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v : v ? v.split(",") : []).map((s) => s.trim()).filter(Boolean).slice(0, 10);

export function parseFilters(sp: Record<string, string | string[] | undefined>): Filters {
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q ?? "").trim().slice(0, 80);
  const sortRaw = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;
  const sorts = ["newest", "price_asc", "price_desc", "name", "relevance"] as const;
  const sort = (sorts as readonly string[]).includes(sortRaw ?? "")
    ? (sortRaw as Filters["sort"])
    : q
      ? "relevance"
      : "newest";
  const page = Math.max(1, Math.min(500, parseInt(String(sp.page ?? "1"), 10) || 1));
  return {
    colour: list(sp.colour),
    pattern: list(sp.pattern),
    type: list(sp.type),
    usage: list(sp.usage),
    q,
    sort,
    page,
  };
}

/** Build a /fabrics URL from filters, with overrides. */
export function fabricsHref(f: Partial<Filters>, over: Partial<Filters> = {}) {
  const m = { ...f, ...over };
  const p = new URLSearchParams();
  for (const k of ["colour", "pattern", "type", "usage"] as const) {
    const v = m[k];
    if (v && v.length) p.set(k, v.join(","));
  }
  if (m.q) p.set("q", m.q);
  if (m.sort && m.sort !== "newest" && !(m.q && m.sort === "relevance")) p.set("sort", m.sort);
  if (m.page && m.page > 1) p.set("page", String(m.page));
  const s = p.toString();
  return "/fabrics" + (s ? "?" + s : "");
}

const arr = (a: string[]) => (a.length ? a : null);

export const getCategories = cache(async (): Promise<Category[]> => {
  const { data, error } = await db
    .from("categories")
    .select("id, slug, name, parent_id, facet")
    .not("facet", "is", null)
    .order("name");
  if (error) throw error;
  return (data ?? []) as Category[];
});

export async function searchProducts(f: Filters, limit = PAGE_SIZE) {
  const { data, error } = await db.rpc("search_products", {
    p_colour: arr(f.colour),
    p_pattern: arr(f.pattern),
    p_type: arr(f.type),
    p_usage: arr(f.usage),
    p_q: f.q || null,
    p_sort: f.sort,
    p_limit: limit,
    p_offset: (f.page - 1) * limit,
  });
  if (error) throw error;
  const rows = (data ?? []) as ProductCard[];
  return { rows, total: rows[0]?.total_count ?? 0 };
}

export async function getFacetCounts(f: Filters) {
  const { data, error } = await db.rpc("facet_counts", {
    p_colour: arr(f.colour),
    p_pattern: arr(f.pattern),
    p_type: arr(f.type),
    p_usage: arr(f.usage),
    p_q: f.q || null,
  });
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const r of (data ?? []) as { slug: string; product_count: number }[]) counts[r.slug] = Number(r.product_count);
  return counts;
}

export type ProductDetail = {
  id: number;
  slug: string;
  name: string;
  design: string | null;
  colour_name: string | null;
  sku: string | null;
  price_pence: number;
  sale_price_pence: number | null;
  description: string | null;
  composition: string | null;
  width: string | null;
  pattern_repeat: string | null;
  care: string | null;
  in_stock: boolean;
  images: { url: string; alt: string | null; position: number }[];
  categories: Category[];
};

export const getProduct = cache(async (slug: string): Promise<ProductDetail | null> => {
  const { data, error } = await db
    .from("products")
    .select(
      "id, slug, name, design, colour_name, sku, price_pence, sale_price_pence, description, composition, width, pattern_repeat, care, in_stock, images:product_images(url, alt, position), categories(id, slug, name, parent_id, facet)",
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const p = data as unknown as ProductDetail;
  p.images = [...(p.images ?? [])].sort((a, b) => a.position - b.position);
  return p;
});

export type Colourway = { slug: string; name: string; colour_name: string | null; image: string | null };

export async function getColourways(design: string | null, excludeSlug: string): Promise<Colourway[]> {
  if (!design) return [];
  const { data, error } = await db
    .from("products")
    .select("slug, name, colour_name, images:product_images(url, position)")
    .eq("design", design)
    .eq("is_active", true)
    .order("name")
    .limit(30);
  if (error) throw error;
  return ((data ?? []) as unknown as { slug: string; name: string; colour_name: string | null; images: { url: string; position: number }[] }[])
    .map((r) => ({
      slug: r.slug,
      name: r.name,
      colour_name: r.colour_name,
      image: [...(r.images ?? [])].sort((a, b) => a.position - b.position)[0]?.url ?? null,
    }))
    .filter((r) => r.slug !== excludeSlug);
}

export { formatPrice } from "./format";

/** Group categories by facet, with colour shades nested under their family. */
export function groupCategories(cats: Category[]) {
  const byFacet: Record<Facet, Category[]> = { colour: [], pattern: [], type: [], usage: [] };
  for (const c of cats) if (c.facet) byFacet[c.facet].push(c);
  // a category whose parent is not itself a facet option is a top-level option
  const ids = new Set(cats.filter((c) => c.facet).map((c) => c.id));
  const top = (f: Facet) => byFacet[f].filter((c) => !c.parent_id || !ids.has(c.parent_id));
  const children = (id: number) => cats.filter((c) => c.parent_id === id);
  return { byFacet, top, children };
}
