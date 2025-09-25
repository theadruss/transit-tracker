"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Navigation, MapPin, Users, Zap, AlertCircle, Play, Pause } from "lucide-react"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useToast } from "@/hooks/use-toast"

interface DriverSession {
  busId: string
  busNumber: string
  routeNumber: string
  routeName: string
  isTracking: boolean
  passengerCount: number
  maxCapacity: number
}

export function DriverGPSTracker() {
  const [session, setSession] = useState<DriverSession | null>(null)
  const [passengerCount, setPassengerCount] = useState([25])
  const { latitude, longitude, accuracy, error, loading } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 1000,
  })
  const { toast } = useToast()

  // Mock driver session - in real app this would come from authentication
  useEffect(() => {
    setSession({
      busId: "bus-1",
      busNumber: "KL-07-AB-1234",
      routeNumber: "K001",
      routeName: "Ernakulam - Kakkanad",
      isTracking: false,
      passengerCount: 25,
      maxCapacity: 50,
    })
  }, [])

  const startTracking = async () => {
    if (!session || !latitude || !longitude) return

    try {
      const response = await fetch("/api/bus-locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bus_id: session.busId,
          latitude,
          longitude,
          speed_kmh: 0, // Would calculate from GPS data
          heading: 0, // Would get from GPS
          passenger_count: passengerCount[0],
        }),
      })

      if (response.ok) {
        setSession((prev) => (prev ? { ...prev, isTracking: true } : null))
        toast({
          title: "GPS Tracking Started",
          description: "Your location is now being shared with passengers",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start GPS tracking",
        variant: "destructive",
      })
    }
  }

  const stopTracking = () => {
    setSession((prev) => (prev ? { ...prev, isTracking: false } : null))
    toast({
      title: "GPS Tracking Stopped",
      description: "Location sharing has been disabled",
    })
  }

  const updatePassengerCount = () => {
    if (session) {
      setSession((prev) => (prev ? { ...prev, passengerCount: passengerCount[0] } : null))
      toast({
        title: "Passenger Count Updated",
        description: `Updated to ${passengerCount[0]} passengers`,
      })
    }
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Driver session not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Driver Session Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Driver Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Bus Number</Label>
              <p className="font-medium">{session.busNumber}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Route</Label>
              <p className="font-medium">
                {session.routeNumber} - {session.routeName}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${session.isTracking ? "bg-green-500" : "bg-gray-400"}`} />
              <span className="text-sm font-medium">
                {session.isTracking ? "GPS Tracking Active" : "GPS Tracking Inactive"}
              </span>
            </div>
            {session.isTracking ? (
              <Button onClick={stopTracking} variant="outline" size="sm">
                <Pause className="h-4 w-4 mr-2" />
                Stop Tracking
              </Button>
            ) : (
              <Button onClick={startTracking} size="sm" disabled={!latitude || !longitude}>
                <Play className="h-4 w-4 mr-2" />
                Start Tracking
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* GPS Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            GPS Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="flex items-center gap-2 text-yellow-600">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-sm">Acquiring GPS signal...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {latitude && longitude && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">GPS Signal Active</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Latitude</Label>
                  <p className="font-mono">{latitude.toFixed(6)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Longitude</Label>
                  <p className="font-mono">{longitude.toFixed(6)}</p>
                </div>
              </div>
              {accuracy && (
                <div className="text-sm">
                  <Label className="text-muted-foreground">Accuracy</Label>
                  <p>±{Math.round(accuracy)}m</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Passenger Count */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Passenger Count
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Current Passengers</Label>
              <Badge variant="secondary" className="text-sm">
                {passengerCount[0]} / {session.maxCapacity}
              </Badge>
            </div>
            <Slider
              value={passengerCount}
              onValueChange={setPassengerCount}
              max={session.maxCapacity}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>{session.maxCapacity}</span>
            </div>
          </div>

          <Button onClick={updatePassengerCount} className="w-full">
            Update Passenger Count
          </Button>

          <div className="text-center">
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                passengerCount[0] / session.maxCapacity < 0.5
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : passengerCount[0] / session.maxCapacity < 0.8
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              <Users className="h-3 w-3" />
              {Math.round((passengerCount[0] / session.maxCapacity) * 100)}% Full
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
