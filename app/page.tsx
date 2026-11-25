import Image from "next/image";
import Link from "next/link";
import { FilterForm } from "@/components/FilterForm";
import { ProductCard } from "@/components/ProductCard";
import { getCategories, getFacetCounts, parseFilters, searchProducts } from "@/lib/data";
import { buildOptions } from "@/lib/options";

export const revalidate = 300;

const COLOUR_FAMILIES = [
  { slug: "the-neutrals", label: "Neutrals" },
  { slug: "blues", label: "Blues" },
  { slug: "the-greens", label: "Greens" },
  { slug: "reds-pinks", label: "Reds & Pinks" },
  { slug: "earth-wood", label: "Earth & Wood" },
  { slug: "brights-warmth", label: "Brights" },
];
const USES = [
  { slug: "curtain-fabric", label: "Curtains" },
  { slug: "upholstery-fabric", label: "Upholstery" },
  { slug: "tablecloth", label: "Tablecloths" },
];

const empty = parseFilters({});

export default async function Home() {
  const [cats, counts, hero, florals, newest, ...tileRows] = await Promise.all([
    getCategories(),
    getFacetCounts(empty),
    searchProducts({ ...empty, pattern: ["artistic-contemporary"] }, 6),
    searchProducts({ ...empty, pattern: ["nature-floral"] }, 12),
    searchProducts(empty, 8),
    ...COLOUR_FAMILIES.map((c) => searchProducts({ ...empty, colour: [c.slug], pattern: ["minimalist-plain"] }, 1)),
    ...USES.map((u) => searchProducts({ ...empty, usage: [u.slug], pattern: ["nature-floral"] }, 1)),
  ]);
  const colourTiles = tileRows.slice(0, COLOUR_FAMILIES.length);
  const useTiles = tileRows.slice(COLOUR_FAMILIES.length);
  const options = buildOptions(cats, counts);

  return (
    <>
      <section className="hero">
        <div className="hero-intro">
          <h1>Fabric, beautifully found</h1>
          <p className="caps" style={{ opacity: 0.75, margin: 0 }}>
            {Number(newest.total).toLocaleString("en-GB")} fabrics · Belfast
          </p>
        </div>
        <div className="carousel" aria-label="Featured fabrics">
          {hero.rows.map((p, n) => (
            <Link key={p.id} href={`/fabric/${p.slug}`} className="hero-card">
              {p.image_url && <Image src={p.image_url} alt={p.name} fill sizes="(min-width:700px) 380px, 78vw" priority={n < 2} />}
              <span className="cap">
                <span className="caps">{p.design}</span>
                <b>{p.name}</b>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section navy-band" style={{ paddingTop: 10 }}>
        <div className="wrap">
          <h2 className="section-title" style={{ fontSize: 16 }}>Trending florals</h2>
          <p className="section-sub">Discover some of the popular designs here at Mad About Fabrics</p>
        </div>
        <div className="circles">
          {florals.rows.map((p) => (
            <Link key={p.id} href={`/fabric/${p.slug}`} className="circle">
              <span className="ring">{p.image_url && <Image src={p.image_url} alt="" width={76} height={76} />}</span>
              <span>{p.design}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="filter-panel navy-band on-navy wide">
            <FilterForm options={options} current={{ colour: [], pattern: [], type: [], usage: [], q: "" }} />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 className="section-title">Shop by colour</h2>
          <p className="section-sub">Six colour families, every shade inside</p>
          <div className="tiles six">
            {COLOUR_FAMILIES.map((c, n) => {
              const p = colourTiles[n]?.rows[0];
              return (
                <Link key={c.slug} href={`/fabrics?colour=${c.slug}`} className="tile">
                  {p?.image_url && <Image src={p.image_url} alt="" fill sizes="(min-width:1100px) 16vw, (min-width:700px) 30vw, 46vw" />}
                  <span className="label">
                    {c.label} {counts[c.slug] ? `· ${counts[c.slug]}` : ""}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 className="section-title">Shop by use</h2>
          <p className="section-sub">For curtain makers, upholsterers and home sewers</p>
          <div className="tiles">
            {USES.map((u, n) => {
              const p = useTiles[n]?.rows[0];
              return (
                <Link key={u.slug} href={`/fabrics?usage=${u.slug}`} className="tile">
                  {p?.image_url && <Image src={p.image_url} alt="" fill sizes="(min-width:700px) 30vw, 46vw" />}
                  <span className="label">
                    {u.label} {counts[u.slug] ? `· ${counts[u.slug]}` : ""}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
            <h2 className="section-title">New in</h2>
            <Link href="/fabrics" className="caps" style={{ textDecoration: "underline" }}>
              View all
            </Link>
          </div>
          <p className="section-sub">The latest arrivals in store</p>
          <div className="grid home">
            {newest.rows.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
