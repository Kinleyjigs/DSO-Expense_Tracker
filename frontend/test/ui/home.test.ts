import assert from 'node:assert/strict';
import test from 'node:test';
import Home from '../../app/page';

test('Home redirects users to the dashboard', () => {
  assert.throws(() => Home(), (error: unknown) => {
    const redirectError = error as { digest?: string; message?: string };
    return Boolean(
      redirectError.digest?.includes('/dashboard') ||
      redirectError.message?.includes('/dashboard')
    );
  });
});