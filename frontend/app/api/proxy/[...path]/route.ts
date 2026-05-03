import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:8000") + "/api/v1"

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { getToken } = await auth()
  const token = await getToken()

  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 })
  }

  const path = params.path.join("/")
  const url = `${BACKEND_URL}/${path}`

  try {
    const contentType = req.headers.get("content-type") || ""
    let body: any

    if (contentType.includes("multipart/form-data")) {
      body = await req.formData()
    } else {
      body = JSON.stringify(await req.json())
    }

    const res = await fetch(url, {
      method: "POST",
      body: body,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(contentType.includes("application/json") && { "Content-Type": "application/json" }),
      },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ detail: "Proxy error" }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { getToken } = await auth()
  const token = await getToken()

  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 })
  }

  const path = params.path.join("/")
  const url = `${BACKEND_URL}/${path}`

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ detail: "Proxy error" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { getToken } = await auth()
  const token = await getToken()

  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 })
  }

  const path = params.path.join("/")
  const url = `${BACKEND_URL}/${path}`

  try {
    const body = await req.json()
    const res = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ detail: "Proxy error" }, { status: 500 })
  }
}
