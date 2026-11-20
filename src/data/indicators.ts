import {z} from 'astro/zod';

export const indicatorGroups = {
  population: ['population', 'adults', 'employed', 'urbanization', 'states', 'municipalities'],
  economy: ['gdp', 'gdpGrowth', 'gdpPerCapita', 'inflation', 'unemployment', 'policyRate'],
  financial: ['currency', 'regulator', 'mainRail', 'railCoverage', 'monthlyTransactions', 'monthlyVolume', 'institutions'],
} as const;

const ids = [...indicatorGroups.population, ...indicatorGroups.economy, ...indicatorGroups.financial] as const;
const localized = z.object({en: z.string().min(1), pt: z.string().min(1)});
const period = z.union([z.iso.date(), z.string().regex(/^\d{4}(?:-(?:0[1-9]|1[0-2]))?$/)]);
const source = z.object({name: z.string().min(1), url: z.url({protocol: /^https$/})});
const number = z.number();
const indicator = z.discriminatedUnion('unit', [
  z.object({unit: z.literal('text'), value: z.string().min(1).nullable()}),
  z.object({unit: z.enum(['count', 'compact', 'percent']), value: number.nullable()}),
  z.object({unit: z.enum(['currency', 'compactCurrency']), value: number.nullable(), currency: z.string().regex(/^[A-Z]{3}$/)}),
]).and(z.object({
  referencePeriod: period.optional(),
  source: source.optional(),
  updatedAt: z.iso.date().optional(),
  methodology: localized.optional(),
})).refine(item => item.value === null || (item.source && item.updatedAt), {
  message: 'Published values require a verified source and a review date.',
});

const countrySchema = z.object({
  code: z.string().regex(/^[A-Z]{2}$/),
  name: localized,
  flag: z.string().regex(/^images\/flags\/[a-z]{2}\.png$/),
  indicators: z.record(z.enum(ids), indicator),
}).superRefine((country, context) => {
  for (const [id, item] of Object.entries(country.indicators)) {
    if (item.value !== null && id !== 'states' && item.unit !== 'text' && !item.referencePeriod) {
      context.addIssue({code: 'custom', path: ['indicators', id, 'referencePeriod'], message: 'Published statistics require a reference period.'});
    }
  }
});

const files = import.meta.glob('./indicators/*.json', {eager: true, import: 'default'});
const datasets = Object.values(files).map(file => countrySchema.parse(file));
if (new Set(datasets.map(country => country.code)).size !== datasets.length) throw new Error('Duplicate indicator country code');
export const countries = datasets.filter(country => Object.values(country.indicators).some(item => item.value !== null));

export type CountryIndicator = z.infer<typeof indicator>;
