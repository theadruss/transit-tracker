import { Navigation } from "@/components/navigation"
import { ETAView } from "@/components/eta-view"

export default function ETAsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance">Live ETAs</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Real-time arrival predictions for buses at your nearest stops.
          </p>
        </div>
        <ETAView />
      </main>
    </div>
  )
}
