import { Navigation } from "@/components/navigation"
import { ProfileView } from "@/components/profile-view"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-balance">My Profile</h1>
          <p className="text-muted-foreground mt-2 text-pretty">Manage your account settings and travel preferences.</p>
        </div>
        <ProfileView />
      </main>
    </div>
  )
}
