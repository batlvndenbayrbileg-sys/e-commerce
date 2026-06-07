import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

// Per Wire's docs: webhooks only ever originate from this IP, and every
// request carries a `WirePayment-Signature: t=<unix>,v1=<hex hmac-sha256>`
// header signing `${t}.${rawBody}` with your endpoint secret.
const WIRE_WEBHOOK_IP = "65.109.117.186"
const TOLERANCE_SECONDS = 5 * 60 // reject events older than 5 minutes (anti-replay)

function getClientIp(req: NextRequest): string | null {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]?.trim() ?? null
  return req.headers.get("x-real-ip")
}

function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header || !secret) return false

  const parts: Record<string, string> = {}
  for (const segment of header.split(",")) {
    const [k, v] = segment.split("=")
    if (k && v) parts[k.trim()] = v.trim()
  }
  const { t, v1 } = parts
  if (!t || !v1) return false

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(t))
  if (!Number.isFinite(ageSeconds) || ageSeconds > TOLERANCE_SECONDS) return false

  const expectedHex = crypto.createHmac("sha256", secret).update(`${t}.${rawBody}`).digest("hex")

  const expected = Buffer.from(expectedHex, "hex")
  const given = Buffer.from(v1, "hex")
  if (expected.length !== given.length) return false
  return crypto.timingSafeEqual(expected, given)
}

/**
 * POST /api/payments/webhook
 *
 * Register this URL in the Wire dashboard (`/v1/webhook_endpoints`), copy the
 * returned `secret` into `WIRE_WEBHOOK_SECRET` in `.env.local`.
 *
 * NOTE: webhooks are an *optional* notification channel — Wire confirms
 * payments itself regardless. This endpoint just keeps your own `orders`
 * table (Supabase) in sync so the UI/admin dashboard reflect paid status
 * without polling.
 */
export async function POST(req: NextRequest) {
  // 1) IP allowlist
  const ip = getClientIp(req)
  if (ip && ip !== WIRE_WEBHOOK_IP) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  // 2) Signature — must read the *raw* body (not req.json()) to verify HMAC
  const rawBody = await req.text()
  const signature = req.headers.get("wirepayment-signature")
  const secret = process.env.WIRE_WEBHOOK_SECRET

  if (!secret) {
    console.error("[wire-webhook] WIRE_WEBHOOK_SECRET is not set — rejecting event")
    return NextResponse.json({ error: "webhook not configured" }, { status: 500 })
  }
  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 })
  }

  let event: { id?: string; type?: string; data?: { object?: Record<string, any> } }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  // 3) React to the event — keep this fast; Wire expects a prompt 2xx.
  try {
    await syncOrderFromEvent(event)
  } catch (err) {
    // Log but still acknowledge — we don't want Wire endlessly retrying
    // because of a transient DB hiccup on our side.
    console.error("[wire-webhook] failed to sync order:", err)
  }

  return NextResponse.json({ received: true })
}

async function syncOrderFromEvent(event: { type?: string; data?: { object?: Record<string, any> } }) {
  const intent = event.data?.object
  if (!intent?.id) return

  const orderId = intent.metadata?.order_id as string | undefined
  if (!orderId) return // not one of ours (or no order linkage configured)

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return // Supabase not configured — nothing to sync

  // Service-role client: webhooks have no user session, and RLS would
  // otherwise block this write. Keep SUPABASE_SERVICE_ROLE_KEY server-only.
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

  const statusByEvent: Record<string, string> = {
    "payment_intent.succeeded": "paid",
    "payment_intent.failed": "failed",
    "payment_intent.canceled": "canceled",
  }
  const nextStatus = event.type ? statusByEvent[event.type] : undefined
  if (!nextStatus) return

  await supabase
    .from("orders")
    .update({ status: nextStatus, payment_intent_id: intent.id })
    .eq("id", orderId)
}
