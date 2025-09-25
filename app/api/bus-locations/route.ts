import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  try {
    const { data: locations, error } = await supabase
      .from("bus_locations")
      .select(
        `
        *,
        buses (
          id,
          bus_number,
          capacity,
          routes (
            id,
            route_number,
            route_name
          )
        )
      `,
      )
      .eq("is_online", true)
      .order("timestamp", { ascending: false })

    if (error) throw error

    // Add mock data if no real data exists
    if (!locations || locations.length === 0) {
      const mockBuses = [
        {
          id: "mock-1",
          bus_id: "bus-1",
          latitude: 9.9816,
          longitude: 76.2999,
          speed_kmh: 25,
          heading: 45,
          passenger_count: 32,
          is_online: true,
          timestamp: new Date().toISOString(),
          buses: {
            id: "bus-1",
            bus_number: "KL-07-AB-1234",
            capacity: 50,
            routes: {
              id: "route-1",
              route_number: "K001",
              route_name: "Ernakulam - Kakkanad"
            }
          }
        },
        {
          id: "mock-2", 
          bus_id: "bus-2",
          latitude: 10.0067,
          longitude: 76.3108,
          speed_kmh: 18,
          heading: 120,
          passenger_count: 15,
          is_online: true,
          timestamp: new Date().toISOString(),
          buses: {
            id: "bus-2",
            bus_number: "KL-07-AC-5678",
            capacity: 45,
            routes: {
              id: "route-2",
              route_number: "K002",
              route_name: "Fort Kochi - Marine Drive"
            }
          }
        },
        {
          id: "mock-3",
          bus_id: "bus-3", 
          latitude: 10.0067,
          longitude: 76.3467,
          speed_kmh: 35,
          heading: 270,
          passenger_count: 8,
          is_online: true,
          timestamp: new Date().toISOString(),
          buses: {
            id: "bus-3",
            bus_number: "KL-07-AD-9012",
            capacity: 40,
            routes: {
              id: "route-3",
              route_number: "K003",
              route_name: "Aluva - Airport"
            }
          }
        },
        {
          id: "mock-4",
          bus_id: "bus-4",
          latitude: 9.9647,
          longitude: 76.2906,
          speed_kmh: 22,
          heading: 180,
          passenger_count: 28,
          is_online: true,
          timestamp: new Date().toISOString(),
          buses: {
            id: "bus-4",
            bus_number: "KL-07-AE-3456",
            capacity: 50,
            routes: {
              id: "route-4",
              route_number: "K004",
              route_name: "Vytilla - Infopark"
            }
          }
        }
      ]
      
      return NextResponse.json({ locations: mockBuses })
    }

    return NextResponse.json({ locations })
  } catch (error) {
    console.error("Error fetching bus locations:", error)
    return NextResponse.json({ error: "Failed to fetch bus locations" }, { status: 500 })
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
    const { bus_id, latitude, longitude, speed_kmh, heading, passenger_count } = body

    // Verify the user is authorized to update this bus location (driver check)
    const { data: bus, error: busError } = await supabase.from("buses").select("driver_id").eq("id", bus_id).single()

    if (busError || bus.driver_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized to update this bus" }, { status: 403 })
    }

    const { data: location, error } = await supabase
      .from("bus_locations")
      .insert({
        bus_id,
        latitude,
        longitude,
        speed_kmh,
        heading,
        passenger_count,
        is_online: true,
        timestamp: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ location })
  } catch (error) {
    console.error("Error updating bus location:", error)
    return NextResponse.json({ error: "Failed to update bus location" }, { status: 500 })
  }
}
