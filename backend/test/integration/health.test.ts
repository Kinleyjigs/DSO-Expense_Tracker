import assert from "node:assert/strict";
import test from "node:test";
import app from "../../src/server.js";

test("GET /api/health returns a healthy response", async () => {
  const server = app.listen(0);

  try {
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Test server did not start on a port");
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    const payload = (await response.json()) as {
      success: boolean;
      message: string;
      timestamp: string;
    };

    assert.equal(response.status, 200);
    assert.equal(payload.success, true);
    assert.equal(payload.message, "API is running");
    assert.equal(typeof payload.timestamp, "string");
  } finally {
    server.close();
  }
});