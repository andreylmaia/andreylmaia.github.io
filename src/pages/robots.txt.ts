import type {APIContext} from 'astro';
import {asset} from '../lib/site';

export function GET({site}:APIContext) {
  return new Response(`User-agent: *\nSitemap: ${new URL(asset('sitemap.xml'),site)}\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
