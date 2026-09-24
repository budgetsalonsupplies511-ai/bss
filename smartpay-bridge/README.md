# Cin7 Omni -> Smartpay Bridge (scaffold)

This folder is the starting point for a payment bridge for Budget Salon Supplies:

Cin7 Omni POS -> local bridge -> Smartpay SmartConnect -> PAX A920 Pro

## Status

This is a non-production scaffold. It does **not** submit real payments yet.

The bridge is intentionally blocked from live payment processing until we have:
1. Smartpay SmartConnect developer/API documentation.
2. Smartpay sandbox/test credentials.
3. The exact Cin7 Omni / Linkly local request and response contract Cin7 expects.
4. A test plan covering approvals, declines, cancels, timeouts, reversals, refunds, duplicate prevention and reconciliation.

## Proposed local endpoints

- GET /health
- POST /payment/purchase
- POST /payment/refund
- POST /payment/cancel
- GET /payment/:id

## Safety rules

- Never mark a payment approved without an authoritative Smartpay approval response.
- Every purchase/refund request must carry an idempotency key.
- Persist terminal/payment state before replying to Cin7.
- Treat timeouts as unknown until status is reconciled.
- Do not automatically retry financial transactions after an unknown result.
- Never log PAN, CVV, track data or other cardholder data.

## Environment

Copy .env.example and configure only test credentials first.

## Next implementation step

Map the real SmartConnect API into src/smartpay.js and map Cin7's local Linkly-compatible request/response format into src/cin7.js after receiving vendor documentation.
