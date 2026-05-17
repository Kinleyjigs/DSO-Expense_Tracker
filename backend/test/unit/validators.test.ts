import assert from "node:assert/strict";
import test from "node:test";
import { createExpenseSchema, registerSchema } from "../../src/utils/validators.js";

test("registerSchema accepts valid credentials", () => {
  const result = registerSchema.safeParse({
    email: "user@example.com",
    password: "secret123",
    name: "User Name",
  });

  assert.equal(result.success, true);
});

test("createExpenseSchema converts a date string", () => {
  const result = createExpenseSchema.parse({
    amount: 42.5,
    description: "Lunch",
    date: "2026-05-17",
    categoryId: "cat-1",
  });

  assert.equal(result.date instanceof Date, true);
  assert.equal(result.date.toISOString().startsWith("2026-05-17"), true);
});