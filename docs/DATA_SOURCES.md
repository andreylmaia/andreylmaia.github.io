# Data sources

The site ships with an unavailable state for Brazil, China and the United States. It publishes economic figures when reviewed datasets are committed.

## Add a dataset

Use an official source whose terms allow republication. Candidate publishers include Banco Central do Brasil, IBGE, the World Bank, the Federal Reserve Bank of St. Louis and China’s National Bureau of Statistics. Verify the specific series, license, release frequency, revisions and units before committing a value.

Add an array of observations to `src/data/indicators/<dataset>.json`. Each record needs:

- A unique `id` and a `market` of `BR`, `CN` or `US`.
- A `title` and `unit`, each with `en` and `pt` strings.
- A finite numeric `value` and ISO-formatted `observationDate` and `updatedAt`.
- A source name and HTTPS URL pointing to the exact series or methodology.
- Localized `methodology` when interpretation depends on definitions, rebasing, seasonal adjustment or other transformations.

Run the site build to validate the records. Use the observation date for the period represented and the update date for dataset freshness. Document the series identifier and license with the data.

A future collection workflow can retrieve series on a schedule, validate the response and open a pull request with changes to static JSON. Preserve the last reviewed dataset on failures. Keep source credentials in Actions secrets if a provider requires them.
