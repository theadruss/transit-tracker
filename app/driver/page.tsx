import { createServerSupabaseClient } from "@/lib/supabase/server"
import { DriverNavigation } from "@/components/driver-navigation"
import { DriverGPSTracker } from "@/components/driver-gps-tracker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Zap, AlertCircle } from "lucide-react"

// Mock data for demonstration
const mockCurrentTrip = {
  id: "trip-1",
  route_name: "City Center - Airport",
  route_number: "R001",
  status: "in_progress" as const,
  start_time: new Date().toISOString(),
  passenger_count: 25,
  next_stop: "University Gate",
  eta_minutes: 8,
}

const mockStats = {
  tripsToday: 3,
  totalPassengers: 127,
  onTimePercentage: 94,
  currentSpeed: 28,
}

export default async function DriverDashboard() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthenticated = !!user

  return (
    <div className="min-h-screen bg-background">
      <DriverNavigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance">Driver Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            {isAuthenticated
              ? "Manage your trips, update passenger counts, and track your performance."
              : "Sign in to access full driver features and start GPS tracking."}
          </p>
        </div>

        {!isAuthenticated && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Authentication Required</span>
              </div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                Please sign in to access GPS tracking and trip management features.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GPS Tracker - Main Feature */}
          <div className="lg:col-span-2 space-y-6">
            <DriverGPSTracker />
          </div>

          {/* Stats and Quick Info */}
          <div className="space-y-6">
            {isAuthenticated && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Today's Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Trips Completed</p>
                      <p className="text-2xl font-bold text-primary">{mockStats.tripsToday}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Passengers</p>
                      <p className="text-2xl font-bold text-primary">{mockStats.totalPassengers}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">On-Time Rate</p>
                      <p className="text-2xl font-bold text-green-600">{mockStats.onTimePercentage}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Speed</p>
                      <p className="text-2xl font-bold text-blue-600">{mockStats.currentSpeed} km/h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Trips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">R002 - University Mall</p>
                    <p className="text-xs text-muted-foreground">Scheduled: 2:30 PM</p>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">R001 - Airport Return</p>
                    <p className="text-xs text-muted-foreground">Scheduled: 4:15 PM</p>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Traffic Alert</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        Heavy traffic reported on Main Street. Consider alternate route.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
