"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Users, Clock, Zap, AlertCircle, RefreshCw, Locate } from "lucide-react"
import { getCrowdLevel, formatTime } from "@/lib/utils/transport"
import { useRealTimeBuses } from "@/hooks/use-real-time-buses"
import { useLocationSearch } from "@/hooks/use-location-search"

// Dynamic import for Leaflet to avoid SSR issues
import dynamic from 'next/dynamic'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
)

// Default center coordinates (adjust to your city)
const DEFAULT_CENTER: [number, number] = [9.9312, 76.2673] // New York City

// Helper function to get coordinates from any object
const getCoordinates = (obj: any): [number, number] | null => {
  if (!obj) return null
  
  // Try different possible property names
  if (obj.latitude !== undefined && obj.longitude !== undefined) {
    return [obj.latitude, obj.longitude]
  }
  if (obj.lat !== undefined && obj.lng !== undefined) {
    return [obj.lat, obj.lng]
  }
  if (obj.lat !== undefined && obj.lon !== undefined) {
    return [obj.lat, obj.lon]
  }
  if (obj.lat !== undefined && obj.long !== undefined) {
    return [obj.lat, obj.long]
  }
  
  return null
}

export function LiveMap() {
  const [selectedBus, setSelectedBus] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [mapReady, setMapReady] = useState(false)
  const { buses, loading, error, refetch } = useRealTimeBuses()
  const { userLocation, nearestStops } = useLocationSearch()

  // Update map center when user location is available
  useEffect(() => {
    const coords = getCoordinates(userLocation)
    if (coords) {
      setMapCenter(coords)
    }
  }, [userLocation])

  // Set map as ready after component mounts
  useEffect(() => {
    setMapReady(true)
  }, [])

  if (loading || !mapReady) {
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

  // Filter out items without valid coordinates
  const validBuses = buses.filter(bus => getCoordinates(bus))
  const validStops = nearestStops.filter(stop => getCoordinates(stop))

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
          <CardContent className="h-full p-0">
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* User location marker */}
                {userLocation && (() => {
                  const coords = getCoordinates(userLocation)
                  return coords ? (
                    <CircleMarker
                      center={coords}
                      radius={10}
                      fillColor="#3b82f6"
                      color="#ffffff"
                      weight={2}
                      opacity={1}
                      fillOpacity={0.7}
                    >
                      <Popup>
                        <div className="text-sm font-medium">Your Location</div>
                      </Popup>
                    </CircleMarker>
                  ) : null
                })()}

                {/* Bus stop markers */}
                {validStops.slice(0, 10).map((stop) => {
                  const coords = getCoordinates(stop)
                  return coords ? (
                    <CircleMarker
                      key={stop.id}
                      center={coords}
                      radius={6}
                      fillColor="#6b7280"
                      color="#ffffff"
                      weight={1}
                      opacity={1}
                      fillOpacity={0.8}
                    >
                      <Popup>
                        <div className="text-sm">
                          <div className="font-medium">{stop.name || "Unknown Stop"}</div>
                          <div className="text-xs text-muted-foreground">Bus Stop</div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ) : null
                })}

                {/* Bus markers */}
                {validBuses.map((bus) => {
                  const coords = getCoordinates(bus)
                  if (!coords) return null
                  
                  const crowdInfo = getCrowdLevel(bus.passenger_count, bus.buses?.capacity || 50)

                  return (
                    <Marker
                      key={bus.id}
                      position={coords}
                      eventHandlers={{
                        click: () => setSelectedBus(bus.id),
                      }}
                    >
                      <Popup>
                        <div className="text-sm min-w-[200px]">
                          <div className="font-medium flex items-center gap-2">
                            <Navigation className="h-4 w-4" />
                            {bus.buses?.bus_number || "Unknown Bus"}
                            {!bus.is_online && (
                              <Badge variant="secondary" className="text-xs">
                                Offline
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1 text-xs">
                            Route: {bus.buses?.routes?.route_number || "N/A"} - {bus.buses?.routes?.route_name || "No route"}
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-muted-foreground">Speed:</span>
                              <div className="font-medium">{bus.speed_kmh || 0} km/h</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Crowd:</span>
                              <div className="font-medium">{crowdInfo.percentage}%</div>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Updated: {formatTime(bus.timestamp)}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>

              {/* Map legend */}
              <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border rounded-lg p-3 text-xs z-[1000]">
                <div className="font-medium mb-2">Legend</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-lg"></div>
                    <span>Low Crowd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-lg"></div>
                    <span>Medium Crowd</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-lg"></div>
                    <span>High Crowd</span>
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
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm border rounded-lg px-3 py-2 text-xs z-[1000]">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>

              {/* Debug info (remove in production) */}
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm border rounded-lg p-2 text-xs z-[1000]">
                <div>Buses: {validBuses.length}/{buses.length}</div>
                <div>Stops: {validStops.length}/{nearestStops.length}</div>
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
              Active Buses ({validBuses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {validBuses.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No active buses found</p>
                <p className="text-xs text-muted-foreground mt-1">Buses will appear here when drivers start tracking</p>
              </div>
            ) : (
              validBuses.map((bus) => {
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
                          {bus.latitude?.toFixed(4) || "N/A"}, {bus.longitude?.toFixed(4) || "N/A"}
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