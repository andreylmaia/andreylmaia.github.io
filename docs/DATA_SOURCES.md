# Data sources

The homepage and Intelligence page share the country overview. Brazil is the default and each country with at least one published value is represented by its flag. Data is loaded at build time.

The Brazil flag is stored locally from [FlagCDN](https://flagcdn.com/w80/br.png).

## Add or update a dataset

Add an object to `src/data/indicators/<country-code>.json`, following the Brazil example in `br.json`. Supply a unique two-letter country code, English and Portuguese names, a local PNG flag path under `images/flags/`, and one record per indicator ID from `src/data/indicators.ts`.

- Use `value: null` for unavailable data. Values and sources are shared across locales.
- Set `unit` to `text`, `count`, `compact`, `percent`, `currency`, or `compactCurrency`. Use raw numeric counts and amounts, percentage points for percentages (55.2 means 55.2%), and a three-letter currency code with currency units. The display formats numbers for each locale.
- For published values, include the official source name, an HTTPS link to the series or methodology, and an ISO `updatedAt` date recording the review of the value. Verify publication terms, units and scope before committing.
- Set `referencePeriod` as `YYYY`, `YYYY-MM`, or `YYYY-MM-DD` for statistical observations. With an unavailable value, a reference period is shown as requested in the methodology panel.
- Add bilingual `methodology` where definitions, reporting scope, or transformations affect interpretation.

For Brazil, the two monthly Pix metrics target July 2026 and use the same period. Fill both from reviewed BCB data. Publish rail coverage only when the Pix transaction count and the count of all payment transactions share a reference period and compatible scope. Document the reporting category and universe before publishing the financial-institution count.

Run `npm run check`, `npm test` and `npm run build` after adding data. Verify the rendered values and source disclosure in both languages using `npm run preview`.
