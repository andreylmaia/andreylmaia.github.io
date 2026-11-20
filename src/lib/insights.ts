import { statSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'astro/zod';
import english from '../content/external/en/linkedin_content.en.json';
import portuguese from '../content/external/pt/linkedin_content.pt-BR.json';
import { entries, type Entry } from './editorial';
import { asset, copy, language, other, pillars, url, type Locale } from './site';

const linkedInUrl = z.url({protocol: /^https$/}).refine(value => {
  const hostname = new URL(value).hostname;
  return hostname === 'lnkd.in' || hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com');
});
const publication = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  type: z.enum(['post', 'article']),
  platform: z.literal('linkedin'),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  url: linkedInUrl,
  publishedAt: z.union([z.iso.date(), z.iso.datetime({offset: true})]).nullish(),
  language: z.enum(['en', 'pt-BR']),
  category: z.enum(pillars),
  tags: z.array(z.string()),
  images: z.array(z.string()),
  featured: z.boolean(),
  sortOrder: z.number().int(),
});

type LinkedInInsight = Omit<z.infer<typeof publication>, 'publishedAt'> & {
  source: 'linkedin';
  locale: Locale;
  publishedAt: Date | null;
};
type WebsiteInsight = {
  source: 'website';
  type: 'article';
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  category: typeof pillars[number];
  tags: string[];
  images: string[];
  language: string;
  featured: boolean;
  sortOrder: number;
  entry: Entry;
};
export type Insight = LinkedInInsight | WebsiteInsight;

function loadLinkedIn(records: unknown, locale: Locale) {
  const items = new Map<string, LinkedInInsight>();
  if (!Array.isArray(records)) {
    console.warn(`[LinkedIn ${locale}] Expected an array of publications.`);
    return items;
  }
  for (const [index, record] of records.entries()) {
    const result = publication.safeParse(record);
    if (!result.success) {
      console.warn(`[LinkedIn ${locale}] Skipping record ${index + 1}: ${result.error.issues.map(issue => issue.path.join('.')).join(', ')}`);
      continue;
    }
    const data = result.data;
    if (items.has(data.id)) {
      console.warn(`[LinkedIn ${locale}] Skipping duplicate ID: ${data.id}`);
      continue;
    }
    items.set(data.id, {
      ...data,
      locale,
      source: 'linkedin',
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
    });
  }
  return items;
}

const localized = {en: loadLinkedIn(english, 'en'), pt: loadLinkedIn(portuguese, 'pt')};
for (const locale of ['en', 'pt'] as const) {
  for (const item of localized[locale].values()) {
    const counterpart = localized[other(locale)].get(item.id);
    if (!counterpart || item.type !== counterpart.type || item.language !== counterpart.language) {
      console.warn(`[LinkedIn ${locale}] Check the matching translation for ${item.id}.`);
    }
  }
}

function byPublication(a: Insight, b: Insight) {
  return (b.publishedAt?.getTime() ?? -Infinity) - (a.publishedAt?.getTime() ?? -Infinity)
    || a.sortOrder - b.sortOrder
    || a.id.localeCompare(b.id);
}

export function linkedInInsights(locale: Locale) {
  const items = new Map([...localized[other(locale)], ...localized[locale]]);
  return [...items.values()].sort(byPublication);
}

export async function insights(locale: Locale): Promise<Insight[]> {
  const internal: WebsiteInsight[] = (await entries('insights', locale)).flatMap(entry => {
    const data = entry.data;
    if (!('publishedAt' in data)) return [];
    return [{
      ...data,
      source: 'website',
      type: 'article',
      url: url(locale, `insights/${data.slug}`),
      images: data.coverImage ? [data.coverImage] : [],
      language: language(locale),
      sortOrder: 0,
      entry,
    }];
  });
  return [...internal, ...linkedInInsights(locale)].sort(byPublication);
}

export function insightCategory(locale: Locale, category: typeof pillars[number]) {
  return copy[locale].pillars[pillars.indexOf(category)][0];
}

export function linkedInCover(reference: string | undefined) {
  const cover = reference?.trim();
  if (!cover) return;
  if (z.url({protocol: /^https$/}).safeParse(cover).success) return cover;

  const path = cover.replace(/^\/+/, '');
  const parts = path.split('/');
  if (parts.some(part => !part || part === '.' || part === '..' || /[\\:?#[\]\u0000-\u001f]/.test(part))) return;
  const publicParts = parts.length === 1 ? ['images', ...parts] : parts;
  try {
    if (statSync(resolve('public', ...publicParts), {throwIfNoEntry: false})?.isFile()) {
      return asset(publicParts.map(encodeURIComponent).join('/'));
    }
  } catch {
    // Unreadable paths leave the card without a cover.
  }
}
