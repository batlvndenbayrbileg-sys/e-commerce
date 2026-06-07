// ============================================================================
// Wire Payment (api.wirepayment.mn) — SERVER-ONLY client
//
// ⚠️  IMPORTANT — DO NOT import this file from a Client Component ("use client")
//     or anywhere that ends up in the browser bundle. It reads `WIRE_SECRET_KEY`
//     from process.env, and that key must NEVER reach the client — anyone who
//     gets it can create/confirm/cancel real MNT charges on your account.
//
//     ✅ Safe: Route Handlers (app/api/**/route.ts), Server Actions, RSC data loaders
//     ❌ Unsafe: components marked "use client", anything passed to the browser
//
// Add the secret to `.env.local` (already gitignored):
//     WIRE_SECRET_KEY=sk_live_...
//     WIRE_WEBHOOK_SECRET=whsec_...           (from the webhook endpoint you create)
// Never prefix these with NEXT_PUBLIC_ — that would bundle them into client JS.
// ============================================================================

if (typeof window !== "undefined") {
  throw new Error(
    "lib/wire/client.ts was imported into client/browser code. " +
    "This file holds your Wire secret key and must only run on the server."
  )
}

const WIRE_BASE_URL = "https://api.wirepayment.mn"

function getSecretKey(): string {
  const key = process.env.WIRE_SECRET_KEY
  if (!key) {
    throw new Error(
      "WIRE_SECRET_KEY is not set. Add it to .env.local — get it from the Wire dashboard → API keys. " +
      "Never commit it or expose it as NEXT_PUBLIC_*."
    )
  }
  return key
}

export type WireError = Error & { status?: number; code?: string; requestId?: string }

type RequestOpts = {
  method?: "GET" | "POST" | "DELETE"
  path: string
  body?: Record<string, unknown>
  idempotencyKey?: string
}

async function wireRequest<T = unknown>({ method = "GET", path, body, idempotencyKey }: RequestOpts): Promise<T> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${getSecretKey()}`,
  }
  if (body !== undefined) headers["Content-Type"] = "application/json"
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey

  const res = await fetch(`${WIRE_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  })

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    const message = json?.error?.message || `Wire API request failed (HTTP ${res.status})`
    const err = new Error(message) as WireError
    err.status = res.status
    err.code = json?.error?.code
    err.requestId = json?.error?.request_id
    throw err
  }

  return json as T
}

// ── PaymentIntents ──────────────────────────────────────────────────────────

export type PaymentIntentStatus =
  | "new"
  | "requires_payment_method"
  | "requires_action"
  | "requires_capture"
  | "processing"
  | "succeeded"
  | "canceled"

export interface PaymentIntent {
  id: string
  object: "payment_intent"
  amount: number
  currency: "MNT"
  status: PaymentIntentStatus
  client_secret: string
  automatic_operator: boolean
  allowed_operators: string[]
  selected_operator: string | null
  next_action: unknown | null
  metadata: Record<string, unknown>
  livemode: boolean
  created: number
  expires_at: number | null
}

export interface Charge {
  id: string
  object: "charge"
  payment_intent: string
  operator: string
  operator_charge_id: string | null
  status: "pending" | "succeeded" | "failed"
  amount: number
  fee: number
  amount_refunded: number
  failure_code: string | null
  failure_message: string | null
  livemode: boolean
  created: number
}

export interface WireEvent<T = Record<string, unknown>> {
  id: string
  object: "event"
  type: string
  api_version: string
  data: { object: T } & Record<string, unknown>
  livemode: boolean
  created: number
}

export interface WebhookEndpoint {
  id: string
  object: "webhook_endpoint"
  url: string
  enabled_events: string[]
  status: "enabled" | "disabled"
  livemode: boolean
  created: number
}

/** Returned only once, at creation — store it (e.g. WIRE_WEBHOOK_SECRET) immediately. */
export interface WebhookEndpointWithSecret extends WebhookEndpoint {
  secret: string
}

export interface OperatorConnection {
  id: string
  object: "operator_connection"
  operator: string
  mode: "byo" | "reseller"
  status: string
  capabilities: string[]
  created: number
}

export interface OperatorConnectionTest {
  object: "operator_connection_test"
  operator: string
  status: string
  capabilities: string[]
}

export interface ListResponse<T> {
  object: "list"
  url: string
  has_more: boolean
  data: T[]
}

/** Create a PaymentIntent. `amount` is MNT in minor (whole-tögrög integer) units. */
export function createPaymentIntent(params: {
  amount: number
  metadata?: Record<string, unknown>
  automaticOperator?: boolean
  allowedOperators?: string[]
  idempotencyKey: string
}) {
  if (!Number.isInteger(params.amount) || params.amount <= 0) {
    throw new Error("amount must be a positive integer (MNT, no decimals)")
  }
  return wireRequest<PaymentIntent>({
    method: "POST",
    path: "/v1/payment_intents",
    idempotencyKey: params.idempotencyKey,
    body: {
      amount: params.amount,
      currency: "MNT",
      automatic_operator: params.automaticOperator ?? true,
      allowed_operators: params.allowedOperators ?? [],
      metadata: params.metadata ?? {},
    },
  })
}

