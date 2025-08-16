export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  name_en?: string;
  name_si?: string;
  name_ta?: string;
  role?: string;
  email?: string;
  location?: string;
  category_id?: number;
  created_at?: string;
  description_en?: string;
  description_si?: string;
  description_ta?: string;
  access_token: string;
  token_type: string;
}

export interface TimeSlot {
  slot_id: number;
  reservation_id: number;
  start_time: string;
  end_time: string;
  max_capacity: number;
  reserved_count: number;
  status: string;
  booking_date: string;
  recurrent_count: number;
}
export interface Citizen {
  id: number;
  nic: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  active: boolean;
  document_links: { title: string; url: string; uploaded_at: string }[];
  created_at?: string;
}

export interface ReservedUser {
  citizen: Citizen;
  citizen_nic: string;
  reference_id: number;
  slot_id: number;
}

// Analytics
export interface MostReservedSlotItem {
  booking_date: string;
  max_reserved: number;
  start_time: string;
}

export interface PercentageChangeResponse {
  percentage_change: number;
}

export interface TodayCountResponse {
  today_count: number;
}

export interface OverallSatisfactionItem {
  category_en: string;
  avg_rating: number;
}
