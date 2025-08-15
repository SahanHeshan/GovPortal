import { api } from "@/api/index";
import type { LoginRequest, LoginResponse } from "@/api/interfaces";

//api 1
export const loginGov = (payload: LoginRequest) =>
  api.post<LoginResponse>(
    "/api/v1/gov/login",
    new URLSearchParams({
      grant_type: "password",
      username: payload.username,
      password: payload.password,
    })
  );

//api 2
export const getGovServices = () => api.get("/api/v1/gov/services/");
