import type { Route, BusLocation } from "@/lib/types"

export function calculateFare(route: Route, distance?: number): number {
  const distanceToUse = distance || route.distance_km
  return Math.round(distanceToUse * route.fare_per_km * 100) / 100
}

export function calculateETA(
  currentLocation: BusLocation,
  targetStopLatitude: number,
  targetStopLongitude: number,
  averageSpeed = 30, // km/h
): number {
  const distance = calculateDistance(
    currentLocation.latitude,
    currentLocation.longitude,
    targetStopLatitude,
    targetStopLongitude,
  )

  const timeInHours = distance / averageSpeed
  return Math.round(timeInHours * 60) // Convert to minutes
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function getCrowdLevel(
  passengerCount: number,
  capacity: number,
): {
  level: "low" | "medium" | "high" | "full"
  percentage: number
  color: string
} {
  const percentage = Math.round((passengerCount / capacity) * 100)

  if (percentage >= 95) {
    return { level: "full", percentage, color: "text-red-500" }
  } else if (percentage >= 70) {
    return { level: "high", percentage, color: "text-orange-500" }
  } else if (percentage >= 40) {
    return { level: "medium", percentage, color: "text-yellow-500" }
  } else {
    return { level: "low", percentage, color: "text-green-500" }
  }
}

export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
