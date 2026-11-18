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

`src/lib/analytics.ts` initializes the Google tag after consent and defines the event names and allowed parameters. Navigation, content, Labs and contact components send events through that module. `AnalyticsConsent.astro` presents localized consent choices and the controls on the Privacy page. The production build reads `PUBLIC_GA_MEASUREMENT_ID`. The site works without Analytics or browser storage. See the [README](../README.md#google-analytics-4) for setup and reporting.
