import {useEffect,useId,useRef,useState} from 'react';
import {restoreLabInputs,shareFields} from '../lib/lab-sharing';
import {trackLabUse} from '../lib/analytics';
import {timeValue} from '../lib/finance';
import {labCopy} from '../lib/lab-copy';
import {language,type Locale} from '../lib/site';

const fields = [
  ['principal',10000,0,.01,1e9],
  ['rate',8,-99,.01,100],
  ['inflation',4,-99,.01,100],
  ['years',20,1,1,100],
] as const;

export default function TimeValue({locale}:{locale:Locale}) {
  const t = labCopy[locale];
  const [values,setValues] = useState({principal:10000,rate:8,inflation:4,years:20});
  const [selected,setSelected] = useState<number|null>(null);
  const id = useId();
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!form.current) return;
    const restored = restoreLabInputs(form.current,shareFields['time-value']);
    if (restored) setValues({principal:restored.principal,rate:restored.rate,inflation:restored.inflation,years:restored.years});
  },[]);
  const valid = fields.every(([key,,min,,max]) => Number.isFinite(values[key]) && values[key] >= min && values[key] <= max);
  const result = valid ? timeValue(values) : null;
  const points = result?.points || [];
  const last = points.at(-1);
  const point = result && last ? points[Math.min(selected ?? last.year,last.year)] : null;
  const money = new Intl.NumberFormat(language(locale),{style:'currency',currency:'BRL'});
  const integer = new Intl.NumberFormat(language(locale));
  const compact = new Intl.NumberFormat(language(locale),{notation:'compact',maximumSignificantDigits:3});
  const percent = new Intl.NumberFormat(language(locale),{style:'percent',maximumFractionDigits:2});
  const max = Math.max(1,...points.flatMap(p => [p.nominal,p.real]));
  const x = (year:number) => 115 + 495 * year / (last?.year || 1);
  const y = (value:number) => 216 - 196 * value / max;
  const output = result && point ? [money.format(point.nominal),money.format(point.real),percent.format(result.realRate/100)] : [];
  const pt = locale === 'pt';

  return <section className="tool-layout">
    <div className="tool-panel">
      <h2>{t.controls}</h2>
      <form ref={form} className="tool-fields" onSubmit={event => event.preventDefault()} noValidate>
        {fields.map(([name,initial,min,step,max],i) => <label key={name}>{t.timeFields[i]}
          <input name={name} type="number" defaultValue={initial} min={min} step={step} max={max} required
            onChange={event => {
              const value = event.currentTarget.validity.valid ? event.currentTarget.valueAsNumber : NaN;
              const next = {...values,[name]:value};
              if (value !== values[name] && timeValue(next)) trackLabUse('time-value');
              setValues(previous => ({...previous,[name]:value}));
              if (name === 'years') setSelected(null);
            }}/>
        </label>)}
        {!result && <p className="tool-error" role="status">{t.errors.inputs}</p>}
      </form>
      <p className="tool-note">{t.timeNote}</p>
    </div>
    <section className="tool-panel">
      <h2>{t.outcome}</h2>
      <dl className="metrics">{t.timeResults.map((label,i) => <div key={label}><dt>{label}</dt><dd>{output[i] || '—'}</dd></div>)}</dl>
      {point && last && <>
        <svg className="chart" viewBox="0 0 640 255" role="img" aria-label={t.chart}>
          <g className="chart-grid"><path d="M115 20H610M115 69H610M115 118H610M115 167H610M115 216H610M115 20V216"/></g>
          <g textAnchor="end">{[20,69,118,167,216].map((tick,i) => <text key={tick} x="107" y={tick+4}>{compact.format(max * (1-i/4))}</text>)}</g>
          <text x="115" y="239">0</text><text x="610" y="239" textAnchor="end" data-chart-years>{integer.format(last.year)} · {t.year}</text>
          {(['nominal','real'] as const).map(key => <polyline key={key} className={`chart-${key}`} fill="none" strokeWidth="2.5" data-chart-line={key}
            points={points.map(p => `${x(p.year)},${y(p[key])}`).join(' ')}/>)}
          <line className="chart-cursor" x1={x(point.year)} x2={x(point.year)} y1="20" y2="216"/>
          <circle className="chart-nominal chart-dot" cx={x(point.year)} cy={y(point.nominal)} r="4"/>
          <circle className="chart-real chart-dot" cx={x(point.year)} cy={y(point.real)} r="4"/>
        </svg>
        <p className="chart-legend"><span data-nominal-key><i/>{t.nominal}</span><span className="real" data-real-key><i/>{t.real}</span></p>
        <div className="chart-range tool-fields">
          <label htmlFor={id}>{t.year} {integer.format(point.year)}</label>
          <input id={id} type="range" min="0" max={last.year} value={point.year} onChange={event => {
            setSelected(event.currentTarget.valueAsNumber);
            trackLabUse('time-value');
          }}/>
        </div>
      </>}
      <details className="tool-note"><summary>{t.formulas}</summary>
        <p className="formula">{t.nominal} = P × (1 + r)ⁿ<br/>{t.real} = P × [(1 + r) ÷ (1 + i)]ⁿ<br/>{pt ? 'Retorno real' : 'Real return'} = (1 + r) ÷ (1 + i) − 1</p>
        <p>{pt ? 'P = valor inicial, r = retorno nominal, i = inflação, n = anos.' : 'P = starting amount, r = nominal return, i = inflation, n = years.'}</p>
      </details>
    </section>
  </section>;
}
