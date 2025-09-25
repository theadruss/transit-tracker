"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { BusLocation, Bus, Route } from "@/lib/types"

interface BusWithLocation extends BusLocation {
  buses: Bus & {
    routes: Route
  }
}

export function useRealTimeBuses() {
  const [buses, setBuses] = useState<BusWithLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Initial fetch
    const fetchBuses = async () => {
      try {
        const response = await fetch("/api/bus-locations")
        const data = await response.json()

        if (response.ok) {
          setBuses(data.locations || [])
        } else {
          setError(data.error || "Failed to fetch bus locations")
        }
      } catch (err) {
        setError("Network error")
        console.error("Error fetching buses:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBuses()

    // Set up real-time subscription
    const channel = supabase
      .channel("bus_locations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bus_locations",
        },
        (payload) => {
          console.log("[v0] Real-time bus location update:", payload)

          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            // In a real app, we would fetch the complete bus data with joins
            // For now, we'll just refetch all data
            fetchBuses()
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { buses, loading, error, refetch: () => window.location.reload() }
}
