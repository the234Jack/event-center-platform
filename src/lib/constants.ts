// ─── User Roles ─────────────────────────────────────────────────────────────
export const ROLES = {
  CLIENT: 'client',
  STAFF: 'staff',
  OWNER: 'owner',
  ADMIN: 'admin',
} as const;

// ─── Booking Statuses ────────────────────────────────────────────────────────
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

// Display label mapping (DB status → UI label)
export const BOOKING_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
};

// ─── Venue Categories ────────────────────────────────────────────────────────
export const VENUE_CATEGORIES = [
  { value: 'wedding', label: 'Wedding Venue' },
  { value: 'conference', label: 'Corporate / Conference' },
  { value: 'party', label: 'Party Hall' },
  { value: 'banquet', label: 'Banquet Hall' },
  { value: 'outdoor', label: 'Outdoor Venue' },
  { value: 'corporate', label: 'Corporate Event Center' },
] as const;

export const VENUE_CATEGORY_LABELS: Record<string, string> = {
  wedding: 'Wedding',
  conference: 'Conference',
  party: 'Party',
  outdoor: 'Outdoor',
  corporate: 'Corporate',
  banquet: 'Banquet',
};

// ─── Event Types (for booking form) ─────────────────────────────────────────
export const EVENT_TYPES = [
  { value: 'Wedding', label: 'Wedding', emoji: '💍', description: 'Traditional or white wedding ceremony & reception' },
  { value: 'Birthday Party', label: 'Birthday Party', emoji: '🎂', description: 'Birthday celebrations of any scale' },
  { value: 'Corporate Event', label: 'Corporate Event', emoji: '💼', description: 'Company meetings, retreats, dinners' },
  { value: 'Conference', label: 'Conference', emoji: '🎤', description: 'Seminars, workshops, panel discussions' },
  { value: 'Graduation', label: 'Graduation', emoji: '🎓', description: 'Graduation ceremony and parties' },
  { value: 'Naming Ceremony', label: 'Naming Ceremony', emoji: '👶', description: 'Traditional naming ceremonies' },
  { value: 'Funeral/Wake', label: 'Funeral / Wake', emoji: '🕊️', description: 'Wake keeping and burial ceremonies' },
  { value: 'Religious Event', label: 'Religious Event', emoji: '🙏', description: 'Church, mosque or religious gatherings' },
  { value: 'Concert/Show', label: 'Concert / Show', emoji: '🎵', description: 'Live performances and entertainment shows' },
  { value: 'Product Launch', label: 'Product Launch', emoji: '🚀', description: 'Brand and product launch events' },
  { value: 'Anniversary', label: 'Anniversary', emoji: '🥂', description: 'Wedding and company anniversaries' },
  { value: 'Other', label: 'Other', emoji: '📅', description: 'Any other type of event' },
] as const;

