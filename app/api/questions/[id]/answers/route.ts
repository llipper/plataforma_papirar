import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const authorization = request.headers.get("authorization")
  const { id } = await context.params
  const response = await fetch(
    `${process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001"}/v1/questions/${encodeURIComponent(id)}/answers`,
    {
      method: "POST",
      headers: {
        ...(authorization ? { authorization } : {}),
        "content-type": "application/json",
        "idempotency-key": request.headers.get("idempotency-key") ?? crypto.randomUUID(),
      },
      body: await request.text(),
      cache: "no-store",
    }
  )
  return new NextResponse(response.body, {
    status: response.status,
    headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
  })
}
