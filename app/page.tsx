import { Navigation } from "@/components/navigation"
import { LiveMap } from "@/components/live-map"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance">Real-time Public Transport Tracking</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Track buses live, get accurate arrival times, and plan your journey with confidence.
          </p>
        </div>
        <LiveMap />
      </main>
    </div>
  )
}
