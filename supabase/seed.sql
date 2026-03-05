-- ============================================================
-- EventHub Seed Data — All venues and halls
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ─── VENUES ────────────────────────────────────────────────

INSERT INTO venues (id, owner_id, name, description, city, state, address, landmark, category, phone, email, rating, review_count, price_from, price_to, max_capacity, cover_image, gallery_images, facilities, services, featured, verified) VALUES

('grand-palace-ikeja', NULL, 'Grand Palace Event Center',
 'A premier event center in the heart of Ikeja offering world-class facilities for weddings, corporate events, and social gatherings. With stunning architecture and impeccable service, Grand Palace is Lagos''s most sought-after venue.',
 'Lagos', 'Lagos', '15 Obafemi Awolowo Way, Ikeja', 'Near Ikeja City Mall', 'wedding',
 '08012345678', 'info@grandpalace.ng', 4.9, 127, 150000, 800000, 1500,
 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
 ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80','https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80','https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800&q=80','https://images.unsplash.com/photo-1478145787956-f1b80c47e7e5?w=800&q=80','https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80'],
 ARRAY['Parking Space','Toilets','Power Supply','Stage','Chairs','Tables','Sound System','Lighting','Dressing Room'],
 ARRAY['Catering','Decoration','Cleaning','Security'], TRUE, TRUE),

('elite-hub-vi', NULL, 'Elite Events Hub',
 'Victoria Island''s most prestigious event space, offering contemporary design and cutting-edge technology for corporate and social events.',
 'Lagos', 'Lagos', '7 Adeola Odeku Street, Victoria Island', 'Opposite Eko Hotel', 'corporate',
 '08023456789', 'events@elitehub.ng', 4.7, 89, 200000, 1200000, 1000,
 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
 ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80','https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80','https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80','https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'],
 ARRAY['Parking Space','Toilets','Power Supply','Stage','Sound System','Lighting','Dressing Room'],
 ARRAY['Catering','Cleaning','Security'], TRUE, TRUE),

('jubilee-hall-abuja', NULL, 'Jubilee Hall Abuja',
 'Abuja''s finest event center situated in the heart of the capital. A blend of modern architecture and Nigerian heritage.',
 'Abuja', 'FCT', 'Plot 123, Wuse Zone 5', 'Near Transcorp Hilton Hotel', 'banquet',
 '09034567890', 'bookings@jubileehall.ng', 4.8, 104, 180000, 950000, 2000,
 'https://images.unsplash.com/photo-1478145787956-f1b80c47e7e5?w=800&q=80',
 ARRAY['https://images.unsplash.com/photo-1478145787956-f1b80c47e7e5?w=800&q=80','https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800&q=80','https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80'],
 ARRAY['Parking Space','Toilets','Power Supply','Stage','Chairs','Tables','Sound System','Lighting','Dressing Room'],
 ARRAY['Catering','Decoration','Cleaning','Security'], TRUE, TRUE),

('rivers-garden-ph', NULL, 'Rivers Garden Event Center',
 'An exquisite outdoor and indoor event venue in Port Harcourt offering lush garden spaces and modern indoor halls.',
 'Port Harcourt', 'Rivers', '32 Peter Odili Road, Trans-Amadi', 'Near Port Harcourt Civic Centre', 'outdoor',
 '08045678901', 'info@riversgarden.ng', 4.6, 73, 80000, 500000, 800,
 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80',
 ARRAY['https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80','https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'],
 ARRAY['Parking Space','Toilets','Power Supply','Stage','Tables','Chairs','Sound System','Lighting'],
 ARRAY['Catering','Decoration','Cleaning','Security'], TRUE, TRUE),

('royal-banquet-ibadan', NULL, 'Royal Banquet Hall',
 'Ibadan''s most elegant banquet hall combining traditional Yoruba grandeur with modern event facilities.',
 'Ibadan', 'Oyo', '10 Ring Road, Ibadan', 'Near Cocoa House', 'banquet',
 '08056789012', 'info@royalbanquet.ng', 4.5, 62, 70000, 400000, 1000,
 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
 ARRAY['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80','https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80'],
 ARRAY['Parking Space','Toilets','Power Supply','Stage','Tables','Chairs','Sound System','Lighting','Dressing Room'],
 ARRAY['Catering','Decoration','Cleaning','Security'], TRUE, TRUE),

