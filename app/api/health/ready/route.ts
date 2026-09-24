export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const apiUrl = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001"
    const response = await fetch(`${apiUrl}/health/ready`, {
      cache: "no-store",
    })

    if (!response.ok) throw new Error("API interna não está pronta.")

    return Response.json({
      status: "ready",
      service: "papirar-web-api",
      dependencies: { api: "ready" },
    })
  } catch (error) {
    console.error("[GET /api/health/ready]", error)

    return Response.json(
      {
        status: "not_ready",
        service: "papirar-web-api",
        dependencies: { api: "unavailable" },
      },
      { status: 503 }
    )
  }
}
