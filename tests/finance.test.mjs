import test from 'node:test';
import assert from 'node:assert/strict';
import {initialLedger,post,isBalanced,timeValue,unitEconomics} from '../src/lib/finance.ts';

test('posts balanced deposits, payments, fees, transfers and refunds in integer cents', () => {
  let state = initialLedger();
  for (const [scenario,cents] of [['deposit',15000],['payment',10000],['fee',200],['transfer',1000],['refund',2500]]) {
    const prior = state;
    state = post(state,scenario,cents).state;
    assert.ok(isBalanced(state.journal.at(-1).postings));
    assert.notEqual(state.balances,prior.balances);
  }
  assert.deepEqual(state.balances,{settlement:7500,customer:6300,recipient:1000,fees:200});
  assert.equal(state.refundable,7500);
  assert.equal(post(state,'refund',7501).error,'refund');
});

test('holds and releases preserve the ledger and protect available funds', () => {
  const funded = post(initialLedger(),'deposit',15000).state;
  const reserved = post(funded,'hold',12000).state;
  assert.equal(reserved.held,12000);
  assert.deepEqual(reserved.balances,funded.balances);
  assert.deepEqual(reserved.journal.at(-1).postings,[]);
  assert.equal(post(reserved,'payment',3001).error,'available');
  assert.equal(post(reserved,'release',12001).error,'held');
  assert.equal(post(reserved,'release',12000).state.held,0);
  assert.equal(post(reserved,'deposit',1.5).error,'amount');
  assert.equal(post(reserved,'deposit',Number.MAX_SAFE_INTEGER).error,'amount');
  assert.equal(isBalanced([{side:'debit',cents:100},{side:'credit',cents:99}]),false);
});

test('calculates operating profit and break-even volume', () => {
  const inputs = {volume:10000,average:100,rate:1.5,fee:.3,processing:.8,fixed:5000};
  assert.deepEqual(unitEconomics(inputs),{revenue:18000,costs:8000,margin:10000,profit:5000,breakEven:5000});
  assert.equal(unitEconomics({...inputs,processing:3}).breakEven,null);
  assert.equal(unitEconomics({...inputs,volume:0}).profit,-5000);
  assert.equal(unitEconomics({...inputs,fixed:5000.1}).breakEven,5001);
});

test('compounds nominal returns and discounts for inflation', () => {
  const result = timeValue({principal:1000,rate:10,inflation:10,years:2});
  assert.equal(result.points.at(-1).real,1000);
  assert.ok(Math.abs(result.points.at(-1).nominal-1210)<1e-8);
  assert.equal(result.realRate,0);
  assert.equal(timeValue({principal:1000,rate:0,inflation:-100,years:2}),null);
});
