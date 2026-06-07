import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { createPaymentIntent, type WireError } from "@/lib/wire/client"

export const runtime = "nodejs"

/**
 * POST /api/payments/create-intent
 * Body: { amount: number (MNT, integer ₮), metadata?: object, automaticOperator?: boolean }
 *
 * Creates a Wire PaymentIntent. Called from the client at the start of checkout —
 * the Wire secret key never leaves the server (see lib/wire/client.ts).
 */
export async function POST(req: NextRequest) {
  let body: { amount?: unknown; metadata?: Record<string, unknown>; automaticOperator?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const amount = Number(body.amount)
  if (!Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "`amount` must be a positive whole number of MNT (₮), e.g. 1240000" },
      { status: 400 }
    )
  }

  try {
    const intent = await createPaymentIntent({
      amount,
      metadata: body.metadata ?? {},
      automaticOperator: body.automaticOperator ?? true,
      // Generated server-side per request so retries from the client (e.g. a
      // double-click) don't create duplicate PaymentIntents on Wire's side.
      idempotencyKey: randomUUID(),
    })

    // Only return what the client needs to continue the flow.
    return NextResponse.json({
      id: intent.id,
      client_secret: intent.client_secret,
      status: intent.status,
      amount: intent.amount,
      currency: intent.currency,
      expires_at: intent.expires_at,
    })
  } catch (err) {
    const e = err as WireError
    return NextResponse.json({ error: e.message ?? "Wire request failed" }, { status: e.status ?? 502 })
  }
}
