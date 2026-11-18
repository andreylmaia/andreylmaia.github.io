export const accountTypes = {settlement:'asset', customer:'liability', recipient:'liability', fees:'revenue'} as const;
export const scenarios = ['deposit','payment','fee','transfer','refund','hold','release'];
const normal = {asset:'debit', liability:'credit', revenue:'credit'};
type Account = keyof typeof accountTypes;
type Side = 'debit' | 'credit';
type Posting = {account:Account; side:Side; cents:number};
type JournalEntry = {scenario:string; cents:number; postings:Posting[]};
type Ledger = {balances:Record<Account,number>; held:number; refundable:number; journal:JournalEntry[]};
type LedgerError = 'amount'|'available'|'refund'|'held'|'scenario'|'balance';
type PostResult = {state:Ledger; error?:never}|{error:LedgerError; state?:never};
type UnitInputs = {volume:number; average:number; rate:number; fee:number; processing:number; fixed:number};
type TimeInputs = {principal:number; rate:number; inflation:number; years:number};

export function initialLedger(): Ledger {
  return {balances:{settlement:0,customer:0,recipient:0,fees:0}, held:0, refundable:0, journal:[]};
}

export function isBalanced(postings: Pick<Posting,'side'|'cents'>[]) {
  let difference = 0;
  for (const {side, cents} of postings) {
    if (!['debit','credit'].includes(side) || !Number.isSafeInteger(cents) || cents <= 0) return false;
    difference += side === 'debit' ? cents : -cents;
    if (!Number.isSafeInteger(difference)) return false;
  }
  return postings.length >= 2 && difference === 0;
}

export function post(state: Ledger, scenario: string, cents: number): PostResult {
  if (!Number.isSafeInteger(cents) || cents <= 0) return {error:'amount'};
  const available = state.balances.customer - state.held;
  const entry = (account:Account, side:Side): Posting => ({account, side, cents});
  let postings: Posting[] = [];
  let held = state.held;
  let refundable = state.refundable;
  switch (scenario) {
    case 'deposit':
      postings = [entry('settlement','debit'),entry('customer','credit')];
      break;
    case 'payment':
      if (cents > available || cents > state.balances.settlement) return {error:'available'};
      postings = [entry('customer','debit'),entry('settlement','credit')];
      refundable += cents;
      break;
    case 'fee':
      if (cents > available) return {error:'available'};
      postings = [entry('customer','debit'),entry('fees','credit')];
      break;
    case 'transfer':
      if (cents > available) return {error:'available'};
      postings = [entry('customer','debit'),entry('recipient','credit')];
      break;
    case 'refund':
      if (cents > refundable) return {error:'refund'};
      postings = [entry('settlement','debit'),entry('customer','credit')];
      refundable -= cents;
      break;
    case 'hold':
      if (cents > available) return {error:'available'};
      held += cents;
      break;
    case 'release':
      if (cents > held) return {error:'held'};
      held -= cents;
      break;
    default: return {error:'scenario'};
  }

  if (postings.length && !isBalanced(postings)) return {error:'balance'};
  const balances = {...state.balances};
  for (const {account,side,cents} of postings) balances[account] += side === normal[accountTypes[account]] ? cents : -cents;
  if (![...Object.values(balances),held,refundable].every(Number.isSafeInteger)) return {error:'amount'};
  return {state:{balances,held,refundable,journal:[...state.journal,{scenario,cents,postings}]}};
}

export function unitEconomics({volume,average,rate,fee,processing,fixed}:UnitInputs) {
  if (![volume,average,rate,fee,processing,fixed].every(n => Number.isFinite(n) && n >= 0) || !Number.isSafeInteger(volume)) return null;
  // Cents multiplied by basis points give millionths of one real.
  const averageCents = Math.round(average * 100);
  const fixedCents = Math.round(fixed * 100);
  const revenueMicro = averageCents * Math.round(rate * 100) + Math.round(fee * 100) * 10000;
  const costMicro = averageCents * Math.round(processing * 100);
  const marginMicro = revenueMicro - costMicro;
  const fixedMicro = fixedCents * 10000;
  if (![revenueMicro,costMicro,fixedMicro].every(Number.isSafeInteger)) return null;
  const revenue = revenueMicro * volume / 1e6;
  const costs = costMicro * volume / 1e6;
  const margin = marginMicro * volume / 1e6;
  const profit = (marginMicro * volume - fixedMicro) / 1e6;
  const breakEven = fixedMicro === 0 ? 0 : marginMicro > 0 ? Math.ceil(fixedMicro / marginMicro) : null;
  if (![revenue,costs,margin,profit,breakEven ?? 0].every(Number.isFinite)) return null;
  return {revenue,costs,margin,profit,breakEven};
}

export function timeValue({principal,rate,inflation,years}:TimeInputs) {
  if (![principal,rate,inflation,years].every(Number.isFinite) || principal < 0 || rate <= -100 || inflation <= -100 || !Number.isInteger(years) || years < 1 || years > 100) return null;
  const nominalFactor = 1 + rate / 100;
  const realFactor = nominalFactor / (1 + inflation / 100);
  const points = Array.from({length:years + 1}, (_,year) => ({
    year,nominal:principal * nominalFactor ** year,real:principal * realFactor ** year,
  }));
  if (points.some(({nominal,real}) => !Number.isFinite(nominal) || !Number.isFinite(real))) return null;
  return {realRate:(realFactor - 1) * 100,points};
}
