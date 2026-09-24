import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization")
  const response = await fetch(
    `${process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001"}/v1/me`,
    {
      headers: authorization ? { authorization } : undefined,
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
