import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { retrievePaymentIntent, confirmPaymentIntent, cancelPaymentIntent, type WireError } from "@/lib/wire/client"

export const runtime = "nodejs"

type Ctx = { params: Promise<{ id: string }> }

/** GET /api/payments/:id — poll a PaymentIntent's current status. */
export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params
  try {
    const intent = await retrievePaymentIntent(id)
    return NextResponse.json({
      id: intent.id,
      status: intent.status,
      amount: intent.amount,
      currency: intent.currency,
      selected_operator: intent.selected_operator ?? null,
      next_action: intent.next_action ?? null,
    })
  } catch (err) {
    const e = err as WireError
    return NextResponse.json({ error: e.message ?? "Wire request failed" }, { status: e.status ?? 502 })
  }
}

/**
 * POST /api/payments/:id  — action router
 * Body: { action: "confirm", operator?: string, returnUrl?: string }
 *     | { action: "cancel" }
 *
 * Kept as a single endpoint so the client never needs to know Wire's exact
 * sub-paths or pass the secret key — everything is dispatched server-side.
 */
export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params
  let body: { action?: string; operator?: string; returnUrl?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  try {
    if (body.action === "confirm") {
      const intent = await confirmPaymentIntent(id, {
        operator: body.operator,
        returnUrl: body.returnUrl,
        idempotencyKey: randomUUID(),
      })
      return NextResponse.json({
        id: intent.id,
        status: intent.status,
        selected_operator: intent.selected_operator ?? null,
        next_action: intent.next_action ?? null,
      })
    }

    if (body.action === "cancel") {
      const intent = await cancelPaymentIntent(id, randomUUID())
      return NextResponse.json({ id: intent.id, status: intent.status })
    }

    return NextResponse.json({ error: "`action` must be \"confirm\" or \"cancel\"" }, { status: 400 })
  } catch (err) {
    const e = err as WireError
    return NextResponse.json({ error: e.message ?? "Wire request failed" }, { status: e.status ?? 502 })
  }
}
