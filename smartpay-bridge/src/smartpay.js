const crypto = require("crypto");

const mode = process.env.BRIDGE_MODE || "mock";
const mockPayments = new Map();

function validateAmount(amount) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("amount must be a positive integer in cents");
  }
}

async function purchase(input) {
  validateAmount(input.amount);

  if (mode !== "mock") {
    throw new Error(
      "Smartpay live adapter not implemented: vendor SmartConnect API documentation and test credentials are required"
    );
  }

  const id = crypto.randomUUID();
  const payment = {
    ok: true,
    id,
    status: "pending",
    amount: input.amount,
    currency: input.currency || "AUD",
    reference: input.reference || null,
    idempotencyKey: input.idempotencyKey
  };
  mockPayments.set(id, payment);
  return payment;
}

async function refund(input) {
  validateAmount(input.amount);

  if (mode !== "mock") {
    throw new Error(
      "Smartpay live refund adapter not implemented: vendor documentation is required"
    );
  }

  return {
    ok: true,
    id: crypto.randomUUID(),
    status: "pending",
    type: "refund",
    amount: input.amount,
    originalPaymentId: input.originalPaymentId || null
  };
}

async function cancel(input) {
  if (mode !== "mock") {
    throw new Error(
      "Smartpay live cancel adapter not implemented: vendor documentation is required"
    );
  }

  const payment = mockPayments.get(input.id);
  if (payment) {
    payment.status = "cancelled";
    mockPayments.set(input.id, payment);
  }

  return { ok: true, id: input.id || null, status: "cancelled" };
}

async function getStatus(id) {
  if (mode !== "mock") {
    throw new Error(
      "Smartpay live status adapter not implemented: vendor documentation is required"
    );
  }

  return mockPayments.get(id) || { ok: false, id, status: "not_found" };
}

module.exports = { purchase, refund, cancel, getStatus };
