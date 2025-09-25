"use client"

import { useState, useEffect } from "react"
import { useGeolocation } from "./use-geolocation"

interface BusStop {
  id: string
  name: string
  location: string
  coordinates: { lat: number; lng: number }
  routes: string[]
}

const kochiBusStops: BusStop[] = [
  {
    id: "1",
    name: "Ernakulam South",
    location: "Near KSRTC Bus Stand",
    coordinates: { lat: 9.9816, lng: 76.2999 },
    routes: ["K001", "K005", "K002"]
  },
  {
    id: "2", 
    name: "Palarivattom",
    location: "Near Palarivattom Bridge",
    coordinates: { lat: 10.0067, lng: 76.3108 },
    routes: ["K001", "K004"]
  },
  {
    id: "3",
    name: "Kakkanad",
    location: "Kakkanad Junction", 
    coordinates: { lat: 10.0067, lng: 76.3467 },
    routes: ["K001", "K004"]
  },
  {
    id: "4",
    name: "Marine Drive",
    location: "Marine Drive Walkway",
    coordinates: { lat: 9.9647, lng: 76.2906 },
    routes: ["K002"]
  },
  {
    id: "5",
    name: "Kochi Airport",
    location: "Departure Terminal",
    coordinates: { lat: 10.152, lng: 76.4019 },
    routes: ["K003"]
  },
  {
    id: "6",
    name: "Vytilla",
    location: "Vytilla Hub",
    coordinates: { lat: 9.9647, lng: 76.3108 },
    routes: ["K004", "K005"]
  },
  {
    id: "7",
    name: "Infopark",
    location: "Infopark Phase 1",
    coordinates: { lat: 10.0067, lng: 76.3467 },
    routes: ["K004"]
  },
  {
    id: "8",
    name: "Fort Kochi",
    location: "Fort Kochi Beach",
    coordinates: { lat: 9.9647, lng: 76.2431 },
    routes: ["K002"]
  }
]

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export function useLocationSearch() {
  const { latitude, longitude, error: geoError } = useGeolocation()
  const [nearestStops, setNearestStops] = useState<(BusStop & { distance: number })[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (latitude && longitude) {
      setUserLocation({ lat: latitude, lng: longitude })
      
      // Calculate distances and sort by nearest
      const stopsWithDistance = kochiBusStops.map(stop => ({
        ...stop,
        distance: calculateDistance(latitude, longitude, stop.coordinates.lat, stop.coordinates.lng)
      })).sort((a, b) => a.distance - b.distance)
      
      setNearestStops(stopsWithDistance)
    }
  }, [latitude, longitude])

  const searchRoutesByLocation = (searchTerm: string) => {
    const matchingStops = kochiBusStops.filter(stop => 
      stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    const routes = new Set<string>()
    matchingStops.forEach(stop => {
      stop.routes.forEach(route => routes.add(route))
    })
    
    return Array.from(routes)
  }

  return {
    userLocation,
    nearestStops,
    searchRoutesByLocation,
    geoError,
    allStops: kochiBusStops
  }
}
