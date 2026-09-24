import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const apiBaseUrl = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001"

async function proxy(
  request: Request,
  context: { params: Promise<{ kind: string }> }
) {
  const { kind } = await context.params
  const headers = new Headers({ accept: "application/json" })
  const authorization = request.headers.get("authorization")
  if (authorization) headers.set("authorization", authorization)

  const hasBody = request.method !== "GET" && request.method !== "HEAD"
  if (hasBody) headers.set("content-type", "application/json")

  const response = await fetch(
    `${apiBaseUrl}/v1/admin/taxonomies/${encodeURIComponent(kind)}`,
    {
      method: request.method,
      headers,
      body: hasBody ? await request.text() : undefined,
      cache: "no-store",
    }
  )

  return new NextResponse(response.body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json",
      "x-request-id": response.headers.get("x-request-id") ?? "",
    },
  })
}

export async function GET(request: Request, context: { params: Promise<{ kind: string }> }) {
  return proxy(request, context)
}

export async function POST(request: Request, context: { params: Promise<{ kind: string }> }) {
  return proxy(request, context)
}

export async function PATCH(request: Request, context: { params: Promise<{ kind: string }> }) {
  return proxy(request, context)
}

export async function DELETE(request: Request, context: { params: Promise<{ kind: string }> }) {
  return proxy(request, context)
}
