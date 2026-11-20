import type { APIRoute } from 'astro';
import { insightCategory, linkedInInsights } from '../../lib/insights';
import { locales, type Locale } from '../../lib/site';

export const getStaticPaths = () => locales.map(lang => ({params: {lang}}));

export const GET: APIRoute = ({params}) => {
  const locale = params.lang as Locale;
  return Response.json(linkedInInsights(locale).map(item => ({
    url: item.url,
    title: item.title,
    description: item.description,
    keywords: [insightCategory(locale, item.category), ...item.tags].join(' '),
  })));
};
