import { NextResponse } from "next/server"

export const revalidate = 86400 // Revalidate every 24 hours

export async function GET() {
  try {
    const response = await fetch("https://api-web.nhle.com/v1/player/8471214/landing", {
      next: { revalidate: 86400 }, // 24 hours in seconds
    })

    if (!response.ok) {
      throw new Error(`NHL API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching Ovechkin stats:", error)
    return NextResponse.json({ error: "Failed to fetch Ovechkin stats" }, { status: 500 })
  }
}