// ─── Smart Planner: Event Requirements ──────────────────────────────────────
// For each event type, defines what facilities/features are most important
export const EVENT_REQUIREMENTS: Record<string, {
  recommendedFacilities: string[];
  facilityWeights: Record<string, number>;
  preferredCategory: string[];
  hallTypePreference: 'indoor' | 'outdoor' | 'any';
  tips: string[];
}> = {
  'Wedding': {
    recommendedFacilities: ['Dressing Room', 'Parking Space', 'Stage', 'Sound System', 'Lighting', 'Power Supply', 'Toilets'],
    facilityWeights: { 'Dressing Room': 4, 'Parking Space': 3, 'Stage': 3, 'Sound System': 3, 'Lighting': 2, 'Power Supply': 2 },
    preferredCategory: ['wedding', 'banquet'],
    hallTypePreference: 'indoor',
    tips: ['Ensure venue has a bridal suite or dressing room', 'Confirm parking for 50%+ of guests', 'Check if venue allows external caterers'],
  },
  'Birthday Party': {
    recommendedFacilities: ['Sound System', 'Stage', 'Parking Space', 'Lighting', 'Power Supply'],
    facilityWeights: { 'Sound System': 3, 'Stage': 2, 'Lighting': 2, 'Parking Space': 2 },
    preferredCategory: ['party', 'banquet', 'wedding'],
    hallTypePreference: 'any',
    tips: ['Look for venues with flexible setup options', 'Check if catering is provided or allowed externally', 'Outdoor venues add a fun ambiance for daytime parties'],
  },
  'Corporate Event': {
    recommendedFacilities: ['Sound System', 'Power Supply', 'Parking Space', 'Toilets', 'Lighting'],
    facilityWeights: { 'Sound System': 3, 'Power Supply': 3, 'Parking Space': 3, 'Toilets': 2 },
    preferredCategory: ['corporate', 'conference'],
    hallTypePreference: 'indoor',
    tips: ['Prioritise venues with strong power backup', 'Check AV equipment availability', 'Central locations (Ikeja, VI) work well for corporate events'],
  },
  'Conference': {
    recommendedFacilities: ['Sound System', 'Stage', 'Power Supply', 'Parking Space', 'Lighting'],
    facilityWeights: { 'Sound System': 4, 'Stage': 3, 'Power Supply': 3, 'Parking Space': 2 },
    preferredCategory: ['conference', 'corporate'],
    hallTypePreference: 'indoor',
    tips: ['Ensure stage and podium are available', 'Confirm availability of breakout rooms if needed', 'Check Wi-Fi and AV support'],
  },
  'Graduation': {
    recommendedFacilities: ['Stage', 'Sound System', 'Parking Space', 'Power Supply', 'Toilets'],
    facilityWeights: { 'Stage': 4, 'Sound System': 3, 'Parking Space': 2, 'Power Supply': 2 },
    preferredCategory: ['banquet', 'wedding', 'corporate'],
    hallTypePreference: 'indoor',
    tips: ['Large halls with elevated stages work best', 'Book well in advance (March–July season is busy)', 'Confirm capacity for both students and guests'],
  },
  'Naming Ceremony': {
    recommendedFacilities: ['Parking Space', 'Toilets', 'Chairs', 'Tables', 'Power Supply'],
    facilityWeights: { 'Parking Space': 3, 'Chairs': 3, 'Tables': 3, 'Toilets': 2 },
    preferredCategory: ['banquet', 'party'],
    hallTypePreference: 'any',
    tips: ['Smaller halls often suffice (50–200 guests)', 'Outdoor venues are popular for daytime naming ceremonies', 'Check if the venue allows traditional decorations'],
  },
  'Funeral/Wake': {
    recommendedFacilities: ['Parking Space', 'Toilets', 'Chairs', 'Tables', 'Power Supply'],
    facilityWeights: { 'Parking Space': 4, 'Toilets': 3, 'Chairs': 3, 'Tables': 2 },
    preferredCategory: ['banquet', 'outdoor'],
    hallTypePreference: 'any',
    tips: ['Prioritise easy access for elderly guests', 'Ample parking is essential', 'Confirm venue allows extended hours for all-night events'],
  },
  'Religious Event': {
    recommendedFacilities: ['Sound System', 'Stage', 'Parking Space', 'Power Supply', 'Chairs'],
    facilityWeights: { 'Sound System': 4, 'Stage': 3, 'Parking Space': 3, 'Power Supply': 3 },
    preferredCategory: ['outdoor', 'conference', 'banquet'],
    hallTypePreference: 'any',
    tips: ['Large open-air venues work for crusades and revival meetings', 'Sound system quality is critical', 'Ensure adequate power backup for evening events'],
  },
  'Concert/Show': {
    recommendedFacilities: ['Stage', 'Sound System', 'Lighting', 'Power Supply', 'Parking Space'],
    facilityWeights: { 'Stage': 5, 'Sound System': 5, 'Lighting': 4, 'Power Supply': 4, 'Parking Space': 2 },
    preferredCategory: ['outdoor', 'party'],
    hallTypePreference: 'any',
    tips: ['Ensure stage dimensions meet your performance needs', 'Professional-grade sound and lighting are essential', 'Check venue\'s noise policy and curfew time'],
  },
  'Product Launch': {
    recommendedFacilities: ['Stage', 'Sound System', 'Lighting', 'Power Supply', 'Parking Space'],
    facilityWeights: { 'Stage': 4, 'Sound System': 3, 'Lighting': 3, 'Power Supply': 3, 'Parking Space': 2 },
    preferredCategory: ['corporate', 'conference'],
    hallTypePreference: 'indoor',
    tips: ['Choose venues with modern, sophisticated aesthetics', 'VI and Lekki venues are premium for product launches', 'Confirm AV setup and display screen options'],
  },
  'Anniversary': {
    recommendedFacilities: ['Dressing Room', 'Stage', 'Sound System', 'Lighting', 'Parking Space'],
    facilityWeights: { 'Sound System': 3, 'Lighting': 3, 'Stage': 2, 'Parking Space': 2 },
    preferredCategory: ['wedding', 'banquet'],
    hallTypePreference: 'indoor',
    tips: ['Mid-size halls with elegant décor work best', 'Ensure venue has good ambiance for intimate settings', 'Check catering options'],
  },
  'Other': {
    recommendedFacilities: ['Power Supply', 'Parking Space', 'Toilets'],
    facilityWeights: { 'Power Supply': 2, 'Parking Space': 2, 'Toilets': 2 },
    preferredCategory: ['banquet', 'corporate'],
    hallTypePreference: 'any',
    tips: ['Describe your specific needs to the venue before booking', 'Flexible venues with multiple halls offer the best options'],
  },
};

