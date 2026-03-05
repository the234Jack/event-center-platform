export type UserRole = 'client' | 'staff' | 'owner';
export type EventType = 'wedding' | 'conference' | 'party' | 'outdoor' | 'corporate' | 'banquet';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type HallType = 'indoor' | 'outdoor' | 'mixed';
export type StaffRole = 'coordinator' | 'supervisor' | 'cleaner' | 'security' | 'catering' | 'technician';
export type StaffStatus = 'active' | 'inactive';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          phone: string | null;
          nin: string | null;
          date_of_birth: string | null;
          gender: string | null;
          state: string | null;
          lga: string | null;
          address: string | null;
          business_name: string | null;
          business_address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      venues: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          description: string | null;
          city: string;
          state: string;
          address: string | null;
          landmark: string | null;
          category: EventType;
          phone: string | null;
          email: string | null;
          rating: number;
          review_count: number;
          price_from: number;
          price_to: number;
          max_capacity: number;
          cover_image: string | null;
          gallery_images: string[];
          facilities: string[];
          services: string[];
          featured: boolean;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['venues']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['venues']['Insert']>;
      };
      halls: {
        Row: {
          id: string;
          venue_id: string;
          name: string;
          type: HallType;
          seating_capacity: number;
          standing_capacity: number;
          size_sqm: number | null;
          air_conditioned: boolean;
          price_per_hour: number;
          price_per_day: number;
          facilities: string[];
          images: string[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['halls']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['halls']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          client_id: string;
          venue_id: string;
          hall_id: string;
          event_date: string;
          start_time: string | null;
          end_time: string | null;
          event_type: string;
          guest_count: number;
          special_requirements: string | null;
          total_cost: number | null;
          status: BookingStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      staff_members: {
        Row: {
          id: string;
          user_id: string;
          venue_id: string;
          role: StaffRole;
          staff_code: string;
          status: StaffStatus;
          join_date: string;
          events_handled: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['staff_members']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['staff_members']['Insert']>;
      };
      tasks: {
        Row: {
          id: string;
          staff_id: string;
          title: string;
          priority: TaskPriority;
          due_date: string | null;
          category: string | null;
          notes: string | null;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tasks']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>;
      };
      saved_venues: {
        Row: {
          id: string;
          client_id: string;
          venue_id: string;
          saved_date: string;
        };
        Insert: Omit<Database['public']['Tables']['saved_venues']['Row'], 'id' | 'saved_date'>;
        Update: Partial<Database['public']['Tables']['saved_venues']['Insert']>;
      };
    };
  };
}
