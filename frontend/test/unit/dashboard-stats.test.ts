import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateSummaryStats } from '../../lib/dashboard-stats';

test('calculateSummaryStats computes monthly totals and averages', () => {
  const stats = calculateSummaryStats(
    [
      { amount: 20, date: '2026-05-02' },
      { amount: 30, date: '2026-05-10' },
      { amount: 10, date: '2026-04-15' },
    ],
    new Date('2026-05-17T12:00:00.000Z')
  );

  assert.equal(stats.thisMonthTotal, 50);
  assert.equal(stats.transactionCount, 2);
  assert.equal(stats.avgPerTransaction, 20);
  assert.equal(stats.lastMonthTransactions, 1);
});