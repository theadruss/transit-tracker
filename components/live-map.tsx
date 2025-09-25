"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Users, Clock, Zap, AlertTriangle } from "lucide-react"

interface Bus {
  id: string
  route_number: string
  current_lat: number
  current_lng: number
  occupancy_level: "low" | "medium" | "high"
  next_stop: string
  eta_minutes: number
  speed: number
  delay_minutes: number
}

interface Stop {
  id: string
  name: string
  lat: number
  lng: number
  crowd_level: "low" | "medium" | "high"
}

export  function LiveMap() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [stops, setStops] = useState<Stop[]>([])
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => console.error("Error getting location:", error),
      )
    }

    // Simulate real-time bus updates
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => ({
          ...bus,
          current_lat: bus.current_lat + (Math.random() - 0.5) * 0.001,
          current_lng: bus.current_lng + (Math.random() - 0.5) * 0.001,
          eta_minutes: Math.max(0, bus.eta_minutes - 0.5),
          speed: Math.random() * 60 + 20,
        })),
      )
    }, 5000)

    // Load initial data
    loadBusData()
    loadStopData()

    return () => clearInterval(interval)
  }, [])

  const loadBusData = () => {
    // Simulate bus data
    setBuses([
      {
        id: "1",
        route_number: "42A",
        current_lat: 12.9716,
        current_lng: 77.5946,
        occupancy_level: "medium",
        next_stop: "MG Road",
        eta_minutes: 3,
        speed: 35,
        delay_minutes: 2,
      },
      {
        id: "2",
        route_number: "201E",
        current_lat: 12.9756,
        current_lng: 77.6006,
        occupancy_level: "high",
        next_stop: "Brigade Road",
        eta_minutes: 7,
        speed: 28,
        delay_minutes: 0,
      },
    ])
  }

  const loadStopData = () => {
    setStops([
      {
        id: "1",
        name: "MG Road",
        lat: 12.9716,
        lng: 77.5946,
        crowd_level: "medium",
      },
      {
        id: "2",
        name: "Brigade Road",
        lat: 12.9756,
        lng: 77.6006,
        crowd_level: "high",
      },
    ])
  }

  const getOccupancyColor = (level: string) => {
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

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "high":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <Card className="bg-gray-900 border-gray-800 p-4">
        <div ref={mapRef} className="h-96 bg-gray-800 rounded-lg relative overflow-hidden">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-8 h-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-gray-700" />
                ))}
              </div>
            </div>
          </div>

          {/* User Location */}
          {userLocation && (
            <div
              className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"
              style={{
                left: "45%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" />
            </div>
          )}

          {/* Bus Markers */}
          {buses.map((bus, index) => (
            <div
              key={bus.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${30 + index * 20}%`,
                top: `${40 + index * 15}%`,
              }}
              onClick={() => setSelectedBus(bus)}
            >
              <div
                className={`w-6 h-6 rounded-full ${getOccupancyColor(bus.occupancy_level)} border-2 border-white shadow-lg flex items-center justify-center`}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {bus.route_number}
              </div>
            </div>
          ))}

          {/* Stop Markers */}
          {stops.map((stop, index) => (
            <div
              key={stop.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${35 + index * 25}%`,
                top: `${60 + index * 10}%`,
              }}
            >
              <MapPin className="w-5 h-5 text-orange-500" />
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-300 whitespace-nowrap">
                {stop.name}
              </div>
            </div>
          ))}
        </div>

        {/* Map Controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <Button
              variant={isTracking ? "default" : "outline"}
              size="sm"
              onClick={() => setIsTracking(!isTracking)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {isTracking ? "Stop Tracking" : "Track Location"}
            </Button>
          </div>

          <div className="flex gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-gray-400">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-gray-400">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-gray-400">High</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Selected Bus Info */}
      {selectedBus && (
        <Card className="bg-gray-900 border-gray-800 p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-white">Bus {selectedBus.route_number}</h3>
              <p className="text-gray-400">Next: {selectedBus.next_stop}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedBus(null)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-300">ETA: {selectedBus.eta_minutes} min</span>
                {selectedBus.delay_minutes > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    +{selectedBus.delay_minutes}m delay
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-300">Speed: {selectedBus.speed.toFixed(0)} km/h</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className={`w-4 h-4 ${getCrowdColor(selectedBus.occupancy_level)}`} />
                <span className="text-sm text-gray-300 capitalize">{selectedBus.occupancy_level} occupancy</span>
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-300">Live tracking</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Live Bus List */}
      <Card className="bg-gray-900 border-gray-800 p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Nearby Buses</h3>
        <div className="space-y-3">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors"
              onClick={() => setSelectedBus(bus)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getOccupancyColor(bus.occupancy_level)}`} />
                <div>
                  <div className="font-medium text-white">Route {bus.route_number}</div>
                  <div className="text-sm text-gray-400">To {bus.next_stop}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-orange-500">{bus.eta_minutes} min</div>
                <div className="text-xs text-gray-400">{bus.speed.toFixed(0)} km/h</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
