import {track} from './analytics';
import {brand,labIds} from './site';

type LabId = typeof labIds[number];
export const shareFields = {
  'unit-economics':['volume','average','rate','fee','processing','fixed'],
  'time-value':['principal','rate','inflation','years'],
} as const;

export function restoreLabInputs(form:HTMLFormElement,names:readonly string[]) {
  if (!location.hash.startsWith('#sim=')) return;
  const parameters = new URLSearchParams(location.hash.slice(5));
  const inputs = names.map(name => form.elements.namedItem(name) as HTMLInputElement);
  const previous = inputs.map(input => input.value);
  const values = names.map(name => parameters.get(name) || '');
  if (!values.every(value => /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(value))) return;
  inputs.forEach((input,i) => { input.value = values[i]; });
  if (inputs.every(input => input.validity.valid)) {
    return Object.fromEntries(inputs.map(input => [input.name,input.valueAsNumber]));
  }
  inputs.forEach((input,i) => { input.value = previous[i]; });
}

function lines(ctx:CanvasRenderingContext2D,text:string,width:number) {
  const result:string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && ctx.measureText(line + ' ' + word).width > width) {
      result.push(line);
      line = '';
    }
    if (ctx.measureText(word).width <= width) {
      line = line ? line + ' ' + word : word;
      continue;
    }
    for (const character of word) {
      if (ctx.measureText(line + character).width > width) {
        result.push(line);
        line = '';
      }
      line += character;
    }
  }
  if (line) result.push(line);
  return result;
}

async function exportImage(title:string,sections:string[][],chart:SVGSVGElement|null,id:LabId) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw Error('Canvas unavailable');
  const width = 1200;
  const font = 'system-ui, sans-serif';
  const blocks = sections.map((section,i) => {
    const size = i === 0 ? 31 : i === 1 ? 25 : 21;
    ctx.font = `${i === 0 ? 650 : 400} ${size}px ${font}`;
    return {size,font:ctx.font,lines:section.flatMap(line => lines(ctx,line,width - 144))};
  });
  ctx.font = 'bold 60px ' + font;
  const titles = lines(ctx,title,width - 144);
  canvas.width = width;
  canvas.height = 200 + titles.length * 68 + blocks.reduce((sum,block) => sum + 28 + block.lines.length * (block.size + 10),0) + (chart ? 310 : 0);
  ctx.fillStyle = '#f8fafd';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(0,0,width,12);
  ctx.font = 'bold 26px ' + font;
  ctx.fillText(brand.name,72,86);
  ctx.fillStyle = '#142743';
  ctx.font = 'bold 60px ' + font;
  let y = 156;
  for (const line of titles) { ctx.fillText(line,72,y); y += 68; }
  for (const [i,block] of blocks.entries()) {
    if (i === 1 && chart) {
      ctx.save();
      ctx.translate(72,y - 42);
      ctx.scale(1.1,1.1);
      ctx.strokeStyle = '#c4d1e0';
      ctx.lineWidth = 1;
      ctx.stroke(new Path2D(chart.querySelector('.chart-grid path')?.getAttribute('d') || ''));
      ctx.font = '14px ' + font;
      ctx.fillStyle = '#536581';
      for (const label of chart.querySelectorAll('text')) {
        ctx.textAlign = label.closest('[text-anchor=end]') ? 'right' : 'left';
        ctx.fillText(label.textContent || '',Number(label.getAttribute('x')),Number(label.getAttribute('y')));
      }
      for (const series of chart.querySelectorAll<SVGPolylineElement>('[data-chart-line]')) {
        const real = series.dataset.chartLine === 'real';
        ctx.strokeStyle = real ? '#126749' : '#2563eb';
        ctx.setLineDash(real ? [8,5] : []);
        ctx.lineWidth = 3;
        ctx.beginPath();
        Array.from(series.points).forEach((point,index) => {
          if (index) ctx.lineTo(point.x,point.y);
          else ctx.moveTo(point.x,point.y);
        });
        ctx.stroke();
      }
      ctx.restore();
      ctx.font = '22px ' + font;
      ctx.fillStyle = '#536581';
      ctx.fillText(chart.getAttribute('aria-label') || '',72,y + 240);
      y += 300;
    }
    ctx.fillStyle = i === 0 ? '#142743' : '#536581';
    ctx.font = block.font;
    for (const line of block.lines) { ctx.fillText(line,72,y); y += block.size + 10; }
    y += 28;
  }
  const blob = await new Promise<Blob|null>(resolve => canvas.toBlob(resolve,'image/png'));
  if (!blob) throw Error('PNG generation failed');
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = `${id}-andrey-maia.png`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(href),30_000);
}