('summit-conference-abuja', NULL, 'Summit Conference Centre',
 'Abuja''s leading conference facility featuring state-of-the-art audio-visual equipment and multiple breakout rooms.',
 'Abuja', 'FCT', 'Central Business District, Abuja', 'Adjacent to NICON Luxury Hotel', 'conference',
 '09067890123', 'bookings@summitcentre.ng', 4.7, 91, 120000, 600000, 600,
 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80',
 ARRAY['https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80','https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80','https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
 ARRAY['Parking Space','Toilets','Power Supply','Stage','Sound System','Lighting'],
 ARRAY['Catering','Cleaning','Security'], FALSE, TRUE),

('enugu-heritage-hall', NULL, 'Enugu Heritage Hall',
 'A grand event venue in Coal City, blending cultural heritage with modern amenities.',
 'Enugu', 'Enugu', 'Independence Layout, Enugu', 'Near Government House', 'wedding',
 '08078901234', 'info@enuguheritagehall.ng', 4.4, 48, 60000, 350000, 1200,
 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80',
 ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80','https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80'],
 ARRAY['Parking Space','Toilets','Power Supply','Stage','Tables','Chairs','Sound System'],
 ARRAY['Catering','Decoration','Security'], FALSE, TRUE),

('vivacity-lounge-lagos', NULL, 'Vivacity Event Lounge',
 'A chic, modern event lounge in Lekki for birthday parties, bridal showers, cocktail receptions, and private dinners.',
 'Lagos', 'Lagos', '5 Admiralty Way, Lekki Phase 1', 'Near Lekki Conservation Centre', 'party',
 '08089012345', 'hello@vivacity.ng', 4.6, 83, 50000, 300000, 400,
 'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800&q=80',
 ARRAY['https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800&q=80','https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80'],
 ARRAY['Parking Space','Toilets','Power Supply','Sound System','Lighting','Dressing Room'],
 ARRAY['Catering','Decoration','Cleaning','Security'], FALSE, TRUE),

('crystal-point-ph', NULL, 'Crystal Point Events',
 'Modern multi-purpose event center in GRA Port Harcourt with flexible hall configurations.',
 'Port Harcourt', 'Rivers', '18 Rumuola Road, GRA Phase 2', 'Off Aba Road', 'corporate',
 '09090123456', 'info@crystalpoint.ng', 4.3, 41, 90000, 450000, 700,
 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80',
 ARRAY['https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80','https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'],
 ARRAY['Parking Space','Toilets','Power Supply','Stage','Sound System','Lighting'],
 ARRAY['Catering','Cleaning','Security'], FALSE, TRUE),

('sunrise-events-ibadan', NULL, 'Sunrise Events Centre',
 'Ibadan''s go-to venue for birthday parties, naming ceremonies, and family celebrations.',
 'Ibadan', 'Oyo', 'Bodija Market Road, Bodija', 'Near University of Ibadan Gate', 'party',
 '08001234567', 'info@sunriseevents.ng', 4.2, 35, 40000, 200000, 600,
 'https://images.unsplash.com/photo-1484824823018-c36f00489002?w=800&q=80',
 ARRAY['https://images.unsplash.com/photo-1484824823018-c36f00489002?w=800&q=80'],
 ARRAY['Parking Space','Toilets','Power Supply','Tables','Chairs','Sound System'],
 ARRAY['Catering','Decoration','Security'], FALSE, FALSE),

('lagoon-view-lagos', NULL, 'Lagoon View Event Hall',
 'An awe-inspiring waterfront event center on Lagos Island with breathtaking lagoon views.',
 'Lagos', 'Lagos', 'Marina Road, Lagos Island', 'Opposite NICON', 'wedding',
 '07012345678', 'reservations@lagoonview.ng', 4.8, 112, 250000, 1500000, 2000,
 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
 ARRAY['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80','https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80','https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80'],
 ARRAY['Parking Space','Toilets','Power Supply','Stage','Chairs','Tables','Sound System','Lighting','Dressing Room'],
 ARRAY['Catering','Decoration','Cleaning','Security'], TRUE, TRUE),

('nnamdi-conference-enugu', NULL, 'Nnamdi Conference Centre',
 'A purpose-built conference center in Enugu ideal for seminars, workshops, and academic conferences.',
 'Enugu', 'Enugu', 'GRA Enugu, off Abakaliki Road', 'Near University of Nigeria Teaching Hospital', 'conference',
 '08112345678', 'info@nnamdicentre.ng', 4.3, 29, 50000, 250000, 400,
 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
 ARRAY['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'],
 ARRAY['Parking Space','Toilets','Power Supply','Stage','Sound System'],
 ARRAY['Catering','Cleaning'], FALSE, TRUE);

-- ─── HALLS ─────────────────────────────────────────────────

INSERT INTO halls (id, venue_id, name, type, seating_capacity, standing_capacity, size_sqm, air_conditioned, price_per_hour, price_per_day, facilities, images) VALUES

-- Grand Palace
('grand-ballroom', 'grand-palace-ikeja', 'Grand Ballroom', 'indoor', 1200, 1500, 2400, TRUE, 80000, 500000, ARRAY['Stage','Sound System','Lighting','Projector','Tables','Chairs'], ARRAY['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80']),
('crystal-hall', 'grand-palace-ikeja', 'Crystal Hall', 'indoor', 500, 700, 1000, TRUE, 40000, 250000, ARRAY['Sound System','Lighting','Tables','Chairs','Bar'], ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80']),
('garden-terrace', 'grand-palace-ikeja', 'Garden Terrace', 'outdoor', 300, 500, 800, FALSE, 25000, 150000, ARRAY['Lighting','Tables','Chairs','Stage'], ARRAY['https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80']),

-- Elite Hub
('executive-suite', 'elite-hub-vi', 'Executive Suite', 'indoor', 800, 1000, 1800, TRUE, 100000, 700000, ARRAY['Stage','Sound System','Lighting','LED Screen','Tables','Chairs','Projector'], ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80']),
('boardroom', 'elite-hub-vi', 'Premium Boardroom', 'indoor', 50, 80, 120, TRUE, 30000, 180000, ARRAY['Projector','Sound System','Tables','Chairs','Whiteboard'], ARRAY['https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80']),

-- Jubilee Hall
('jubilee-main', 'jubilee-hall-abuja', 'Jubilee Main Hall', 'indoor', 2000, 2500, 4000, TRUE, 120000, 750000, ARRAY['Stage','Sound System','Lighting','Tables','Chairs','Projector','Dressing Room'], ARRAY['https://images.unsplash.com/photo-1478145787956-f1b80c47e7e5?w=800&q=80']),
('annex-hall', 'jubilee-hall-abuja', 'Annex Hall', 'indoor', 400, 600, 800, TRUE, 50000, 300000, ARRAY['Sound System','Lighting','Tables','Chairs'], ARRAY['https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800&q=80']),

-- Rivers Garden
('garden-main', 'rivers-garden-ph', 'Garden Pavilion', 'outdoor', 500, 800, 2000, FALSE, 30000, 200000, ARRAY['Stage','Lighting','Tables','Chairs','Sound System'], ARRAY['https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80']),
('garden-indoor', 'rivers-garden-ph', 'Indoor Reception Hall', 'indoor', 300, 400, 600, TRUE, 25000, 150000, ARRAY['Sound System','Lighting','Tables','Chairs','AC'], ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80']),

-- Royal Banquet
('royal-main', 'royal-banquet-ibadan', 'Royal Main Hall', 'indoor', 800, 1000, 1600, TRUE, 40000, 250000, ARRAY['Stage','Sound System','Lighting','Tables','Chairs'], ARRAY['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80']),

-- Summit Conference
('summit-main', 'summit-conference-abuja', 'Summit Auditorium', 'indoor', 500, 600, 1000, TRUE, 60000, 400000, ARRAY['Stage','Sound System','Lighting','Projector','Tables','Chairs','LED Screen'], ARRAY['https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80']),
('breakout-a', 'summit-conference-abuja', 'Breakout Room A', 'indoor', 60, 80, 150, TRUE, 20000, 100000, ARRAY['Projector','Tables','Chairs','Whiteboard'], ARRAY['https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80']),

-- Enugu Heritage
('heritage-main', 'enugu-heritage-hall', 'Heritage Grand Hall', 'indoor', 1000, 1200, 2000, TRUE, 35000, 200000, ARRAY['Stage','Sound System','Lighting','Tables','Chairs'], ARRAY['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80']),

-- Vivacity Lounge
('lounge-main', 'vivacity-lounge-lagos', 'Main Lounge', 'indoor', 250, 400, 500, TRUE, 30000, 180000, ARRAY['Sound System','Lighting','Bar','Stage','Tables','Chairs'], ARRAY['https://images.unsplash.com/photo-1522413452208-996ff3f3e740?w=800&q=80']),

-- Crystal Point
('crystal-main', 'crystal-point-ph', 'Crystal Hall', 'indoor', 600, 700, 1200, TRUE, 50000, 300000, ARRAY['Stage','Sound System','Lighting','Tables','Chairs','Projector'], ARRAY['https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&q=80']),

-- Sunrise Events
('sunrise-hall', 'sunrise-events-ibadan', 'Sunrise Hall', 'indoor', 500, 600, 1000, TRUE, 20000, 120000, ARRAY['Sound System','Lighting','Tables','Chairs'], ARRAY['https://images.unsplash.com/photo-1484824823018-c36f00489002?w=800&q=80']),

-- Lagoon View
('lagoon-grand', 'lagoon-view-lagos', 'Grand Lagoon Hall', 'indoor', 1800, 2000, 3600, TRUE, 150000, 1000000, ARRAY['Stage','Sound System','Lighting','Tables','Chairs','Dressing Room','Projector'], ARRAY['https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80']),

-- Nnamdi Conference
('nnamdi-auditorium', 'nnamdi-conference-enugu', 'Nnamdi Auditorium', 'indoor', 400, 450, 800, TRUE, 25000, 150000, ARRAY['Stage','Sound System','Projector','Tables','Chairs'], ARRAY['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80']);
