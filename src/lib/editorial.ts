import { getCollection, type CollectionEntry } from 'astro:content';
import { language, type Locale } from './site';

export type EditorialSection = 'insights' | 'library';
export type Entry = CollectionEntry<EditorialSection>;
export async function entries(section: EditorialSection, locale?: Locale) {
  const all = await getCollection(section);
  const slugs = new Set<string>();
  const ids = new Set<string>();
  for (const item of all) {
    const key = item.data.locale + '/';
    if (!item.id.startsWith(key) || slugs.has(key + item.data.slug) || ids.has(key + item.data.id)) {
      throw new Error(`Invalid locale folder or duplicate slug/ID: ${section}/${item.id}`);
    }
    slugs.add(key + item.data.slug);
    ids.add(key + item.data.id);
  }
  return all.filter(item => !item.data.draft && (!locale || item.data.locale === locale))
    .sort((a, b) => date(b) - date(a) || a.data.title.localeCompare(b.data.title));
}
export function date(item: Entry) {
  return 'publishedAt' in item.data ? item.data.publishedAt.getTime() : 0;
}
export function formattedDate(item: Entry) {
  return new Intl.DateTimeFormat(language(item.data.locale), {dateStyle:'medium', timeZone:'UTC'}).format(date(item));
}
export function readingTime(item: Entry) {
  const words = (item.body || '').replace(/```[\s\S]*?```/g, '').trim().split(/\s+/).filter(Boolean);
  return Math.max(1, Math.ceil(words.length / 220));
}

const labels = {
  en: ['Books', 'Tools', 'Articles', 'Research', 'Frameworks', 'Podcasts', 'People', 'Resources'],
  pt: ['Livros', 'Ferramentas', 'Artigos', 'Pesquisa', 'Métodos', 'Podcasts', 'Pessoas', 'Recursos'],
};
const keys = ['books','tools','articles','research','frameworks','podcasts','people','resources'];
export function resourceLabel(locale: Locale, key: string) {
  return labels[locale][keys.indexOf(key)] || key;
}
