"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type BasketLine = { slug: string; name: string; image: string | null; price_pence: number; metres: number };
export type Sample = { slug: string; name: string; image: string | null };

export const MAX_SAMPLES = 6;
const KEY = "maf-store-v1";

type State = { lines: BasketLine[]; samples: Sample[]; saved: string[] };
type Ctx = State & {
  ready: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  addLine: (l: BasketLine) => void;
  setMetres: (slug: string, metres: number) => void;
  removeLine: (slug: string) => void;
  toggleSample: (s: Sample) => "added" | "removed" | "full";
  hasSample: (slug: string) => boolean;
  toggleSaved: (slug: string) => void;
  isSaved: (slug: string) => boolean;
  totalPence: number;
  count: number;
};

const StoreContext = createContext<Ctx | null>(null);

const clampMetres = (m: number) => Math.max(0.5, Math.min(100, Math.round(m * 2) / 2));

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({ lines: [], samples: [], saved: [] });
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as Partial<State>;
        setState({ lines: s.lines ?? [], samples: s.samples ?? [], saved: s.saved ?? [] });
      }
    } catch {
      /* storage unavailable: keep in memory */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, ready]);

  const addLine = useCallback((l: BasketLine) => {
    setState((s) => {
      const existing = s.lines.find((x) => x.slug === l.slug);
      const lines = existing
        ? s.lines.map((x) => (x.slug === l.slug ? { ...x, metres: clampMetres(x.metres + l.metres) } : x))
        : [...s.lines, { ...l, metres: clampMetres(l.metres) }];
      return { ...s, lines };
    });
    setOpen(true);
  }, []);

  const setMetres = useCallback((slug: string, metres: number) => {
    setState((s) => ({ ...s, lines: s.lines.map((x) => (x.slug === slug ? { ...x, metres: clampMetres(metres) } : x)) }));
  }, []);

  const removeLine = useCallback((slug: string) => {
    setState((s) => ({ ...s, lines: s.lines.filter((x) => x.slug !== slug) }));
  }, []);

  const toggleSample = useCallback(
    (smp: Sample) => {
      if (state.samples.some((x) => x.slug === smp.slug)) {
        setState((s) => ({ ...s, samples: s.samples.filter((x) => x.slug !== smp.slug) }));
        return "removed" as const;
      }
      if (state.samples.length >= MAX_SAMPLES) {
        setOpen(true);
        return "full" as const;
      }
      setState((s) => ({ ...s, samples: [...s.samples, smp] }));
      return "added" as const;
    },
    [state.samples],
  );

  const toggleSaved = useCallback((slug: string) => {
    setState((s) => ({ ...s, saved: s.saved.includes(slug) ? s.saved.filter((x) => x !== slug) : [...s.saved, slug] }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      ready,
      open,
      setOpen,
      addLine,
      setMetres,
      removeLine,
      toggleSample,
      hasSample: (slug) => state.samples.some((x) => x.slug === slug),
      toggleSaved,
      isSaved: (slug) => state.saved.includes(slug),
      totalPence: Math.round(state.lines.reduce((t, l) => t + l.price_pence * l.metres, 0)),
      count: state.lines.length + state.samples.length,
    }),
    [state, ready, open, addLine, setMetres, removeLine, toggleSample, toggleSaved],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
