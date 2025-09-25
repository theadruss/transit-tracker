"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Zap, AlertCircle } from "lucide-react"
import { useGeolocation } from "@/hooks/use-geolocation"

interface LocationTrackerProps {
  busId?: string
  onLocationUpdate?: (location: { latitude: number; longitude: number; speed?: number }) => void
}

export function LocationTracker({ busId, onLocationUpdate }: LocationTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const { latitude, longitude, accuracy, error, loading } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 10000,
  })

  useEffect(() => {
    if (isTracking && latitude && longitude && busId) {
      // Update location every 10 seconds when tracking
      const interval = setInterval(async () => {
        try {
          const response = await fetch("/api/bus-locations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bus_id: busId,
              latitude,
              longitude,
              speed_kmh: 0, // In a real app, this would be calculated from GPS
              heading: 0, // In a real app, this would be calculated from GPS
              passenger_count: 0, // This would come from the trip controls
            }),
          })

          if (response.ok) {
            setLastUpdate(new Date())
            onLocationUpdate?.({ latitude, longitude })
            console.log("[v0] Location updated successfully")
          } else {
            console.error("[v0] Failed to update location")
          }
        } catch (err) {
          console.error("[v0] Error updating location:", err)
        }
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [isTracking, latitude, longitude, busId, onLocationUpdate])

  const handleToggleTracking = () => {
    setIsTracking(!isTracking)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Getting your location...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Location Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          <p className="text-muted-foreground text-xs mt-2">Please enable location services and refresh the page.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Tracking
          </span>
          <Badge variant={isTracking ? "default" : "secondary"} className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {isTracking ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Latitude</p>
            <p className="font-mono">{latitude?.toFixed(6) || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Longitude</p>
            <p className="font-mono">{longitude?.toFixed(6) || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Accuracy</p>
            <p className="font-mono">{accuracy ? `${Math.round(accuracy)}m` : "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Update</p>
            <p className="font-mono text-xs">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : isTracking ? "Pending..." : "Not tracking"}
            </p>
          </div>
        </div>

        <Button onClick={handleToggleTracking} className="w-full" variant={isTracking ? "destructive" : "default"}>
          {isTracking ? "Stop Tracking" : "Start Tracking"}
        </Button>

        {isTracking && (
          <p className="text-xs text-muted-foreground text-center">
            Location is being updated every 10 seconds while tracking is active.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
