import { Navigation } from "@/components/navigation"
import { RoutesView } from "@/components/routes-view"

export default function RoutesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance">Bus Routes</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Explore all available bus routes in Kochi with real-time information.
          </p>
        </div>
        <RoutesView />
      </main>
    </div>
  )
}
