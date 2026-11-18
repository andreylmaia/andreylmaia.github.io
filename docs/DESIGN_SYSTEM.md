# Design system

`src/styles/site.css` defines semantic variables for backgrounds, surfaces, readable text, blue accents, borders and positive states. Light is the default. The dark palette lives under `data-theme=dark`. Adjust the two palettes together and check contrast in both modes. The site self-hosts Geist Variable and JetBrains Mono.

Content uses the `.wrap` width and fluid gutter. Section spacing uses `--space`, panels use `--radius`, and floating payment elements share `--shadow`. Standard responsive transitions live at 1000, 850, 680 and 370 pixels. Motion respects the visitor’s reduced-motion preference.

- `Shell.astro` provides navigation, language and theme controls, skip navigation, metadata and footer.
- `PageHeading.astro` sets the title, summary and optional back link. Use `.section-head` for section-level headings.
- `EditorialCard.astro` supports text-only, image and featured entries.
- `Connect.astro` is the shared invitation to the contact page. `ConversationStarter.astro` renders only the contact channels configured for the site.
- `ProfilePortrait.astro` renders the shared optimized portrait at its natural aspect ratio and provides localized alt text.
- `Indicators.astro` displays published values, dates and source attribution, with an empty state when there are no datasets.
- `Lab.astro` provides reusable input, metric, journal and chart patterns. Give charts readable labels, keep results available as text, and use a localized status region for asynchronous updates.
- `FinancialDiagram.astro` provides a captioned sequence for MDX. Math uses KaTeX.

Check at desktop and phone widths, including Portuguese copy. Preserve visible focus, readable chart values and static links. Reserve larger cards for featured items.

The shared Author component provides a homepage signature, compact byline and editorial biography using the site portrait. Keep the signature avatar at 52px and maintain the reading hierarchy when adding author links. The About page uses a single-column career timeline and responsive metric cards with platform-scale attribution.

The search palette uses a native modal dialog and follows existing focus, surface and color tokens. Keyboard focus stays inside the dialog while open and returns to the invoking control when it closes. Use short localized result labels and preserve relevance order.
