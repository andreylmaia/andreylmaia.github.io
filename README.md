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

In the repository’s **Settings → Pages**, choose **GitHub Actions** as the source. Push to the default branch to validate content, check types, test the financial models, build and deploy. Pull requests run the checks and build. The build generates social cards, then writes the Pagefind index into `dist/` alongside the public routes. Use the production preview to exercise global search.

The workflow uses the GitHub Pages origin and base path. For local builds, set `SITE_URL` to an absolute origin and `SITE_BASE` to the mount path, such as `/repo`. Configure a custom domain in GitHub Pages and its DNS first. Repository variables with those names can override discovery if needed. Leave the base at `/` for a domain hosted at its root.

## Maintain

- Edit the name, portrait path and dimensions, contact links and bilingual copy in `src/lib/site.ts`. Put local public images in `public/`.
- Edit the bilingual professional story in `src/data/profile.ts` and the current activities and date in `src/data/now.json`.
- See [Content guide](docs/CONTENT_GUIDE.md) for articles, translations and recommendations.
- See [Architecture](docs/ARCHITECTURE.md) for a new Lab and optional analytics.
- See [Design system](docs/DESIGN_SYSTEM.md) for tokens and components.
- See [Data sources](docs/DATA_SOURCES.md) for Intelligence datasets.

LinkedIn is the primary contact channel. Set the optional email in `src/lib/site.ts` to enable the email composer. Approved editorial content, recommendations, and verified economic datasets are still pending. The GitHub link comes from the repository owner. [Implementation plan](PLANS.md)

## Google Analytics 4

1. In Google Analytics, open **Admin**, create a GA4 property and add a **Web** data stream for the public site URL. Open **Admin → Data streams → Web**, select the stream and copy its **Measurement ID** beginning with `G-`. [GA4 setup](https://support.google.com/analytics/answer/9304153) · [Measurement ID](https://support.google.com/analytics/answer/12270356)
2. In that stream, turn **Enhanced measurement** off. The site sends its own page views and interaction events and excludes free-form search and contact data. Keep Google signals and advertising integrations off, and enable email redaction as an additional precaution. [Enhanced measurement](https://support.google.com/analytics/answer/9216061) · [Data redaction](https://support.google.com/analytics/answer/13544947)
3. In GitHub, open **Settings → Secrets and variables → Actions → Variables**. Add the repository variable `PUBLIC_GA_MEASUREMENT_ID` with your stream ID, then run the Pages workflow on the default branch or push a new commit. The ID is public and is embedded at build time. An empty or invalid ID skips initialization.
4. Use a test stream for local verification. Copy `.env.example` to `.env`, set the test ID, then run `npm run build` and `npm run preview`. The development server keeps analytics off. On the preview or deployed site, use **Tag Assistant** and **Admin → DebugView**. Decline analytics first and verify that the browser makes no Google tag or collection requests. Then allow analytics via the Privacy page and confirm one `page_view` per page and the expected events as you interact. Withdraw consent and verify that collection stops. [DebugView](https://support.google.com/analytics/answer/7201382)

### Events and reporting

Standard GA4 reports cover acquisition, visitors, sessions, devices, geography and engagement for visitors who allow analytics. Register the custom parameters you want to report on under **Admin → Custom definitions** as event-scoped dimensions. In **Explore → Free form**, add those dimensions alongside **Event name** and **Event count**. [Custom dimensions](https://support.google.com/analytics/answer/14239696) · [Free-form exploration](https://support.google.com/analytics/answer/9327972)

| Report | Events | Useful dimensions |
| --- | --- | --- |
| Article engagement | `article_view`, `article_completed`, `article_shared` | `content_id`, `category`, `site_language`, `share_method` |
| Lab engagement | `lab_opened`, `lab_used`, `lab_result_shared`, `lab_result_exported` | `lab_id`, `site_language`, `share_method` |
| Search | `search_opened`, `search_performed`, `search_result_clicked` | `site_language`, `result_count`, `section` |
| Author identity | `author_profile_clicked`, `linkedin_clicked` | `cta_location`, `site_language` |
| Resource interest | `resource_clicked` | `content_id`, `category`, `site_language` |
| Display preferences | `language_changed`, `theme_changed` | `site_language`, `target_language`, `theme` |
| Contact intent | `conversation_started`, `linkedin_clicked`, `email_clicked` | `cta_location`, `site_language` |

Article completion requires reaching the end and spending at least 30 foreground seconds on the page with consent. Lab use is counted once per Lab per page after a valid interaction. Shares are counted after clipboard or native sharing succeeds, or when the email share link is opened. Contact events count intent. The same composer action can record both a generic conversation start and an email click. Use them as separate metrics.

Lab result actions run in the browser. Simulation links are created only when requested and store allowlisted illustrative values in the URL fragment. Ledger shares summarize the current result and most recent transaction. Analytics receive Lab identifiers and action types, without simulation values or search terms.

### LinkedIn campaign links

Tag each post’s destination with `utm_source=linkedin`, `utm_medium=organic_social`, and a campaign label. Use `utm_content` to distinguish posts within a campaign. For example:

```text
https://andreylmaia.github.io/en/?utm_source=linkedin&utm_medium=organic_social&utm_campaign=payment_infrastructure&utm_content=post_01
```

Use public campaign codes made of letters, digits, hyphens and underscores, with no personal data. Only supported UTM keys with valid codes are passed to GA4. In **Traffic acquisition**, review **Session source / medium** and **Session campaign**. [Manual campaign attribution](https://support.google.com/analytics/answer/11242870)
