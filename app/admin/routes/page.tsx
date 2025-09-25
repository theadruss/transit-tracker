import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminNavigation } from "@/components/admin-navigation"
import { RouteManagement } from "@/components/route-management"

export default async function AdminRoutesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance">Route Management</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Create, edit, and manage bus routes, stops, and fare structures.
          </p>
        </div>
        <RouteManagement />
      </main>
    </div>
  )
}
