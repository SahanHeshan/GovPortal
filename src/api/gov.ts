import { api } from "@/api/index";
import type {
  LoginRequest,
  LoginResponse,
  Citizen,
  ReservedUser,
} from "@/api/interfaces";

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
export const getGovServices = (officeID: number) =>
  api.get(`/api/v1/gov/services/${officeID}`);

//api3
export const serviceSlots = (
  reservation_id: number,
  reservation_date: string
) =>
  api.get(
    `/api/v1/appointments/available_slots/${reservation_id}/${reservation_date}`
  );

//api4
export const getReservedUsers = (slot_id: string | number) =>
  api.get<ReservedUser[]>(
    `/api/v1/appointments/reserved_user/get_users/${slot_id}`
  );
