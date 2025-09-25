export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  user_type: "passenger" | "driver" | "admin"
  created_at: string
  updated_at: string
}

export interface Route {
  id: string
  route_number: string
  route_name: string
  start_location: string
  end_location: string
  distance_km: number
  estimated_duration_minutes: number
  fare_per_km: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface BusStop {
  id: string
  stop_name: string
  stop_code: string
  latitude: number
  longitude: number
  address: string
  is_active: boolean
  created_at: string
}

export interface Bus {
  id: string
  bus_number: string
  capacity: number
  current_route_id?: string
  driver_id?: string
  is_active: boolean
  last_maintenance?: string
  created_at: string
  updated_at: string
}

export interface BusLocation {
  id: string
  bus_id: string
  latitude: number
  longitude: number
  speed_kmh?: number
  heading?: number
  passenger_count: number
  is_online: boolean
  timestamp: string
}

export interface Trip {
  id: string
  bus_id: string
  route_id: string
  driver_id: string
  start_time: string
  end_time?: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  passenger_count: number
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "delay" | "arrival" | "route_change" | "general"
  is_read: boolean
  created_at: string
}
