type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const MenuIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p} aria-hidden="true"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
);
export const CloseIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p} aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
);
export const UserIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p} aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
);
export const CartIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p} aria-hidden="true"><path d="M2 4h3l2.4 10.2a1 1 0 001 .8h9.7a1 1 0 001-.8L21 7H6.2" /><circle cx="9" cy="19" r="1.4" /><circle cx="18" cy="19" r="1.4" /></svg>
);
export const SearchIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2} {...p} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>
);
export const ArrowCircleIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={1.8} {...p} aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M8 12h8M12.5 8.5L16 12l-3.5 3.5" /></svg>
);
export const HeartIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p} aria-hidden="true"><path d="M12 20s-7-4.4-9.2-9A5 5 0 0112 6a5 5 0 019.2 5C19 15.6 12 20 12 20z" /></svg>
);
