import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization")
  const url = new URL(request.url)
  const response = await fetch(
    `${process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001"}/v1/admin/questions${url.search}`,
    {
      headers: authorization ? { authorization } : {},
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

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization")
  const target = new URL(request.url).searchParams.get("action") === "publish-all"
    ? "/v1/admin/questions/bulk-publish"
    : "/v1/admin/questions"
  const response = await fetch(
    `${process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001"}${target}`,
    {
      method: "POST",
      headers: {
        ...(authorization ? { authorization } : {}),
        "content-type": "application/json",
      },
      body: await request.text(),
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

export async function PATCH(request: Request) {
  return forwardMutation(request, "PATCH")
}

export async function DELETE(request: Request) {
  return forwardMutation(request, "DELETE")
}

async function forwardMutation(request: Request, method: "PATCH" | "DELETE") {
  const authorization = request.headers.get("authorization")
  const url = new URL(request.url)
  const id = url.searchParams.get("id")
  if (!id) return NextResponse.json({ message: "Identificador da questão é obrigatório." }, { status: 400 })
  const response = await fetch(
    `${process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001"}/v1/admin/questions/${encodeURIComponent(id)}`,
    { method, headers: { ...(authorization ? { authorization } : {}), "content-type": "application/json" }, body: method === "PATCH" ? await request.text() : undefined, cache: "no-store" }
  )
  return new NextResponse(response.body, { status: response.status, headers: { "content-type": response.headers.get("content-type") ?? "application/json", "x-request-id": response.headers.get("x-request-id") ?? "" } })
}
