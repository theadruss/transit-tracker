-- Insert sample routes
INSERT INTO public.routes (route_number, route_name, start_location, end_location, distance_km, estimated_duration_minutes, fare_per_km) VALUES
('R001', 'City Center - Airport', 'City Center Bus Terminal', 'International Airport', 25.5, 45, 3.00),
('R002', 'University - Mall', 'University Campus', 'Shopping Mall', 12.3, 25, 2.50),
('R003', 'Hospital - Railway Station', 'General Hospital', 'Central Railway Station', 8.7, 20, 2.00),
('R004', 'Beach Road - Tech Park', 'Beach Road', 'Technology Park', 18.2, 35, 2.75);

-- Insert sample bus stops
INSERT INTO public.bus_stops (stop_name, stop_code, latitude, longitude, address) VALUES
('City Center Terminal', 'CC001', 10.0261, 76.3125, 'City Center, Main Road'),
('University Gate', 'UG001', 10.0311, 76.3175, 'University Campus Main Gate'),
('Shopping Mall', 'SM001', 10.0361, 76.3225, 'Grand Shopping Mall'),
('General Hospital', 'GH001', 10.0411, 76.3275, 'General Hospital Main Entrance'),
('Railway Station', 'RS001', 10.0461, 76.3325, 'Central Railway Station'),
('Airport Terminal', 'AT001', 10.0511, 76.3375, 'International Airport Terminal'),
('Beach Road Junction', 'BR001', 10.0561, 76.3425, 'Beach Road Main Junction'),
('Tech Park Gate', 'TP001', 10.0611, 76.3475, 'Technology Park Main Gate');

-- Insert sample buses
INSERT INTO public.buses (bus_number, capacity, is_active) VALUES
('KL-07-AB-1234', 50, true),
('KL-07-CD-5678', 45, true),
('KL-07-EF-9012', 55, true),
('KL-07-GH-3456', 48, true);

-- Link routes with stops (route_stops)
-- Route R001: City Center - Airport
INSERT INTO public.route_stops (route_id, stop_id, stop_order, distance_from_start_km, estimated_arrival_minutes) 
SELECT r.id, s.id, 1, 0, 0 FROM public.routes r, public.bus_stops s WHERE r.route_number = 'R001' AND s.stop_code = 'CC001';
INSERT INTO public.route_stops (route_id, stop_id, stop_order, distance_from_start_km, estimated_arrival_minutes) 
SELECT r.id, s.id, 2, 25.5, 45 FROM public.routes r, public.bus_stops s WHERE r.route_number = 'R001' AND s.stop_code = 'AT001';

-- Route R002: University - Mall
INSERT INTO public.route_stops (route_id, stop_id, stop_order, distance_from_start_km, estimated_arrival_minutes) 
SELECT r.id, s.id, 1, 0, 0 FROM public.routes r, public.bus_stops s WHERE r.route_number = 'R002' AND s.stop_code = 'UG001';
INSERT INTO public.route_stops (route_id, stop_id, stop_order, distance_from_start_km, estimated_arrival_minutes) 
SELECT r.id, s.id, 2, 12.3, 25 FROM public.routes r, public.bus_stops s WHERE r.route_number = 'R002' AND s.stop_code = 'SM001';

-- Route R003: Hospital - Railway Station
INSERT INTO public.route_stops (route_id, stop_id, stop_order, distance_from_start_km, estimated_arrival_minutes) 
SELECT r.id, s.id, 1, 0, 0 FROM public.routes r, public.bus_stops s WHERE r.route_number = 'R003' AND s.stop_code = 'GH001';
INSERT INTO public.route_stops (route_id, stop_id, stop_order, distance_from_start_km, estimated_arrival_minutes) 
SELECT r.id, s.id, 2, 8.7, 20 FROM public.routes r, public.bus_stops s WHERE r.route_number = 'R003' AND s.stop_code = 'RS001';

-- Route R004: Beach Road - Tech Park
INSERT INTO public.route_stops (route_id, stop_id, stop_order, distance_from_start_km, estimated_arrival_minutes) 
SELECT r.id, s.id, 1, 0, 0 FROM public.routes r, public.bus_stops s WHERE r.route_number = 'R004' AND s.stop_code = 'BR001';
INSERT INTO public.route_stops (route_id, stop_id, stop_order, distance_from_start_km, estimated_arrival_minutes) 
SELECT r.id, s.id, 2, 18.2, 35 FROM public.routes r, public.bus_stops s WHERE r.route_number = 'R004' AND s.stop_code = 'TP001';
