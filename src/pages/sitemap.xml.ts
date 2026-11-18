import type {APIContext} from 'astro';
import {entries} from '../lib/editorial';
import {labIds,language,locales,sections,url,type Locale} from '../lib/site';

export async function GET({site}:APIContext) {
  const groups: Partial<Record<Locale,string>>[] = ['',...sections,...labIds.map(id => 'labs/' + id)]
    .map(route => Object.fromEntries(locales.map(locale => [locale,url(locale,route)])));
  for (const section of ['insights','library'] as const) {
    const byId = new Map<string,Partial<Record<Locale,string>>>();
    for (const {data} of await entries(section)) {
      const translations = byId.get(data.id) || {};
      translations[data.locale] = url(data.locale,`${section}/${data.slug}`);
      byId.set(data.id,translations);
    }
    groups.push(...byId.values());
  }
  const absolute = (path:string) => new URL(path,site).href.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
  const nodes = groups.flatMap(group => {
    const variants = Object.entries(group) as [Locale,string][];
    const links = variants.length > 1 ? variants.map(([locale,path]) => `<xhtml:link rel="alternate" hreflang="${language(locale)}" href="${absolute(path)}"/>`).join('') : '';
    return variants.map(([,path]) => `<url><loc>${absolute(path)}</loc>${links}</url>`);
  });
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${nodes.join('')}</urlset>`, {headers:{'Content-Type':'application/xml'}});
}
