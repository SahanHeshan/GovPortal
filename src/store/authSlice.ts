import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: number;
    username: string;
    officeId: string;
    officeName: string;
    role?: string;
    email?: string;
    location?: string;
    category_id?: number;
    created_at?: string;
    name_en?: string;
    name_si?: string;
    name_ta?: string;
    description_en?: string;
    description_si?: string;
    description_ta?: string;
  } | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        id: number;
        username: string;
        officeId: string;
        officeName: string;
        role?: string;
        email?: string;
        location?: string;
        category_id?: number;
        created_at?: string;
        name_en?: string;
        name_si?: string;
        name_ta?: string;
        description_en?: string;
        description_si?: string;
        description_ta?: string;
      }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
