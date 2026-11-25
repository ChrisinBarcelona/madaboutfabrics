# Mad About Fabrics — new shop (preview)

Next.js 16 + Supabase rebuild of madaboutfabrics.com, in the 2020 navy design.

- **Database:** Supabase project `madaboutfabrics` (London): 1,247 products, 344 designs, colour / pattern / type / use categories.
- **Pages:** home, `/fabrics` (combined filters, search, sort, pages), `/fabric/[slug]` (gallery, metres, samples, composition, colourways).
- **Basket & samples:** kept in the browser for now. Stripe checkout and the staff dashboard come next.

```bash
npm install
cp .env.example .env.local   # optional: the public Supabase URL/key are built in
npm run dev
```

The live WordPress site is not touched by this project.
