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

export interface Citizen {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  document_link: { title: string; url: string }[];
  active: boolean;
  nic: string;
  role: string;
}

export interface ReservedUser {
  citizen: Citizen;
  citizen_nic: string;
  reference_id: number;
  slot_id: number;
}
