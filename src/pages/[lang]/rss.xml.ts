import rss from '@astrojs/rss';
import type {APIContext} from 'astro';
import {brand,copy,language,locales,url,type Locale} from '../../lib/site';
import {entries} from '../../lib/editorial';
export const getStaticPaths = () => locales.map(lang => ({params:{lang}}));
export async function GET({params,site}: APIContext) {
  const locale = params.lang as Locale;
  const items = await entries('insights',locale);
  return rss({
    title: `${brand.name} · ${copy[locale].nav[0]}`,
    description:copy[locale].intro,
    site:site!,
    customData:`<language>${language(locale)}</language>`,
    items:items.flatMap(({data}) => 'publishedAt' in data ? [{
      title:data.title,description:data.description,pubDate:data.publishedAt,link:url(locale,'insights/' + data.slug),
    }] : []),
  });
}
