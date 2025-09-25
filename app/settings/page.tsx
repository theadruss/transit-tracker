import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { SettingsView } from "@/components/settings-view"
import { Card, CardContent } from "@/components/ui/card"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance">Settings</h1>
          <p className="text-muted-foreground mt-2 text-pretty">
            Customize your app experience and notification preferences.
          </p>
        </div>

        {!user ? (
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
            <CardContent className="p-8 text-center">
              <LogIn className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 text-blue-800 dark:text-blue-200">Sign In Required</h3>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                Please sign in to access your settings and customize your experience.
              </p>
              <Link href="/auth/login">
                <Button>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <SettingsView />
        )}
      </main>
    </div>
  )
}
