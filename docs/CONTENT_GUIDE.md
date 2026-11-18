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
