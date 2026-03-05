export type EventType =
  | 'wedding'
  | 'conference'
  | 'party'
  | 'outdoor'
  | 'corporate'
  | 'banquet';

export interface VenueHall {
  id: string;
  name: string;
  type: 'indoor' | 'outdoor' | 'mixed';
  seatingCapacity: number;
  standingCapacity: number;
  sizesqm: number;
  airConditioned: boolean;
  pricePerHour: number;
  pricePerDay: number;
  facilities: string[];
  images: string[];
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  address: string;
  landmark: string;
  category: EventType;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  priceTo: number;
  maxCapacity: number;
  coverImage: string;
  galleryImages: string[];
  halls: VenueHall[];
  facilities: string[];
  services: string[];
  phone: string;
  email: string;
  featured: boolean;
  verified: boolean;
}

export interface Category {
  id: EventType;
  label: string;
  icon: string;
  count: number;
}

export interface Location {
  city: string;
  state: string;
  venueCount: number;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  eventType: string;
  quote: string;
  rating: number;
  avatar: string;
}

export interface SearchFilters {
  location: string;
  type: string;
  guests: string;
  budget: string;
  facilities: string[];
  indoor: boolean;
  outdoor: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'capacity';
}
