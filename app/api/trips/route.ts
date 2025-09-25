import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  try {
    const { data: trips, error } = await supabase
      .from("trips")
      .select(
        `
        *,
        buses (
          id,
          bus_number,
          capacity
        ),
        routes (
          id,
          route_number,
          route_name,
          start_location,
          end_location
        ),
        users (
          id,
          full_name
        )
      `,
      )
      .in("status", ["scheduled", "in_progress"])
      .order("start_time", { ascending: true })

    if (error) throw error

    return NextResponse.json({ trips })
  } catch (error) {
    console.error("Error fetching trips:", error)
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, trip_id, bus_id, route_id, passenger_count } = body

    if (action === "start") {
      const { data: trip, error } = await supabase
        .from("trips")
        .insert({
          bus_id,
          route_id,
          driver_id: user.id,
          status: "in_progress",
          passenger_count: passenger_count || 0,
          start_time: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ trip })
    }

    if (action === "update") {
      const { data: trip, error } = await supabase
        .from("trips")
        .update({
          passenger_count,
        })
        .eq("id", trip_id)
        .eq("driver_id", user.id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ trip })
    }

    if (action === "end") {
      const { data: trip, error } = await supabase
        .from("trips")
        .update({
          status: "completed",
          end_time: new Date().toISOString(),
        })
        .eq("id", trip_id)
        .eq("driver_id", user.id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ trip })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error managing trip:", error)
    return NextResponse.json({ error: "Failed to manage trip" }, { status: 500 })
  }
}
