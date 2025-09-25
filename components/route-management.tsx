"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Route, MapPin } from "lucide-react"

const mockRoutes = [
  {
    id: "1",
    route_number: "R001",
    route_name: "City Center - Airport",
    start_location: "City Center Bus Terminal",
    end_location: "International Airport",
    distance_km: 25.5,
    estimated_duration_minutes: 45,
    fare_per_km: 3.0,
    is_active: true,
    stops_count: 8,
  },
  {
    id: "2",
    route_number: "R002",
    route_name: "University - Mall",
    start_location: "University Campus",
    end_location: "Shopping Mall",
    distance_km: 12.3,
    estimated_duration_minutes: 25,
    fare_per_km: 2.5,
    is_active: true,
    stops_count: 5,
  },
  {
    id: "3",
    route_number: "R003",
    route_name: "Hospital - Railway Station",
    start_location: "General Hospital",
    end_location: "Central Railway Station",
    distance_km: 8.7,
    estimated_duration_minutes: 20,
    fare_per_km: 2.0,
    is_active: false,
    stops_count: 4,
  },
]

export function RouteManagement() {
  const [routes, setRoutes] = useState(mockRoutes)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<(typeof mockRoutes)[0] | null>(null)

  const [formData, setFormData] = useState({
    route_number: "",
    route_name: "",
    start_location: "",
    end_location: "",
    distance_km: "",
    estimated_duration_minutes: "",
    fare_per_km: "",
  })

  const handleAddRoute = () => {
    // In a real app, this would call the API
    console.log("[v0] Adding new route:", formData)
    setIsAddDialogOpen(false)
    setFormData({
      route_number: "",
      route_name: "",
      start_location: "",
      end_location: "",
      distance_km: "",
      estimated_duration_minutes: "",
      fare_per_km: "",
    })
  }

  const handleEditRoute = (route: (typeof mockRoutes)[0]) => {
    setEditingRoute(route)
    setFormData({
      route_number: route.route_number,
      route_name: route.route_name,
      start_location: route.start_location,
      end_location: route.end_location,
      distance_km: route.distance_km.toString(),
      estimated_duration_minutes: route.estimated_duration_minutes.toString(),
      fare_per_km: route.fare_per_km.toString(),
    })
  }

  const handleUpdateRoute = () => {
    // In a real app, this would call the API
    console.log("[v0] Updating route:", editingRoute?.id, formData)
    setEditingRoute(null)
    setFormData({
      route_number: "",
      route_name: "",
      start_location: "",
      end_location: "",
      distance_km: "",
      estimated_duration_minutes: "",
      fare_per_km: "",
    })
  }

  const handleDeleteRoute = (routeId: string) => {
    // In a real app, this would call the API
    console.log("[v0] Deleting route:", routeId)
    setRoutes(routes.filter((route) => route.id !== routeId))
  }

  const toggleRouteStatus = (routeId: string) => {
    // In a real app, this would call the API
    console.log("[v0] Toggling route status:", routeId)
    setRoutes(routes.map((route) => (route.id === routeId ? { ...route, is_active: !route.is_active } : route)))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Route Management
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Route</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="route_number">Route Number</Label>
                  <Input
                    id="route_number"
                    value={formData.route_number}
                    onChange={(e) => setFormData({ ...formData, route_number: e.target.value })}
                    placeholder="R004"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="route_name">Route Name</Label>
                  <Input
                    id="route_name"
                    value={formData.route_name}
                    onChange={(e) => setFormData({ ...formData, route_name: e.target.value })}
                    placeholder="Beach Road - Tech Park"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_location">Start Location</Label>
                  <Input
                    id="start_location"
                    value={formData.start_location}
                    onChange={(e) => setFormData({ ...formData, start_location: e.target.value })}
                    placeholder="Beach Road Junction"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_location">End Location</Label>
                  <Input
                    id="end_location"
                    value={formData.end_location}
                    onChange={(e) => setFormData({ ...formData, end_location: e.target.value })}
                    placeholder="Technology Park"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distance_km">Distance (km)</Label>
                  <Input
                    id="distance_km"
                    type="number"
                    step="0.1"
                    value={formData.distance_km}
                    onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                    placeholder="18.2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="estimated_duration_minutes"
                    type="number"
                    value={formData.estimated_duration_minutes}
                    onChange={(e) => setFormData({ ...formData, estimated_duration_minutes: e.target.value })}
                    placeholder="35"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="fare_per_km">Fare per km</Label>
                  <Input
                    id="fare_per_km"
                    type="number"
                    step="0.01"
                    value={formData.fare_per_km}
                    onChange={(e) => setFormData({ ...formData, fare_per_km: e.target.value })}
                    placeholder="2.75"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleAddRoute}>Add Route</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Fare/km</TableHead>
              <TableHead>Stops</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell className="font-medium">{route.route_number}</TableCell>
                <TableCell>{route.route_name}</TableCell>
                <TableCell>{route.distance_km} km</TableCell>
                <TableCell>{route.estimated_duration_minutes} min</TableCell>
                <TableCell>₹{route.fare_per_km}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {route.stops_count}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={route.is_active ? "default" : "secondary"}
                    className={`cursor-pointer ${route.is_active ? "" : "opacity-60"}`}
                    onClick={() => toggleRouteStatus(route.id)}
                  >
                    {route.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditRoute(route)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteRoute(route.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Dialog */}
        <Dialog open={!!editingRoute} onOpenChange={() => setEditingRoute(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Route</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_route_number">Route Number</Label>
                <Input
                  id="edit_route_number"
                  value={formData.route_number}
                  onChange={(e) => setFormData({ ...formData, route_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_route_name">Route Name</Label>
                <Input
                  id="edit_route_name"
                  value={formData.route_name}
                  onChange={(e) => setFormData({ ...formData, route_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_start_location">Start Location</Label>
                <Input
                  id="edit_start_location"
                  value={formData.start_location}
                  onChange={(e) => setFormData({ ...formData, start_location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_end_location">End Location</Label>
                <Input
                  id="edit_end_location"
                  value={formData.end_location}
                  onChange={(e) => setFormData({ ...formData, end_location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_distance_km">Distance (km)</Label>
                <Input
                  id="edit_distance_km"
                  type="number"
                  step="0.1"
                  value={formData.distance_km}
                  onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_estimated_duration_minutes">Duration (minutes)</Label>
                <Input
                  id="edit_estimated_duration_minutes"
                  type="number"
                  value={formData.estimated_duration_minutes}
                  onChange={(e) => setFormData({ ...formData, estimated_duration_minutes: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit_fare_per_km">Fare per km</Label>
                <Input
                  id="edit_fare_per_km"
                  type="number"
                  step="0.01"
                  value={formData.fare_per_km}
                  onChange={(e) => setFormData({ ...formData, fare_per_km: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditingRoute(null)} className="bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleUpdateRoute}>Update Route</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
