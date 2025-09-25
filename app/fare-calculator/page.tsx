import { Navigation } from "@/components/navigation"
import { FareCalculator } from "@/components/fare-calculator"

export default function FareCalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance">Fare Calculator</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Calculate bus fares for different routes and distances.
          </p>
        </div>
        <div className="max-w-2xl">
          <FareCalculator />
        </div>
      </main>
    </div>
  )
}
