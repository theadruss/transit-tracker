"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Clock, Users, Search, Navigation2, Star, Route } from "lucide-react"
import { useLocationSearch } from "@/hooks/use-location-search"

const kochiRoutes = [
  {
    id: "1",
    route_number: "K001",
    route_name: "Ernakulam - Kakkanad",
    stops: ["Ernakulam South", "Palarivattom", "Edappally", "Kakkanad"],
    distance_km: 18.5,
    fare_per_km: 2.5,
    base_fare: 8,
    frequency: "5-8 mins",
    operating_hours: "5:30 AM - 11:00 PM",
    rating: 4.2,
    active_buses: 12,
  },
  {
    id: "2",
    route_number: "K002",
    route_name: "Fort Kochi - Marine Drive",
    stops: ["Fort Kochi", "Mattancherry", "Ernakulam Junction", "Marine Drive"],
    distance_km: 12.3,
    fare_per_km: 2.0,
    base_fare: 6,
    frequency: "10-15 mins",
    operating_hours: "6:00 AM - 10:30 PM",
    rating: 4.5,
    active_buses: 8,
  },
  {
    id: "3",
    route_number: "K003",
    route_name: "Aluva - Kochi Airport",
    stops: ["Aluva", "Angamaly", "Nedumbassery", "Kochi Airport"],
    distance_km: 25.7,
    fare_per_km: 3.0,
    base_fare: 12,
    frequency: "15-20 mins",
    operating_hours: "4:30 AM - 12:00 AM",
    rating: 4.7,
    active_buses: 15,
  },
  {
    id: "4",
    route_number: "K004",
    route_name: "Vytilla - Infopark",
    stops: ["Vytilla", "Palarivattom", "Kakkanad", "Infopark"],
    distance_km: 16.2,
    fare_per_km: 2.5,
    base_fare: 8,
    frequency: "6-10 mins",
    operating_hours: "5:45 AM - 11:30 PM",
    rating: 4.3,
    active_buses: 10,
  },
  {
    id: "5",
    route_number: "K005",
    route_name: "Kochi Metro Feeder",
    stops: ["Aluva Metro", "Kalamassery", "Edappally", "MG Road Metro"],
    distance_km: 22.1,
    fare_per_km: 2.2,
    base_fare: 7,
    frequency: "8-12 mins",
    operating_hours: "5:00 AM - 11:45 PM",
    rating: 4.4,
    active_buses: 14,
  },
]

export function RoutesView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const { searchRoutesByLocation } = useLocationSearch()

  const filteredRoutes = kochiRoutes.filter(
    (route) =>
      route.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.route_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.stops.some((stop) => stop.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const matchingRouteNumbers = searchTerm ? searchRoutesByLocation(searchTerm) : []
  const routesWithLocationMatch =
    matchingRouteNumbers.length > 0
      ? kochiRoutes.filter((route) => matchingRouteNumbers.includes(route.route_number))
      : []

  const finalRoutes = searchTerm && routesWithLocationMatch.length > 0 ? routesWithLocationMatch : filteredRoutes

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search routes, stops, or destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {searchTerm && matchingRouteNumbers.length > 0 && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Route className="h-4 w-4" />
              <span className="text-sm font-medium">
                Found {matchingRouteNumbers.length} routes serving "{searchTerm}"
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {finalRoutes.map((route) => (
          <Card key={route.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">{route.route_number}</Badge>
                    {route.route_name}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {route.distance_km} km
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Every {route.frequency}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {route.active_buses} buses
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{route.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Route Stops</h4>
                  <div className="flex flex-wrap gap-2">
                    {route.stops.map((stop, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`text-xs ${
                          searchTerm && stop.toLowerCase().includes(searchTerm.toLowerCase())
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : ""
                        }`}
                      >
                        {stop}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Operating Hours:</span>
                  <span className="font-medium">{route.operating_hours}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Base Fare:</span>
                  <span className="font-medium">
                    ₹{route.base_fare} + ₹{route.fare_per_km}/km
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => setSelectedRoute(route.id)}
                  >
                    <Navigation2 className="h-4 w-4 mr-2" />
                    Track Live
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Star className="h-4 w-4 mr-2" />
                    Favorite
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {finalRoutes.length === 0 && searchTerm && (
        <Card className="border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
          <CardContent className="p-8 text-center">
            <Route className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No routes found</h3>
            <p className="text-muted-foreground">
              No routes match your search for "{searchTerm}". Try searching for a different location or route number.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
