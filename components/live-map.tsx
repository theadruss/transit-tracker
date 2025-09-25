"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Users, Clock, Zap, AlertCircle, RefreshCw, Locate } from "lucide-react"
import { getCrowdLevel, formatTime } from "@/lib/utils/transport"
import { useRealTimeBuses } from "@/hooks/use-real-time-buses"
import { useLocationSearch } from "@/hooks/use-location-search"

export function LiveMap() {
  const [selectedBus, setSelectedBus] = useState<string | null>(null)
  const { buses, loading, error, refetch } = useRealTimeBuses()
  const { userLocation, nearestStops } = useLocationSearch()

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading real-time bus data...</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <RefreshCw className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading buses...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 dark:text-red-400 mb-2">Failed to load bus data</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={refetch} variant="outline" className="bg-transparent">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Area */}
      <div className="lg:col-span-2">
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Live Bus Tracking
                {userLocation && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    <Locate className="h-3 w-3 mr-1" />
                    Location Detected
                  </Badge>
                )}
              </span>
              <Button onClick={refetch} variant="outline" size="sm" className="bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
              {/* Enhanced map background with more realistic appearance */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 dark:from-blue-950 dark:via-green-950 dark:to-blue-900">
                {/* Mock road network */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="roads" patternUnits="userSpaceOnUse" width="20" height="20">
                      <rect width="20" height="20" fill="transparent" />
                      <path d="M0,10 L20,10" stroke="#e5e7eb" strokeWidth="0.5" />
                      <path d="M10,0 L10,20" stroke="#e5e7eb" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#roads)" />

                  {/* Main roads */}
                  <path d="M0,30 L100,30" stroke="#d1d5db" strokeWidth="1" />
                  <path d="M0,70 L100,70" stroke="#d1d5db" strokeWidth="1" />
                  <path d="M25,0 L25,100" stroke="#d1d5db" strokeWidth="1" />
                  <path d="M75,0 L75,100" stroke="#d1d5db" strokeWidth="1" />
                </svg>

                {/* User location marker */}
                {userLocation && (
                  <div
                    className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                    style={{ left: "50%", top: "40%" }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      You
                    </div>
                  </div>
                )}

                {/* Bus stop markers */}
                {nearestStops.slice(0, 5).map((stop, index) => (
                  <div
                    key={stop.id}
                    className="absolute w-3 h-3 bg-gray-400 rounded-full border border-white shadow transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${15 + index * 20}%`,
                      top: `${25 + index * 10}%`,
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-xs px-1 py-0.5 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                      {stop.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bus markers overlay with enhanced positioning */}
              {buses.map((bus, index) => {
                const crowdInfo = getCrowdLevel(bus.passenger_count, bus.buses?.capacity || 50)
                return (
                  <div
                    key={bus.id}
                    className={`absolute w-8 h-8 bg-primary rounded-lg border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
                      !bus.is_online ? "opacity-50" : ""
                    } ${selectedBus === bus.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
                    style={{
                      left: `${20 + index * 15}%`,
                      top: `${35 + index * 12}%`,
                    }}
                    onClick={() => setSelectedBus(bus.id)}
                  >
                    {/* Bus icon */}
                    <div className="w-full h-full flex items-center justify-center">
                      <Navigation className="h-4 w-4 text-white" style={{ transform: `rotate(${index * 45}deg)` }} />
                    </div>

                    {/* Bus info tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg z-10">
                      <div className="font-medium">{bus.buses?.routes?.route_number || "N/A"}</div>
                      <div className="text-muted-foreground">{bus.speed_kmh || 0} km/h</div>
                      <div className={`crowd-indicator crowd-${crowdInfo.level} text-xs mt-1`}>
                        <Users className="h-3 w-3 inline mr-1" />
                        {crowdInfo.percentage}%
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Map legend */}
              <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border rounded-lg p-3 text-xs">
                <div className="font-medium mb-2">Legend</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-lg"></div>
                    <span>Active Bus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Your Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span>Bus Stop</span>
                  </div>
                </div>
              </div>

              {/* Live update indicator */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm border rounded-lg px-3 py-2 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bus List */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Active Buses ({buses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {buses.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No active buses found</p>
                <p className="text-xs text-muted-foreground mt-1">Buses will appear here when drivers start tracking</p>
              </div>
            ) : (
              buses.map((bus) => {
                const crowdInfo = getCrowdLevel(bus.passenger_count, bus.buses?.capacity || 50)

                return (
                  <div
                    key={bus.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedBus === bus.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedBus(bus.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-sm">{bus.buses?.bus_number || "Unknown Bus"}</h3>
                        <p className="text-xs text-muted-foreground">
                          {bus.buses?.routes?.route_name || "No route assigned"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {bus.is_online ? (
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-600 dark:text-green-400">Live</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 text-red-500" />
                            <span className="text-xs text-red-600 dark:text-red-400">Offline</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-mono text-xs">
                          {bus.latitude.toFixed(4)}, {bus.longitude.toFixed(4)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Crowd Level:</span>
                        <Badge variant="secondary" className={`crowd-indicator crowd-${crowdInfo.level}`}>
                          <Users className="h-3 w-3 mr-1" />
                          {crowdInfo.percentage}%
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Speed:</span>
                        <span className="font-medium">{bus.speed_kmh || 0} km/h</span>
                      </div>

                      <div className="text-xs text-muted-foreground">Last updated: {formatTime(bus.timestamp)}</div>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <MapPin className="h-4 w-4 mr-2" />
              Find Nearest Stop
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <Clock className="h-4 w-4 mr-2" />
              Set Arrival Alert
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
              <Navigation className="h-4 w-4 mr-2" />
              Plan Journey
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
