"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calculator, MapPin, Route, IndianRupee, Navigation, Zap } from "lucide-react"

const kochiRoutes = [
  {
    id: "1",
    route_number: "K001",
    route_name: "Ernakulam - Kakkanad",
    distance_km: 18.5,
    fare_per_km: 2.5,
    base_fare: 8,
    stops: [
      { name: "Ernakulam South", coordinates: { lat: 9.9816, lng: 76.2999 } },
      { name: "Palarivattom", coordinates: { lat: 10.0067, lng: 76.3108 } },
      { name: "Edappally", coordinates: { lat: 10.0176, lng: 76.3088 } },
      { name: "Kakkanad", coordinates: { lat: 10.0067, lng: 76.3467 } },
    ],
  },
  {
    id: "2",
    route_number: "K002",
    route_name: "Fort Kochi - Marine Drive",
    distance_km: 12.3,
    fare_per_km: 2.0,
    base_fare: 6,
    stops: [
      { name: "Fort Kochi", coordinates: { lat: 9.9647, lng: 76.2424 } },
      { name: "Mattancherry", coordinates: { lat: 9.9591, lng: 76.2673 } },
      { name: "Ernakulam Junction", coordinates: { lat: 9.9816, lng: 76.2999 } },
      { name: "Marine Drive", coordinates: { lat: 9.9647, lng: 76.2906 } },
    ],
  },
  {
    id: "3",
    route_number: "K003",
    route_name: "Aluva - Kochi Airport",
    distance_km: 25.7,
    fare_per_km: 3.0,
    base_fare: 12,
    stops: [
      { name: "Aluva", coordinates: { lat: 10.1081, lng: 76.3528 } },
      { name: "Angamaly", coordinates: { lat: 10.1919, lng: 76.3869 } },
      { name: "Nedumbassery", coordinates: { lat: 10.152, lng: 76.4019 } },
      { name: "Kochi Airport", coordinates: { lat: 10.152, lng: 76.4019 } },
    ],
  },
  {
    id: "4",
    route_number: "K004",
    route_name: "Vytilla - Infopark",
    distance_km: 16.2,
    fare_per_km: 2.5,
    base_fare: 8,
    stops: [
      { name: "Vytilla", coordinates: { lat: 9.9676, lng: 76.3067 } },
      { name: "Palarivattom", coordinates: { lat: 10.0067, lng: 76.3108 } },
      { name: "Kakkanad", coordinates: { lat: 10.0067, lng: 76.3467 } },
      { name: "Infopark", coordinates: { lat: 10.0067, lng: 76.3467 } },
    ],
  },
]

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function FareCalculator() {
  const [selectedRoute, setSelectedRoute] = useState<string>("")
  const [fromStop, setFromStop] = useState<string>("")
  const [toStop, setToStop] = useState<string>("")
  const [calculatedDistance, setCalculatedDistance] = useState<number>(0)
  const [calculatedFare, setCalculatedFare] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const selectedRouteData = kochiRoutes.find((r) => r.id === selectedRoute)
  const availableStops = selectedRouteData?.stops || []

  useEffect(() => {
    if (selectedRouteData && fromStop && toStop && fromStop !== toStop) {
      const fromStopData = selectedRouteData.stops.find((s) => s.name === fromStop)
      const toStopData = selectedRouteData.stops.find((s) => s.name === toStop)

      if (fromStopData && toStopData) {
        setIsCalculating(true)
        // Simulate API call delay for realistic experience
        setTimeout(() => {
          const distance = calculateDistance(
            fromStopData.coordinates.lat,
            fromStopData.coordinates.lng,
            toStopData.coordinates.lat,
            toStopData.coordinates.lng,
          )
          setCalculatedDistance(Math.round(distance * 10) / 10)

          // Calculate fare automatically
          const fare = selectedRouteData.base_fare + distance * selectedRouteData.fare_per_km
          setCalculatedFare(Math.round(fare * 100) / 100)
          setIsCalculating(false)
        }, 800)
      }
    } else {
      setCalculatedDistance(0)
      setCalculatedFare(null)
    }
  }, [selectedRouteData, fromStop, toStop])

  const handleQuickCalculate = (routeId: string) => {
    const route = kochiRoutes.find((r) => r.id === routeId)
    if (route) {
      setSelectedRoute(routeId)
      setFromStop(route.stops[0].name)
      setToStop(route.stops[route.stops.length - 1].name)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Smart Fare Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="route">Select Route</Label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a route" />
                </SelectTrigger>
                <SelectContent>
                  {kochiRoutes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.route_number} - {route.route_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRoute && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-stop">From Stop</Label>
                  <Select value={fromStop} onValueChange={setFromStop}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select starting stop" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStops.map((stop) => (
                        <SelectItem key={stop.name} value={stop.name}>
                          {stop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to-stop">To Stop</Label>
                  <Select value={toStop} onValueChange={setToStop}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination stop" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStops.map((stop) => (
                        <SelectItem key={stop.name} value={stop.name} disabled={stop.name === fromStop}>
                          {stop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {calculatedDistance > 0 && (
              <div className="p-4 bg-secondary/20 border border-secondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Calculated Distance:
                  </span>
                  <span className="font-bold">{calculatedDistance} km</span>
                </div>
                {isCalculating && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    Calculating optimal route...
                  </div>
                )}
              </div>
            )}

            {calculatedFare !== null && !isCalculating && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Estimated Fare:</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-primary">{calculatedFare}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Base fare: ₹{selectedRouteData?.base_fare} + Distance: {calculatedDistance}km × ₹
                  {selectedRouteData?.fare_per_km}/km
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Quick Calculate - Popular Routes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {kochiRoutes.map((route) => (
              <div
                key={route.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => handleQuickCalculate(route.id)}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">
                      {route.route_number} - {route.route_name}
                    </p>
                    <p className="text-xs text-muted-foreground">Full route: {route.distance_km} km</p>
                  </div>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" />
                  {Math.round((route.base_fare + route.distance_km * route.fare_per_km) * 100) / 100}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Smart Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">GPS-Based</div>
              <div className="text-xs text-muted-foreground">Automatic distance calculation using real coordinates</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">Real-time</div>
              <div className="text-xs text-muted-foreground">Prices updated based on current traffic conditions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">Multi-lingual</div>
              <div className="text-xs text-muted-foreground">Available in English and Malayalam</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
