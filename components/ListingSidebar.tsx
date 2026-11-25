"use client";

import { useState } from "react";
import { FilterForm, type FacetOptions } from "./FilterForm";

export function ListingSidebar({
  options,
  current,
  activeCount,
}: {
  options: FacetOptions;
  current: { colour: string[]; pattern: string[]; type: string[]; usage: string[]; q: string };
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <aside className="sidebar">
      <button className="mobile-filter-toggle" aria-expanded={open} aria-controls="filters" onClick={() => setOpen(!open)}>
        <span>Filter fabrics{activeCount ? ` (${activeCount})` : ""}</span>
        <span aria-hidden="true">{open ? "–" : "+"}</span>
      </button>
      <div id="filters" className="filter-panel on-navy" hidden={!open} style={{ marginTop: 12 }}>
        <FilterForm options={options} current={current} intro="Combine as many as you like" onDone={() => setOpen(false)} />
      </div>
    </aside>
  );
}
