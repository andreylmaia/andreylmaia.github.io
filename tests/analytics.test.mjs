import test from 'node:test';
import assert from 'node:assert/strict';
import {campaignParams} from '../src/lib/analytics.ts';

test('passes public UTM labels and drops unrelated or unsafe query values', () => {
  const input = '?utm_source=linkedin&utm_medium=organic_social&utm_campaign=payments-2026&utm_id=123456789&utm_term=hello%40example.com&utm_content=two+words&q=private&gclid=external';
  assert.equal(campaignParams(input), 'utm_source=linkedin&utm_medium=organic_social&utm_campaign=payments-2026');
});