export function bindLabSharing(root:HTMLElement) {
  const id = root.dataset.shareLab as LabId;
  if (!labIds.includes(id)) return;
  const tool = root.closest<HTMLElement>('[data-analytics-lab]')!;
  const status = root.querySelector<HTMLElement>('[role=status]')!;
  const title = root.dataset.title!;
  const canonical = new URL(document.querySelector<HTMLLinkElement>('link[rel=canonical]')!.href);
  const {done,failed,invalid} = root.dataset;
  const fields = id === 'ledger' ? [] : shareFields[id];
  const native = root.querySelector<HTMLButtonElement>('[data-result-action=native]')!;
  native.hidden = typeof navigator.share !== 'function';
  root.hidden = false;

  root.addEventListener('click',async event => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    const action = event.target.dataset.resultAction;
    if (!action) return;
    const form = tool.querySelector('form')!;
    const inputs = fields.map(name => form.elements.namedItem(name) as HTMLInputElement);
    const metrics = [...tool.querySelectorAll('dl.metrics > div')];
    const hasLedgerState = !!tool.querySelector('[data-journal] tr');
    if (inputs.some(input => !input.validity.valid) || metrics.some(metric => metric.querySelector('dd')?.textContent === '—') || (id === 'ledger' && !hasLedgerState)) {
      status.textContent = invalid!;
      return;
    }
    const result = metrics.map(metric => `${metric.querySelector('dt')?.textContent} · ${metric.querySelector('dd')?.textContent}`);
    const assumptions = inputs.map(input => `${input.labels?.[0].textContent?.trim()} · ${input.value}`);
    if (id === 'ledger') {
      const item = tool.querySelector<HTMLElement>('[data-last-applied]');
      if (item?.textContent) assumptions.push(item.textContent);
    }
    const chart = tool.querySelector<SVGSVGElement>('svg.chart');
    if (chart) {
      assumptions.push(tool.querySelector('.chart-range label')?.textContent || '');
      assumptions.push(tool.querySelector('[data-nominal-key]')!.textContent + ' ━ / ' + tool.querySelector('[data-real-key]')!.textContent + ' ┄');
    }
    const sections = [result,assumptions,[root.dataset.note!,canonical.href]];
    const summary = [title,brand.name,...sections.map(section => section.join('\n'))].join('\n\n');
    try {
      if (action === 'png') {
        await exportImage(title,sections,chart,id);
        track('lab_result_exported',{lab_id:id});
      } else if (action === 'native') {
        await navigator.share({title,text:summary});
        track('lab_result_shared',{lab_id:id,share_method:'native'});
      } else if (action === 'url') {
        const link = new URL(canonical);
        link.hash = 'sim=' + new URLSearchParams(inputs.map(input => [input.name,input.value]));
        await navigator.clipboard.writeText(link.href);
        track('lab_result_shared',{lab_id:id,share_method:'url'});
      } else {
        await navigator.clipboard.writeText(summary);
        track('lab_result_shared',{lab_id:id,share_method:'copy'});
      }
      status.textContent = done!;
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) status.textContent = failed!;
    }
  });
}
