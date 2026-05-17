import assert from 'node:assert/strict';
import test from 'node:test';
import Home from '../../app/page';

test('Home page still redirects to the dashboard in the smoke path', () => {
  assert.throws(() => Home(), (error: unknown) => {
    const redirectError = error as { digest?: string; message?: string };
    return Boolean(
      redirectError.digest?.includes('/dashboard') ||
      redirectError.message?.includes('/dashboard')
    );
  });
});