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
export interface DocumentLink {
  title: string;
  uploaded_at: string;
  url: string;
}

export interface Citizen {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  document_links: DocumentLink[];
  active: boolean;
  nic: string;
  role: string;
  created_at: string;
}

export interface ActivateUserResponse {
  message: string;
}

export interface ReservedUser {
  citizen: Citizen;
  citizen_nic: string;
  reference_id: number;
  slot_id: number;
}
