import { createClient } from "@supabase/supabase-js";

// Publishable key: safe to ship to the browser. Row Level Security protects the data.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://corhjklafpiwzpwwhgzx.supabase.co";
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_J0ZlBr67f35CQv7zoN3vLg_IzawEIwL";

/** Server-side client for public catalogue reads, cached for 5 minutes. */
export const db = createClient(url, key, {
  auth: { persistSession: false },
  global: {
    fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 300 } }),
  },
});
