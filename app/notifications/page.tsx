import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { NotificationCenter } from "@/components/notification-center"

export default async function NotificationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance">Notifications</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Stay updated with bus arrivals, delays, and route changes.
          </p>
        </div>
        <div className="max-w-2xl">
          <NotificationCenter />
        </div>
      </main>
    </div>
  )
}
