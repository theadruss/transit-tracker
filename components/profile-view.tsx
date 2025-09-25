"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MapPin, Clock, Star, Award, TrendingUp } from "lucide-react"

export function ProfileView() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    preferredLanguage: "English",
    homeLocation: "Ernakulam South",
    workLocation: "Kakkanad Infopark",
  })

  const travelStats = {
    totalTrips: 156,
    totalDistance: 2847,
    favoriteRoute: "K001 - Ernakulam to Kakkanad",
    avgRating: 4.6,
    carbonSaved: 245,
    memberSince: "January 2024",
  }

  const recentTrips = [
    { date: "Today", route: "K001", from: "Ernakulam South", to: "Kakkanad", fare: 25, rating: 5 },
    { date: "Yesterday", route: "K004", from: "Vytilla", to: "Infopark", fare: 22, rating: 4 },
    { date: "2 days ago", route: "K002", from: "Marine Drive", to: "Fort Kochi", fare: 18, rating: 5 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Save" : "Edit"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/diverse-user-avatars.png" />
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Input
                      id="language"
                      value={profile.preferredLanguage}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="home">Home Location</Label>
                    <Input
                      id="home"
                      value={profile.homeLocation}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, homeLocation: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="work">Work Location</Label>
                    <Input
                      id="work"
                      value={profile.workLocation}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({ ...profile, workLocation: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Travel Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Travel Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{travelStats.totalTrips}</div>
              <div className="text-sm text-muted-foreground">Total Trips</div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Distance Traveled</span>
                <span className="font-medium">{travelStats.totalDistance} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{travelStats.avgRating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Carbon Saved</span>
                <span className="font-medium text-green-600">{travelStats.carbonSaved} kg CO₂</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Member Since</span>
                <span className="font-medium">{travelStats.memberSince}</span>
              </div>
            </div>
            <Badge variant="secondary" className="w-full justify-center">
              <Award className="h-4 w-4 mr-2" />
              Eco Warrior
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Trips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTrips.map((trip, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm font-medium">{trip.date}</div>
                    <Badge variant="outline" className="text-xs">
                      {trip.route}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {trip.from} → {trip.to}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">₹{trip.fare}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{trip.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Favorite Route */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Favorite Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{travelStats.favoriteRoute}</p>
              <p className="text-sm text-muted-foreground">Used 45 times this month</p>
            </div>
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Track Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
