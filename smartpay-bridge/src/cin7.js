const { purchase, refund, cancel, getStatus } = require("./smartpay");

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function requireIdempotency(req) {
  const key = req.headers["idempotency-key"];
  if (!key) throw new Error("Missing Idempotency-Key");
  return String(key);
}

async function handleCin7Request(req) {
  // IMPORTANT:
  // These routes are a temporary bridge contract for development.
  // They are NOT yet the real Cin7/Linkly request shape.
  if (req.method === "POST" && req.url === "/payment/purchase") {
    const body = await readJson(req);
    const idempotencyKey = requireIdempotency(req);
    const result = await purchase({ ...body, idempotencyKey });
    return { status: 200, body: result };
  }

  if (req.method === "POST" && req.url === "/payment/refund") {
    const body = await readJson(req);
    const idempotencyKey = requireIdempotency(req);
    const result = await refund({ ...body, idempotencyKey });
    return { status: 200, body: result };
  }

  if (req.method === "POST" && req.url === "/payment/cancel") {
    const body = await readJson(req);
    const result = await cancel(body);
    return { status: 200, body: result };
  }

  if (req.method === "GET" && req.url.startsWith("/payment/")) {
    const id = decodeURIComponent(req.url.slice("/payment/".length));
    const result = await getStatus(id);
    return { status: 200, body: result };
  }

  return {
    status: 404,
    body: { ok: false, error: "not_found" }
  };
}

module.exports = { handleCin7Request };
