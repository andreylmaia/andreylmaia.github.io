# Architecture

Astro creates static pages at build time. The route tree shares locale-independent route segments. Content Collections load and validate Markdown and MDX. `src/lib/editorial.ts` checks locale consistency and uniqueness, excludes drafts, and sorts published entries. Catalog filtering and pagination operate on static markup. Entry pages resolve translation links by stable ID.

`src/lib/site.ts` has URL helpers that honor the Astro base path. The shell emits canonical, alternate and social metadata. The site generates RSS per locale and a sitemap from built routes. The root and language selector use local storage for language preference. Theme preference is also browser-local.

## Add a Lab

1. Add the slug to `labIds` and write the English and Portuguese title and description alongside the other tools.
2. Add a preview and route the new index to its Astro component from the shared Lab entry point. Keep tool-specific interactions in that component.
3. Put deterministic calculations in a separate module and add targeted tests. Keep currency postings in integer minor units.
4. Label assumptions, units, errors and outcomes in both languages. Make any simulated values distinguishable from Intelligence datasets.

The ledger and unit economics use targeted browser scripts. The time value explorer uses a React island and an inline SVG chart. They have no backend, credentials or external requests.

## Optional analytics

The default build ships without tracking. In `src/lib/analytics.ts`, supply an authorized HTTPS script URL and a description of local preferences and tracking in both languages. The shell and privacy pages use that configuration. Address the provider’s consent requirements before enabling it.
