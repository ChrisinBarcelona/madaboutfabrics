import type { Metadata } from "next";
import Link from "next/link";
import { ListingSidebar } from "@/components/ListingSidebar";
import { ProductCard } from "@/components/ProductCard";
import { fabricsHref, getCategories, getFacetCounts, PAGE_SIZE, parseFilters, searchProducts, type Filters } from "@/lib/data";
import { buildOptions, nameFor } from "@/lib/options";

type SP = Promise<Record<string, string | string[] | undefined>>;

function heading(f: Filters, cats: Awaited<ReturnType<typeof getCategories>>) {
  const parts = [...f.colour, ...f.pattern, ...f.type, ...f.usage].map((s) => nameFor(cats, s).replace(/^All /, ""));
  if (f.q) parts.unshift(`“${f.q}”`);
  return parts.length ? parts.join(" · ") : "All fabrics";
}

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const f = parseFilters(await searchParams);
  const cats = await getCategories();
  const h = heading(f, cats);
  return { title: h === "All fabrics" ? "All fabrics" : `${h} fabric`, robots: f.q || f.page > 1 ? { index: false } : undefined };
}

const SORTS: { key: Filters["sort"]; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "price_asc", label: "Low to high" },
  { key: "price_desc", label: "High to low" },
  { key: "name", label: "A–Z" },
];

export default async function FabricsPage({ searchParams }: { searchParams: SP }) {
  const f = parseFilters(await searchParams);
  const [cats, counts, result] = await Promise.all([getCategories(), getFacetCounts(f), searchProducts(f)]);
  const total = Number(result.total);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const options = buildOptions(cats, counts);
  const active = [
    ...(["colour", "pattern", "type", "usage"] as const).flatMap((k) =>
      f[k].map((slug) => ({ label: nameFor(cats, slug).replace(/^All /, ""), href: fabricsHref(f, { [k]: f[k].filter((s) => s !== slug), page: 1 }) })),
    ),
    ...(f.q ? [{ label: `“${f.q}”`, href: fabricsHref(f, { q: "", page: 1, sort: "newest" }) }] : []),
  ];
  const sorts = f.q ? [{ key: "relevance" as const, label: "Best match" }, ...SORTS] : SORTS;

  return (
    <div className="listing">
      <div className="listing-head">
        <span className="caps muted">
          <Link href="/">Home</Link> / Fabrics
        </span>
        <h1>{heading(f, cats)}</h1>
        <p className="muted" style={{ margin: 0, fontSize: 13 }}>
          {total.toLocaleString("en-GB")} {total === 1 ? "fabric" : "fabrics"}
          {pages > 1 ? ` · page ${f.page} of ${pages}` : ""}
        </p>
        {active.length > 0 && (
          <div className="active-filters" aria-label="Active filters">
            {active.map((a) => (
              <Link key={a.href + a.label} href={a.href} aria-label={`Remove ${a.label}`}>
                {a.label}
              </Link>
            ))}
            {active.length > 1 && (
              <Link href="/fabrics" style={{ borderColor: "transparent", textDecoration: "underline" }}>
                Clear all
              </Link>
            )}
          </div>
        )}
      </div>

      <ListingSidebar
        key={JSON.stringify([f.colour, f.pattern, f.type, f.usage, f.q])}
        options={options}
        current={f}
        activeCount={active.length}
      />

      <section aria-label="Fabrics">
        <nav className="sort-tabs" aria-label="Sort">
          {sorts.map((s) => (
            <Link key={s.key} href={fabricsHref(f, { sort: s.key, page: 1 })} aria-current={f.sort === s.key}>
              {s.label}
            </Link>
          ))}
        </nav>

        {result.rows.length === 0 ? (
          <div className="empty" style={{ marginTop: 24 }}>
            <p className="serif" style={{ fontSize: 20, margin: "0 0 8px" }}>
              No fabrics match all of those
            </p>
            <p className="muted" style={{ margin: "0 0 18px" }}>
              Try removing one of the filters above.
            </p>
            <Link href="/fabrics" className="btn outline">
              See all fabrics
            </Link>
          </div>
        ) : (
          <div className="grid" style={{ marginTop: 22 }}>
            {result.rows.map((p, n) => (
              <ProductCard key={p.id} p={p} priority={n < 4} />
            ))}
          </div>
        )}

        {pages > 1 && <Pager f={f} pages={pages} />}
      </section>
    </div>
  );
}

function Pager({ f, pages }: { f: Filters; pages: number }) {
  const cur = f.page;
  const nums = new Set([1, pages, cur - 1, cur, cur + 1].filter((n) => n >= 1 && n <= pages));
  const list = [...nums].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  list.forEach((n, i) => {
    if (i && n - list[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return (
    <nav className="pager" aria-label="Pages">
      {cur > 1 && <Link href={fabricsHref(f, { page: cur - 1 })}>‹ Prev</Link>}
      {out.map((n, i) =>
        n === "gap" ? (
          <span key={"g" + i}>…</span>
        ) : n === cur ? (
          <span key={n} aria-current="page">
            {n}
          </span>
        ) : (
          <Link key={n} href={fabricsHref(f, { page: n })}>
            {n}
          </Link>
        ),
      )}
      {cur < pages && <Link href={fabricsHref(f, { page: cur + 1 })}>Next ›</Link>}
    </nav>
  );
}
