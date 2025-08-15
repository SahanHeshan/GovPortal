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