export function retrievePaymentIntent(id: string) {
  return wireRequest<PaymentIntent>({ path: `/v1/payment_intents/${encodeURIComponent(id)}` })
}

export function confirmPaymentIntent(
  id: string,
  params: { operator?: string; returnUrl?: string; idempotencyKey: string }
) {
  return wireRequest<PaymentIntent>({
    method: "POST",
    path: `/v1/payment_intents/${encodeURIComponent(id)}/confirm`,
    idempotencyKey: params.idempotencyKey,
    body: {
      operator: params.operator,
      return_url: params.returnUrl,
    },
  })
}

export function cancelPaymentIntent(id: string, idempotencyKey: string) {
  return wireRequest<PaymentIntent>({
    method: "POST",
    path: `/v1/payment_intents/${encodeURIComponent(id)}/cancel`,
    idempotencyKey,
  })
}

function listQuery(params?: { limit?: number; startingAfter?: string; [k: string]: unknown }) {
  if (!params) return ""
  const qs = new URLSearchParams()
  if (params.limit != null) qs.set("limit", String(params.limit))
  if (params.startingAfter) qs.set("starting_after", params.startingAfter)
  for (const [k, v] of Object.entries(params)) {
    if (k === "limit" || k === "startingAfter" || v == null) continue
    qs.set(k, String(v))
  }
  const s = qs.toString()
  return s ? `?${s}` : ""
}

// ── Charges (read-only) ─────────────────────────────────────────────────────

export function listCharges(params?: { limit?: number; startingAfter?: string; paymentIntent?: string }) {
  return wireRequest<ListResponse<Charge>>({
    path: `/v1/charges${listQuery({ ...params, payment_intent: params?.paymentIntent })}`,
  })
}

export function retrieveCharge(id: string) {
  return wireRequest<Charge>({ path: `/v1/charges/${encodeURIComponent(id)}` })
}

// ── Events (read-only, replayable) ──────────────────────────────────────────

export function listEvents(params?: { limit?: number; startingAfter?: string; type?: string }) {
  return wireRequest<ListResponse<WireEvent>>({ path: `/v1/events${listQuery(params)}` })
}

export function retrieveEvent(id: string) {
  return wireRequest<WireEvent>({ path: `/v1/events/${encodeURIComponent(id)}` })
}

// ── Webhook endpoints ────────────────────────────────────────────────────────

export function listWebhookEndpoints(params?: { limit?: number; startingAfter?: string }) {
  return wireRequest<ListResponse<WebhookEndpoint>>({ path: `/v1/webhook_endpoints${listQuery(params)}` })
}

/** Returns the signing `secret` (whsec_...) — capture it immediately, it's shown only once. */
export function createWebhookEndpoint(params: {
  url: string
  enabledEvents: string[]
  idempotencyKey: string
}) {
  return wireRequest<WebhookEndpointWithSecret>({
    method: "POST",
    path: "/v1/webhook_endpoints",
    idempotencyKey: params.idempotencyKey,
    body: { url: params.url, enabled_events: params.enabledEvents },
  })
}

export function retrieveWebhookEndpoint(id: string) {
  return wireRequest<WebhookEndpoint>({ path: `/v1/webhook_endpoints/${encodeURIComponent(id)}` })
}

export function updateWebhookEndpoint(
  id: string,
  params: { url?: string; enabledEvents?: string[]; status?: "enabled" | "disabled" }
) {
  return wireRequest<WebhookEndpoint>({
    method: "POST",
    path: `/v1/webhook_endpoints/${encodeURIComponent(id)}`,
    body: { url: params.url, enabled_events: params.enabledEvents, status: params.status },
  })
}

export function deleteWebhookEndpoint(id: string) {
  return wireRequest<{ id: string; object: string; deleted: true }>({
    method: "DELETE",
    path: `/v1/webhook_endpoints/${encodeURIComponent(id)}`,
  })
}

// ── Operator connections (e.g. QPay) ─────────────────────────────────────────

export function listOperatorConnections(params?: { limit?: number; startingAfter?: string }) {
  return wireRequest<ListResponse<OperatorConnection>>({ path: `/v1/operator_connections${listQuery(params)}` })
}

/** "byo" = bring your own operator credentials; "reseller" = use Wire's. */
export function createOperatorConnection(params: {
  operator: string
  mode: "byo" | "reseller"
  credentials?: Record<string, unknown>
  idempotencyKey: string
}) {
  return wireRequest<OperatorConnection>({
    method: "POST",
    path: "/v1/operator_connections",
    idempotencyKey: params.idempotencyKey,
    body: { operator: params.operator, mode: params.mode, credentials: params.credentials },
  })
}

export function retrieveOperatorConnection(id: string) {
  return wireRequest<OperatorConnection>({ path: `/v1/operator_connections/${encodeURIComponent(id)}` })
}

export function deleteOperatorConnection(id: string) {
  return wireRequest<{ id: string; object: string; deleted: true }>({
    method: "DELETE",
    path: `/v1/operator_connections/${encodeURIComponent(id)}`,
  })
}

export function testOperatorConnection(id: string) {
  return wireRequest<OperatorConnectionTest>({
    method: "POST",
    path: `/v1/operator_connections/${encodeURIComponent(id)}/test`,
  })
}