// ─── Lagos Zones ─────────────────────────────────────────────────────────────
export const LAGOS_ZONES = [
  {
    id: 'all',
    name: 'All of Lagos',
    emoji: '🗺️',
    description: 'Search across all Lagos areas',
    color: 'bg-gray-100 border-gray-300 text-gray-700',
    activeColor: 'bg-gray-800 border-gray-800 text-white',
    areas: [],
  },
  {
    id: 'lekki-vi',
    name: 'Lekki / VI / Ikoyi',
    emoji: '🌊',
    description: 'Premium waterfront venues',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    activeColor: 'bg-blue-600 border-blue-600 text-white',
    areas: ['Lekki', 'Victoria Island', 'VI', 'Ikoyi', 'Ajah', 'Sangotedo', 'Chevron'],
  },
  {
    id: 'ikeja',
    name: 'Ikeja / Maryland',
    emoji: '✈️',
    description: 'Central business district',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    activeColor: 'bg-purple-600 border-purple-600 text-white',
    areas: ['Ikeja', 'Maryland', 'GRA', 'Alausa', 'Allen', 'Oregun', 'Ogba'],
  },
  {
    id: 'yaba-surulere',
    name: 'Yaba / Surulere',
    emoji: '🏙️',
    description: 'Mainland mid-range venues',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    activeColor: 'bg-emerald-600 border-emerald-600 text-white',
    areas: ['Yaba', 'Surulere', 'Iponri', 'Aguda', 'Ojuelegba', 'Itire'],
  },
  {
    id: 'lagos-island',
    name: 'Lagos Island / Apapa',
    emoji: '🏛️',
    description: 'Historic waterfront venues',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    activeColor: 'bg-amber-600 border-amber-600 text-white',
    areas: ['Lagos Island', 'Apapa', 'Marina', 'CMS', 'Badia', 'Iganmu'],
  },
  {
    id: 'badagry-ojo',
    name: 'Badagry / Ojo',
    emoji: '🌿',
    description: 'Spacious outskirts venues',
    color: 'bg-green-50 border-green-200 text-green-700',
    activeColor: 'bg-green-600 border-green-600 text-white',
    areas: ['Badagry', 'Ojo', 'Satellite Town', 'Trade Fair', 'Festac'],
  },
] as const;

export type LagosZoneId = typeof LAGOS_ZONES[number]['id'];

// Budget tier thresholds (relative to average Lagos venue price)
export const BUDGET_TIERS = {
  GREAT_VALUE: 0.75,   // < 75% of average → Great Value
  PREMIUM: 1.3,        // > 130% of average → Premium
} as const;

// Guest count ranges
export const GUEST_RANGES = ['1-50', '50-100', '100-200', '200-500', '500-1000', '1000+'] as const;

// ─── Event Cost Estimation Rules ─────────────────────────────────────────────
// All figures in Naira, based on Lagos 2024–2025 market rates.
// [min, max] per item.

export interface CostRange { min: number; max: number; }

// Per-head catering cost by event type
export const CATERING_PER_HEAD: Record<string, CostRange> = {
  'Wedding':         { min: 3500,  max: 7000  },
  'Birthday Party':  { min: 2500,  max: 5000  },
  'Corporate Event': { min: 3000,  max: 6000  },
  'Conference':      { min: 2000,  max: 4000  },
  'Graduation':      { min: 2000,  max: 4500  },
  'Naming Ceremony': { min: 2000,  max: 4000  },
  'Funeral/Wake':    { min: 1500,  max: 3000  },
  'Religious Event': { min: 1500,  max: 3000  },
  'Concert/Show':    { min: 0,     max: 0     }, // N/A — ticket event
  'Product Launch':  { min: 2500,  max: 5000  },
  'Anniversary':     { min: 3000,  max: 6000  },
  'Other':           { min: 2000,  max: 5000  },
};

