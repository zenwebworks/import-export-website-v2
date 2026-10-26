# Data fetching and SEO

## Admin

React Query is scoped to `/admin`. Lists have a 30-second freshness window and a five-minute in-memory cache. There is no browser-storage persistence. Reads retry once for network/server failures; writes never retry automatically. Successful writes invalidate the relevant lists and overview counts. Logout or a 401 clears the query cache. Existing Auth.js protection remains on pages and write endpoints.

Product, category, quote and message lists use API pagination. The product category selector still requests the full category list. Errors remain visible in edit and confirmation dialogs, and saved status changes appear only after the server confirms success. Image replacement deletes the old image only after the database update succeeds.

Category and product management offer a Homepage filter (All / On homepage / Not on homepage), combined with search and the product category filter before pagination. The global Homepage count is independent of these filters and is used for limit enforcement and the edit form; the list has no summary panel. Row switches have accessible labels without adjacent status text and use an authenticated PATCH endpoint that accepts only `showOnHomepage`; changes cannot overwrite an item's other details. Successful saves refresh the lists and count. Limit conflicts refresh the count and show a message; failed saves retain the previous switch state. Mobile lists become cards with stacked filter controls and touch-sized switches and actions.

There are separate limits of 10 categories and 10 products. Creation, editing, and row switches use `saveCatalogueRecord`, which writes a per-model lock document and checks the count within one MongoDB transaction. Concurrent writers therefore retry against a fresh count instead of both taking the last place. MongoDB must support transactions (a replica set or sharded cluster); the configured connection includes a replica set. The application creates the `HomepageSelectionLock` collection automatically. No unsafe non-transactional fallback is used. Deletions remove records directly and can only reduce the count.

Existing selections above 10 are kept and can be found using the On homepage filter. Administrators may edit selected records or turn selections off while above the limit, but cannot add selections until fewer than 10 remain. The homepage displays at most 10. The separate Featured product field, checkbox, badge and filtering behavior have been retired; legacy database values are not deleted or used.

## Public catalogue

Category and product creation and editing include a **Show on Homepage** checkbox. New records and existing records without this setting are disabled by default. The homepage lists up to 10 explicitly enabled categories in alphabetical order and up to 10 enabled products, newest-created first. These selections are independent: disabling a category does not disable its products. Disabled items remain in the full catalogue. Saves expire the same catalogue cache used by the homepage, so changes appear on its next navigation or reload.

Public pages continue to render content and links on the server. React request memoization deduplicates metadata and page reads. Next.js Data Cache stores public catalogue database results for five minutes; successful category/product writes immediately expire the shared `public-catalogue` tag, including counts and sitemap data. Private enquiries, admin stats and sessions never enter this cache. An already open public page updates on navigation or reload.

Product and category pages fetch 12 products per page, with stable sorting, database filtering and crawlable previous/next links. Search remains a literal, case-insensitive match for names, descriptions, category names or packaging. It is limited to 200 characters and escaped before use in a regular expression. For a much larger catalogue, consider a dedicated search index rather than substring scans. Category metadata reads only its category, not its full product list.

## Production configuration

Set `NEXT_PUBLIC_SITE_URL` to the confirmed HTTPS origin, with no path, before building for production. Run `npm run check:seo`, then rebuild. The current localhost setting deliberately emits noindex and disallows crawling; it must not be used for a production deployment. Example domains are rejected rather than published as canonical URLs.

For self-hosted production, also configure `AUTH_URL` with that same origin. The local production preview uses an explicit loopback `AUTH_URL`; without a configured trusted origin, Auth.js rejects production sign-in with `UntrustedHost`. Do not copy the preview address into production. See [Auth.js deployment guidance](https://authjs.dev/getting-started/deployment).

Canonical URLs, structured data and the sitemap share this origin. About and Sourcing are included in the sitemap; database entries use their actual updated timestamps. Search/filter pages are noindex, pagination has distinct canonical URLs, and all admin pages including login are noindex. JSON-LD escapes HTML delimiters and uses only existing business/product information, without invented prices or reviews.

## Verification

`npm test` covers request validation, API auth boundaries, status validation, safe image replacement and invalidation, client request failures, and SEO serialization. `npm run build` verifies all routes. Tests mock database/cloud writes and never modify the configured catalogue or enquiries.
