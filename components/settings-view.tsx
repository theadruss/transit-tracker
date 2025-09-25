"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Bell, Globe, Volume2, Shield, Smartphone } from "lucide-react"

export function SettingsView() {
  const [settings, setSettings] = useState({
    notifications: {
      busArrivals: true,
      routeUpdates: true,
      fareChanges: false,
      promotions: true,
      pushNotifications: true,
      smsAlerts: false,
    },
    preferences: {
      language: "english",
      theme: "system",
      defaultLocation: "ernakulam",
      soundVolume: [75],
      autoRefresh: true,
      showCrowdLevels: true,
    },
    privacy: {
      shareLocation: true,
      analytics: true,
      crashReports: true,
    },
  })

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }))
  }

  const updatePreferenceSetting = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }))
  }

  const updatePrivacySetting = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="bus-arrivals">Bus Arrival Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when your bus is approaching</p>
            </div>
            <Switch
              id="bus-arrivals"
              checked={settings.notifications.busArrivals}
              onCheckedChange={(value) => updateNotificationSetting("busArrivals", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="route-updates">Route Updates</Label>
              <p className="text-sm text-muted-foreground">Service disruptions and schedule changes</p>
            </div>
            <Switch
              id="route-updates"
              checked={settings.notifications.routeUpdates}
              onCheckedChange={(value) => updateNotificationSetting("routeUpdates", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="fare-changes">Fare Changes</Label>
              <p className="text-sm text-muted-foreground">Updates about fare modifications</p>
            </div>
            <Switch
              id="fare-changes"
              checked={settings.notifications.fareChanges}
              onCheckedChange={(value) => updateNotificationSetting("fareChanges", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="promotions">Promotions & Offers</Label>
              <p className="text-sm text-muted-foreground">Special deals and discounts</p>
            </div>
            <Switch
              id="promotions"
              checked={settings.notifications.promotions}
              onCheckedChange={(value) => updateNotificationSetting("promotions", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Enable browser push notifications</p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.notifications.pushNotifications}
              onCheckedChange={(value) => updateNotificationSetting("pushNotifications", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-alerts">SMS Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive important updates via SMS</p>
            </div>
            <Switch
              id="sms-alerts"
              checked={settings.notifications.smsAlerts}
              onCheckedChange={(value) => updateNotificationSetting("smsAlerts", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={settings.preferences.language}
                onValueChange={(value) => updatePreferenceSetting("language", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="malayalam">മലയാളം (Malayalam)</SelectItem>
                  <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={settings.preferences.theme}
                onValueChange={(value) => updatePreferenceSetting("theme", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Location</Label>
              <Select
                value={settings.preferences.defaultLocation}
                onValueChange={(value) => updatePreferenceSetting("defaultLocation", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ernakulam">Ernakulam South</SelectItem>
                  <SelectItem value="kakkanad">Kakkanad</SelectItem>
                  <SelectItem value="fort-kochi">Fort Kochi</SelectItem>
                  <SelectItem value="marine-drive">Marine Drive</SelectItem>
                  <SelectItem value="aluva">Aluva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Notification Sound Volume</Label>
            <div className="flex items-center gap-4">
              <Volume2 className="h-4 w-4" />
              <Slider
                value={settings.preferences.soundVolume}
                onValueChange={(value) => updatePreferenceSetting("soundVolume", value)}
                max={100}
                step={5}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12">{settings.preferences.soundVolume[0]}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-refresh">Auto Refresh</Label>
              <p className="text-sm text-muted-foreground">Automatically update bus locations</p>
            </div>
            <Switch
              id="auto-refresh"
              checked={settings.preferences.autoRefresh}
              onCheckedChange={(value) => updatePreferenceSetting("autoRefresh", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="crowd-levels">Show Crowd Levels</Label>
              <p className="text-sm text-muted-foreground">Display bus occupancy information</p>
            </div>
            <Switch
              id="crowd-levels"
              checked={settings.preferences.showCrowdLevels}
              onCheckedChange={(value) => updatePreferenceSetting("showCrowdLevels", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="share-location">Share Location</Label>
              <p className="text-sm text-muted-foreground">Allow app to access your location for better service</p>
            </div>
            <Switch
              id="share-location"
              checked={settings.privacy.shareLocation}
              onCheckedChange={(value) => updatePrivacySetting("shareLocation", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analytics">Usage Analytics</Label>
              <p className="text-sm text-muted-foreground">Help improve the app by sharing usage data</p>
            </div>
            <Switch
              id="analytics"
              checked={settings.privacy.analytics}
              onCheckedChange={(value) => updatePrivacySetting("analytics", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="crash-reports">Crash Reports</Label>
              <p className="text-sm text-muted-foreground">Automatically send crash reports to help fix issues</p>
            </div>
            <Switch
              id="crash-reports"
              checked={settings.privacy.crashReports}
              onCheckedChange={(value) => updatePrivacySetting("crashReports", value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            Smart Features (Beta)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ai-predictions">AI-Powered Predictions</Label>
              <p className="text-sm text-muted-foreground">Get smarter ETA predictions based on traffic and weather</p>
            </div>
            <Switch id="ai-predictions" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="smart-alerts">Smart Departure Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when to leave based on real-time conditions</p>
            </div>
            <Switch id="smart-alerts" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="route-optimization">Route Optimization</Label>
              <p className="text-sm text-muted-foreground">Suggest alternative routes during disruptions</p>
            </div>
            <Switch id="route-optimization" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save All Settings</Button>
      </div>
    </div>
  )
}