// Décor budget by event type (flat range, independent of guest count)
export const DECOR_COST: Record<string, CostRange> = {
  'Wedding':         { min: 200000, max: 800000 },
  'Birthday Party':  { min: 80000,  max: 300000 },
  'Corporate Event': { min: 100000, max: 400000 },
  'Conference':      { min: 50000,  max: 200000 },
  'Graduation':      { min: 60000,  max: 200000 },
  'Naming Ceremony': { min: 50000,  max: 150000 },
  'Funeral/Wake':    { min: 30000,  max: 100000 },
  'Religious Event': { min: 30000,  max: 150000 },
  'Concert/Show':    { min: 150000, max: 600000 },
  'Product Launch':  { min: 200000, max: 600000 },
  'Anniversary':     { min: 150000, max: 400000 },
  'Other':           { min: 50000,  max: 200000 },
};

// MC / DJ / Entertainment by event type
export const MC_DJ_COST: Record<string, CostRange> = {
  'Wedding':         { min: 80000,  max: 250000 },
  'Birthday Party':  { min: 50000,  max: 150000 },
  'Corporate Event': { min: 60000,  max: 200000 },
  'Conference':      { min: 50000,  max: 150000 },
  'Graduation':      { min: 50000,  max: 150000 },
  'Naming Ceremony': { min: 30000,  max: 100000 },
  'Funeral/Wake':    { min: 20000,  max: 60000  },
  'Religious Event': { min: 20000,  max: 80000  },
  'Concert/Show':    { min: 200000, max: 600000 },
  'Product Launch':  { min: 80000,  max: 250000 },
  'Anniversary':     { min: 60000,  max: 200000 },
  'Other':           { min: 30000,  max: 100000 },
};

// Photography & videography by event type
export const PHOTOGRAPHY_COST: Record<string, CostRange> = {
  'Wedding':         { min: 150000, max: 500000 },
  'Birthday Party':  { min: 60000,  max: 200000 },
  'Corporate Event': { min: 80000,  max: 250000 },
  'Conference':      { min: 60000,  max: 200000 },
  'Graduation':      { min: 50000,  max: 150000 },
  'Naming Ceremony': { min: 40000,  max: 120000 },
  'Funeral/Wake':    { min: 30000,  max: 80000  },
  'Religious Event': { min: 30000,  max: 100000 },
  'Concert/Show':    { min: 100000, max: 400000 },
  'Product Launch':  { min: 150000, max: 400000 },
  'Anniversary':     { min: 80000,  max: 300000 },
  'Other':           { min: 40000,  max: 150000 },
};

// Generator / fuel cost by guest count tier
export const GENERATOR_COST_TIERS: Array<{ upTo: number; cost: CostRange }> = [
  { upTo: 100,       cost: { min: 20000,  max: 50000  } },
  { upTo: 300,       cost: { min: 40000,  max: 100000 } },
  { upTo: 600,       cost: { min: 80000,  max: 200000 } },
  { upTo: Infinity,  cost: { min: 150000, max: 400000 } },
];

// Security cost by guest count tier
export const SECURITY_COST_TIERS: Array<{ upTo: number; cost: CostRange }> = [
  { upTo: 100,       cost: { min: 15000,  max: 30000  } },
  { upTo: 300,       cost: { min: 25000,  max: 60000  } },
  { upTo: 600,       cost: { min: 50000,  max: 120000 } },
  { upTo: Infinity,  cost: { min: 100000, max: 250000 } },
];

// Guest overflow multiplier by event type (Nigerian cultural norm)
export const GUEST_OVERFLOW_FACTOR: Record<string, number> = {
  'Wedding':         1.5,  // 50% more guests typically arrive
  'Birthday Party':  1.3,
  'Corporate Event': 1.1,
  'Conference':      1.05,
  'Graduation':      1.3,
  'Naming Ceremony': 1.4,
  'Funeral/Wake':    1.4,
  'Religious Event': 1.5,
  'Concert/Show':    1.0,  // ticketed — fixed
  'Product Launch':  1.1,
  'Anniversary':     1.3,
  'Other':           1.2,
};

// ─── Nigerian states list ─────────────────────────────────────────────────────
// Nigerian states list
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara',
] as const;
