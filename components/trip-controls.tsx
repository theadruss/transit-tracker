"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Pause, Square, Users, MapPin, Clock, AlertTriangle } from "lucide-react"

interface TripControlsProps {
  currentTrip?: {
    id: string
    route_name: string
    route_number: string
    status: "scheduled" | "in_progress" | "completed" | "cancelled"
    start_time: string
    passenger_count: number
    next_stop: string
    eta_minutes: number
  }
}

export function TripControls({ currentTrip }: TripControlsProps) {
  const [passengerCount, setPassengerCount] = useState(currentTrip?.passenger_count || 0)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStartTrip = async () => {
    setIsUpdating(true)
    // In a real app, this would call the API to start the trip
    console.log("[v0] Starting trip...")
    setTimeout(() => setIsUpdating(false), 1000)
  }

  const handlePauseTrip = async () => {
    setIsUpdating(true)
    // In a real app, this would call the API to pause the trip
    console.log("[v0] Pausing trip...")
    setTimeout(() => setIsUpdating(false), 1000)
  }

  const handleEndTrip = async () => {
    setIsUpdating(true)
    // In a real app, this would call the API to end the trip
    console.log("[v0] Ending trip...")
    setTimeout(() => setIsUpdating(false), 1000)
  }

  const handleUpdatePassengerCount = async () => {
    setIsUpdating(true)
    // In a real app, this would call the API to update passenger count
    console.log("[v0] Updating passenger count to:", passengerCount)
    setTimeout(() => setIsUpdating(false), 1000)
  }

  if (!currentTrip) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            No Active Trip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">You don't have any active trips at the moment.</p>
          <Button className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Start New Trip
          </Button>
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
            Current Trip
          </span>
          <Badge variant={currentTrip.status === "in_progress" ? "default" : "secondary"}>
            {currentTrip.status.replace("_", " ").toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Route</p>
            <p className="font-medium">
              {currentTrip.route_number} - {currentTrip.route_name}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Started</p>
            <p className="font-medium">{new Date(currentTrip.start_time).toLocaleTimeString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Next Stop</p>
            <p className="font-medium">{currentTrip.next_stop}</p>
          </div>
          <div>
            <p className="text-muted-foreground">ETA</p>
            <p className="font-medium flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {currentTrip.eta_minutes} min
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="passengerCount" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Passenger Count
          </Label>
          <div className="flex gap-2">
            <Input
              id="passengerCount"
              type="number"
              min="0"
              max="60"
              value={passengerCount}
              onChange={(e) => setPassengerCount(Number.parseInt(e.target.value) || 0)}
              className="flex-1"
            />
            <Button onClick={handleUpdatePassengerCount} disabled={isUpdating} size="sm">
              Update
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          {currentTrip.status === "scheduled" && (
            <Button onClick={handleStartTrip} disabled={isUpdating} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Trip
            </Button>
          )}

          {currentTrip.status === "in_progress" && (
            <>
              <Button
                onClick={handlePauseTrip}
                disabled={isUpdating}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button onClick={handleEndTrip} disabled={isUpdating} variant="destructive" className="flex-1">
                <Square className="h-4 w-4 mr-2" />
                End Trip
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
