# Content guide

Add Markdown or MDX files under `src/content/insights/en/`, `src/content/insights/pt/`, `src/content/library/en/`, or `src/content/library/pt/`. The folder and locale must agree. Use the same stable ID for translations of the same item and give each language its own slug. IDs and slugs must be unique within a collection and locale. Missing translations are supported.

## Article template

```yaml
---
id: stable-id
title: Article title
description: A short summary for listings and metadata.
slug: article-title
locale: en
category: infrastructure
tags: [payments]
publishedAt: 2026-11-18
featured: false
draft: true
coverImage: images/article-cover.webp
---
```

Use `infrastructure`, `building` or `nature` for the category. Add an optional `updatedAt` date. Omit `coverImage` if unavailable. Cover imagery is decorative, so put any essential information in the article itself. Use fenced code blocks for code, Markdown tables for tabular data, and dollar delimiters for math. Three or more level-two or level-three headings enable the table of contents.

In MDX, import `../../../components/FinancialDiagram.astro` from a file directly inside the locale folder. Pass a localized `caption` and `steps` array. You can also embed `Lab.astro` with its `locale` and numeric `index` props.

## Library template

```yaml
---
id: stable-resource-id
title: Resource title
description: A short description of the resource.
slug: resource-title
locale: en
category: books
creator: Author or creator
externalUrl: https://example.com/resource
tags: [payments]
featured: false
draft: true
---
```

Categories are `books`, `tools`, `articles`, `research`, `frameworks`, `podcasts`, `people` and `resources`. Add optional `commentary` for a recommendation explicitly approved by Andrey, and `coverImage` for imagery.

## Publish

Preview locally, set `draft: false` only when approved, then commit and push. The site discovers the entry and updates the locale’s lists, related content, sitemap and article RSS automatically. Featured entries appear in their own locale. Switching languages on an untranslated entry opens the corresponding listing with an explanation.

## Profile, discovery and social cards

Edit `src/data/profile.ts` for bilingual career, education, and interests. Maintain both languages and the ISO `updated` date in `src/data/now.json` for current activities. The portrait and public social links are in `src/lib/site.ts`. The homepage uses employer names in text. Keep any approved future logo assets under `public/` and verify them in both themes.

Each published Insight may list zero or more `relatedLabs` by ID. Supported IDs are `ledger`, `unit-economics`, and `time-value`. Links point to the matching language. The build creates a localized 1200 × 630 social image for each published Insight and Lab from its title and category. The article cover remains controlled by `coverImage`.

At the end of the build, Pagefind indexes the rendered main content of Insights, Labs, Intelligence, Library, About, and Connect. To extend this list, update the route rules in `src/layouts/Shell.astro` and use `data-pagefind-ignore` for repeated content. Drafts never render as routes and therefore do not enter search, feeds, or social images. Run `npm run build` and `npm run preview` to test the search index in both languages.
