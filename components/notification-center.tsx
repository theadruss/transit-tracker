"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Check, CheckCheck, AlertCircle, Info, Clock, Route } from "lucide-react"
import { useNotifications } from "@/hooks/use-notifications"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { formatTime, formatDate } from "@/lib/utils/transport"

const notificationIcons = {
  delay: AlertCircle,
  arrival: Clock,
  route_change: Route,
  general: Info,
}

const notificationColors = {
  delay: "text-red-500",
  arrival: "text-blue-500",
  route_change: "text-yellow-500",
  general: "text-gray-500",
}

export function NotificationCenter() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications()
  const { permission, isSupported, requestPermission } = usePushNotifications()
  const [showAll, setShowAll] = useState(false)

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 10)

  const handleEnablePushNotifications = async () => {
    const granted = await requestPermission()
    if (granted) {
      console.log("[v0] Push notifications enabled")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading notifications...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm" className="bg-transparent">
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Push Notification Permission */}
        {isSupported && permission !== "granted" && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Enable Push Notifications</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Get instant alerts about bus arrivals, delays, and route changes.
                </p>
                <Button onClick={handleEnablePushNotifications} size="sm" className="mt-2">
                  Enable Notifications
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {displayedNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No notifications yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You'll receive updates about bus arrivals and delays here
                </p>
              </div>
            ) : (
              displayedNotifications.map((notification) => {
                const IconComponent = notificationIcons[notification.type] || Info
                const iconColor = notificationColors[notification.type] || "text-gray-500"

                return (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                      notification.is_read
                        ? "bg-background border-border"
                        : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                    }`}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent className={`h-5 w-5 mt-0.5 ${iconColor}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.is_read && (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Badge
                              variant="secondary"
                              className={`text-xs ${
                                notification.type === "delay"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                  : notification.type === "arrival"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                    : notification.type === "route_change"
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                                      : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                              }`}
                            >
                              {notification.type.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{formatDate(notification.created_at)}</span>
                          <span>{formatTime(notification.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>

        {/* Show More Button */}
        {notifications.length > 10 && (
          <div className="text-center">
            <Button onClick={() => setShowAll(!showAll)} variant="outline" size="sm" className="bg-transparent">
              {showAll ? "Show Less" : `Show All (${notifications.length})`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
