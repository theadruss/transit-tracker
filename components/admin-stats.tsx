"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bus, Route, Users, TrendingUp, AlertTriangle } from "lucide-react"

const mockStats = {
  totalBuses: 24,
  activeBuses: 18,
  totalRoutes: 12,
  activeRoutes: 10,
  totalDrivers: 32,
  onDutyDrivers: 20,
  totalStops: 156,
  systemUptime: 99.2,
  dailyPassengers: 2847,
  onTimePerformance: 94.5,
}

const mockAlerts = [
  {
    id: "1",
    type: "warning",
    message: "Bus KL-07-AB-1234 has been offline for 15 minutes",
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    type: "info",
    message: "Route R003 experiencing high demand",
    timestamp: "5 minutes ago",
  },
  {
    id: "3",
    type: "error",
    message: "Driver John Doe has not checked in for scheduled trip",
    timestamp: "8 minutes ago",
  },
]

export function AdminStats() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockStats.activeBuses}/{mockStats.totalBuses}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockStats.activeBuses / mockStats.totalBuses) * 100)}% operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockStats.activeRoutes}/{mockStats.totalRoutes}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockStats.activeRoutes / mockStats.totalRoutes) * 100)}% active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Duty Drivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockStats.onDutyDrivers}/{mockStats.totalDrivers}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockStats.onDutyDrivers / mockStats.totalDrivers) * 100)}% available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Passengers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockStats.dailyPassengers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Uptime</span>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              >
                {mockStats.systemUptime}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">On-Time Performance</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                {mockStats.onTimePerformance}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Bus Stops</span>
              <span className="text-sm font-bold">{mockStats.totalStops}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  alert.type === "error"
                    ? "bg-red-50 dark:bg-red-900/20"
                    : alert.type === "warning"
                      ? "bg-yellow-50 dark:bg-yellow-900/20"
                      : "bg-blue-50 dark:bg-blue-900/20"
                }`}
              >
                <AlertTriangle
                  className={`h-4 w-4 mt-0.5 ${
                    alert.type === "error"
                      ? "text-red-600"
                      : alert.type === "warning"
                        ? "text-yellow-600"
                        : "text-blue-600"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
