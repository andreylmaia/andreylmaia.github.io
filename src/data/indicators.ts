import {z} from 'astro/zod';

const localized = z.object({en:z.string().min(1),pt:z.string().min(1)});
const day = z.iso.date();
const schema = z.array(z.object({
  id: z.string().min(1),
  title: localized,
  market: z.enum(['BR','CN','US']),
  value: z.number(),
  unit: localized,
  observationDate: day,
  updatedAt: day,
  source: z.string().min(1),
  sourceUrl: z.url({protocol:/^https$/}),
  methodology: localized.optional(),
}).refine(item => item.updatedAt >= item.observationDate, {message:'Update date precedes observation date'}));
const files = import.meta.glob('./indicators/*.json', {eager:true, import:'default'});
export const indicators = schema.parse(Object.values(files).flat());
if (new Set(indicators.map(item => item.id)).size !== indicators.length) throw new Error('Duplicate indicator ID');
