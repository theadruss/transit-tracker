"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Clock, Search, Zap, Users, MapPinIcon, Locate } from "lucide-react"
import { useLocationSearch } from "@/hooks/use-location-search"
import { useRealTimeBuses } from "@/hooks/use-real-time-buses"
import { getCrowdLevel } from "@/lib/utils/transport"

const kochiBusStops = [
  {
    id: "1",
    name: "Ernakulam South",
    location: "Near KSRTC Bus Stand",
    coordinates: { lat: 9.9816, lng: 76.2999 },
    buses: [
      {
        route: "K001",
        destination: "Kakkanad",
        eta: 3,
        crowdLevel: "medium",
        busNumber: "KL-07-AB-1234",
        speed: 25,
        capacity: 50,
        passengers: 32,
      },
      {
        route: "K005",
        destination: "MG Road Metro",
        eta: 7,
        crowdLevel: "low",
        busNumber: "KL-07-AC-5678",
        speed: 18,
        capacity: 45,
        passengers: 15,
      },
      {
        route: "K002",
        destination: "Fort Kochi",
        eta: 12,
        crowdLevel: "high",
        busNumber: "KL-07-AD-9012",
        speed: 35,
        capacity: 40,
        passengers: 35,
      },
    ],
  },
  {
    id: "2",
    name: "Palarivattom",
    location: "Near Palarivattom Bridge",
    coordinates: { lat: 10.0067, lng: 76.3108 },
    buses: [
      {
        route: "K001",
        destination: "Kakkanad",
        eta: 5,
        crowdLevel: "low",
        busNumber: "KL-07-AB-3456",
        speed: 22,
        capacity: 50,
        passengers: 12,
      },
      {
        route: "K004",
        destination: "Infopark",
        eta: 8,
        crowdLevel: "medium",
        busNumber: "KL-07-AE-7890",
        speed: 28,
        capacity: 45,
        passengers: 28,
      },
    ],
  },
  {
    id: "3",
    name: "Kakkanad",
    location: "Kakkanad Junction",
    coordinates: { lat: 10.0067, lng: 76.3467 },
    buses: [
      {
        route: "K001",
        destination: "Ernakulam",
        eta: 2,
        crowdLevel: "high",
        busNumber: "KL-07-AB-2345",
        speed: 15,
        capacity: 50,
        passengers: 42,
      },
      {
        route: "K004",
        destination: "Vytilla",
        eta: 15,
        crowdLevel: "low",
        busNumber: "KL-07-AE-6789",
        speed: 30,
        capacity: 45,
        passengers: 8,
      },
    ],
  },
  {
    id: "4",
    name: "Marine Drive",
    location: "Marine Drive Walkway",
    coordinates: { lat: 9.9647, lng: 76.2906 },
    buses: [
      {
        route: "K002",
        destination: "Fort Kochi",
        eta: 6,
        crowdLevel: "medium",
        busNumber: "KL-07-AD-4567",
        speed: 20,
        capacity: 40,
        passengers: 25,
      },
    ],
  },
  {
    id: "5",
    name: "Kochi Airport",
    location: "Departure Terminal",
    coordinates: { lat: 10.152, lng: 76.4019 },
    buses: [
      {
        route: "K003",
        destination: "Aluva",
        eta: 4,
        crowdLevel: "low",
        busNumber: "KL-07-AF-8901",
        speed: 32,
        capacity: 45,
        passengers: 10,
      },
    ],
  },
]

const getCrowdColor = (level: string) => {
  switch (level) {
    case "low":
      return "bg-green-500"
    case "medium":
      return "bg-yellow-500"
    case "high":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

const getCrowdText = (level: string) => {
  switch (level) {
    case "low":
      return "Low"
    case "medium":
      return "Medium"
    case "high":
      return "High"
    default:
      return "Unknown"
  }
}

export function ETAView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStop, setSelectedStop] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const { userLocation, nearestStops, geoError } = useLocationSearch()
  const { buses: liveBuses } = useRealTimeBuses()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const filteredStops = kochiBusStops.filter(
    (stop) =>
      stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.buses.some((bus) => bus.destination.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const sortedStops = userLocation
    ? [...filteredStops].sort((a, b) => {
        const distA = Math.sqrt(
          Math.pow(a.coordinates.lat - userLocation.lat, 2) + Math.pow(a.coordinates.lng - userLocation.lng, 2),
        )
        const distB = Math.sqrt(
          Math.pow(b.coordinates.lat - userLocation.lat, 2) + Math.pow(b.coordinates.lng - userLocation.lng, 2),
        )
        return distA - distB
      })
    : filteredStops

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stops, routes, or destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Locate className="h-4 w-4" />
          {userLocation ? "Location Detected" : "Detect Location"}
        </Button>
      </div>

      {userLocation && (
        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <MapPinIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Your location detected</span>
              <span className="text-xs text-green-600 dark:text-green-400">
                ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {geoError && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
              <MapPinIcon className="h-4 w-4" />
              <span className="text-sm">Location access denied. Showing all stops.</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedStops.map((stop) => (
          <Card key={stop.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {stop.name}
                  {userLocation && nearestStops[0]?.id === stop.id && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      Nearest
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {stop.buses.length} buses
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{stop.location}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stop.buses.map((bus, index) => {
                  const crowdInfo = getCrowdLevel(bus.passengers, bus.capacity)

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{bus.route}</Badge>
                        <div>
                          <p className="font-medium text-sm">{bus.destination}</p>
                          <p className="text-xs text-muted-foreground">{bus.busNumber}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground">Speed: {bus.speed} km/h</span>
                            <span className="text-xs text-muted-foreground">
                              Capacity: {bus.passengers}/{bus.capacity}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <Badge variant="secondary" className={`crowd-indicator crowd-${crowdInfo.level} text-xs`}>
                            {crowdInfo.percentage}%
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-bold text-primary">{bus.eta} min</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(currentTime.getTime() + bus.eta * 60000).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Smart ETA Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Our AI-powered system considers traffic conditions, weather, and historical data to provide accurate arrival
            times with real-time GPS tracking.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">94%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">±2min</div>
              <div className="text-xs text-muted-foreground">Avg Error</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">Real-time</div>
              <div className="text-xs text-muted-foreground">GPS Updates</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-xs text-muted-foreground">Monitoring</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
