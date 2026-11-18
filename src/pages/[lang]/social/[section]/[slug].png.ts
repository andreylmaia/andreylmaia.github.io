import type {APIRoute} from 'astro';
import {Resvg} from '@resvg/resvg-js';
import {entries} from '../../../../lib/editorial';
import {brand,copy,labIds,locales,pillars} from '../../../../lib/site';

export async function getStaticPaths() {
  const articles = (await entries('insights')).map(({data}) => ({
    params:{lang:data.locale,section:'insights',slug:data.slug},
    props:{title:data.title,category:copy[data.locale].pillars[pillars.findIndex(pillar => pillar === data.category)][0]},
  }));
  const labs = locales.flatMap(lang => labIds.map((slug,i) => ({
    params:{lang,section:'labs',slug},
    props:{title:copy[lang].tools[i][0],category:copy[lang].nav[1]},
  })));
  return [...articles,...labs];
}

const escape = (text:string) => text.replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;',
}[char]!));

function wrap(title:string, limit:number) {
  const lines: string[] = [];
  let line = '';
  for (const word of title.match(/\S+/gu) || []) {
    if (line && line.length + word.length + 1 > limit) {
      lines.push(line);
      line = '';
    }
    line = line ? line + ' ' + word : word;
  }
  if (line) lines.push(line);
  return lines;
}

export const GET: APIRoute = ({props}) => {
  const {title,category} = props as {title:string;category:string};
  const lines = wrap(title,32);
  const size = Math.min(66, Math.floor(730 / (Math.max(...lines.map(line => line.length),12) * .76)), Math.floor(300 / Math.max(lines.length,1)));
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M0 32V0H32" fill="none" stroke="#dbeafe"/></pattern></defs>
    <rect width="1200" height="630" fill="#f8fafd"/>
    <rect x="872" width="328" height="630" fill="#edf4ff"/>
    <rect x="872" width="328" height="630" fill="url(#grid)"/>
    <path d="M910 457h68v-72h64v-60h70v-91h49" fill="none" stroke="#2563eb" stroke-width="4"/>
    <g fill="#2563eb"><circle cx="978" cy="385" r="8"/><circle cx="1042" cy="325" r="8"/><circle cx="1112" cy="234" r="8"/></g>
    <g font-family="sans-serif">
      <text x="76" y="110" fill="#2563eb" font-size="26" font-weight="700">${escape(category)}</text>
      <text x="76" y="200" fill="#142743" font-size="${size}" font-weight="700">${lines.map((line,i) => `<tspan x="76" dy="${i ? size * 1.18 : 0}">${escape(line)}</tspan>`).join('')}</text>
      <path d="M76 515h716" stroke="#dbeafe" stroke-width="2"/>
      <text x="76" y="568" fill="#142743" font-size="28" font-weight="700">${escape(brand.name)}</text>
    </g></svg>`;
  return new Response(Uint8Array.from(new Resvg(svg).render().asPng()),{headers:{'Content-Type':'image/png'}});
};
