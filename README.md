# Andrey Maia

A bilingual editorial site and financial playground. Astro publishes static HTML to GitHub Pages. Editorial content, configuration and verified datasets live in Git.

## Develop

Use Node.js 24 and npm 10.8.2 or later.

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
npm run preview
```

The development server prints its local URL. English lives at `/en/` and Brazilian Portuguese at `/pt/`. The root uses English by default and remembers an explicit language selection. The site starts in light mode.

## Publish

In the repository’s **Settings → Pages**, choose **GitHub Actions** as the source. Push to the default branch to validate content, check types, test the financial models, build and deploy. Pull requests run the checks and build.

The workflow uses the GitHub Pages origin and base path. For local builds, set `SITE_URL` to an absolute origin and `SITE_BASE` to the mount path, such as `/repo`. Configure a custom domain in GitHub Pages and its DNS first. Repository variables with those names can override discovery if needed. Leave the base at `/` for a domain hosted at its root.

## Maintain

- Edit the name, portrait path, contact links and bilingual copy in `src/lib/site.ts`. Put local public images in `public/`.
- See [Content guide](docs/CONTENT_GUIDE.md) for articles, translations and recommendations.
- See [Architecture](docs/ARCHITECTURE.md) for a new Lab and optional analytics.
- See [Design system](docs/DESIGN_SYSTEM.md) for tokens and components.
- See [Data sources](docs/DATA_SOURCES.md) for Intelligence datasets.

The launch needs a professional portrait, direct email and LinkedIn URL, approved editorial content and recommendations, and verified economic datasets. Until supplied, the site uses a monogram and localized empty states. The GitHub link comes from the repository owner. [Implementation plan](PLANS.md)
