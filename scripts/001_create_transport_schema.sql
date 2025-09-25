-- Create users table for authentication
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('passenger', 'driver', 'admin')) DEFAULT 'passenger',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create routes table
CREATE TABLE IF NOT EXISTS public.routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_number TEXT NOT NULL UNIQUE,
  route_name TEXT NOT NULL,
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  distance_km DECIMAL(10,2),
  estimated_duration_minutes INTEGER,
  fare_per_km DECIMAL(10,2) DEFAULT 2.50,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bus_stops table
CREATE TABLE IF NOT EXISTS public.bus_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_name TEXT NOT NULL,
  stop_code TEXT UNIQUE,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create route_stops junction table
CREATE TABLE IF NOT EXISTS public.route_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES public.bus_stops(id) ON DELETE CASCADE,
  stop_order INTEGER NOT NULL,
  distance_from_start_km DECIMAL(10,2),
  estimated_arrival_minutes INTEGER,
  UNIQUE(route_id, stop_order)
);

-- Create buses table
CREATE TABLE IF NOT EXISTS public.buses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_number TEXT NOT NULL UNIQUE,
  capacity INTEGER DEFAULT 50,
  current_route_id UUID REFERENCES public.routes(id),
  driver_id UUID REFERENCES public.users(id),
  is_active BOOLEAN DEFAULT true,
  last_maintenance DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bus_locations table for real-time tracking
CREATE TABLE IF NOT EXISTS public.bus_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id UUID REFERENCES public.buses(id) ON DELETE CASCADE,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  speed_kmh DECIMAL(5,2),
  heading INTEGER, -- 0-360 degrees
  passenger_count INTEGER DEFAULT 0,
  is_online BOOLEAN DEFAULT true,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bus_id UUID REFERENCES public.buses(id) ON DELETE CASCADE,
  route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
  passenger_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('delay', 'arrival', 'route_change', 'general')) DEFAULT 'general',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorite_routes table
CREATE TABLE IF NOT EXISTS public.user_favorite_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  route_id UUID REFERENCES public.routes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, route_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bus_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_routes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for public data (routes, stops, buses) - readable by all authenticated users
CREATE POLICY "Routes are viewable by all authenticated users" ON public.routes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Bus stops are viewable by all authenticated users" ON public.bus_stops FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Route stops are viewable by all authenticated users" ON public.route_stops FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Buses are viewable by all authenticated users" ON public.buses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Bus locations are viewable by all authenticated users" ON public.bus_locations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Trips are viewable by all authenticated users" ON public.trips FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user favorites
CREATE POLICY "Users can manage their own favorites" ON public.user_favorite_routes FOR ALL USING (auth.uid() = user_id);

-- Admin policies (users with user_type = 'admin' can manage all data)
CREATE POLICY "Admins can manage routes" ON public.routes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_type = 'admin')
);
CREATE POLICY "Admins can manage bus stops" ON public.bus_stops FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_type = 'admin')
);
CREATE POLICY "Admins can manage buses" ON public.buses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_type = 'admin')
);

-- Driver policies (drivers can update their bus locations and trips)
CREATE POLICY "Drivers can update bus locations" ON public.bus_locations FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.buses WHERE id = bus_id AND driver_id = auth.uid())
);
CREATE POLICY "Drivers can manage their trips" ON public.trips FOR ALL USING (auth.uid() = driver_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bus_locations_bus_id_timestamp ON public.bus_locations(bus_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_route_stops_route_id ON public.route_stops(route_id);
CREATE INDEX IF NOT EXISTS idx_trips_bus_id ON public.trips(bus_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id, created_at DESC);
