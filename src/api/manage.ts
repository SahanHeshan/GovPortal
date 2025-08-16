import { api } from "@/api/index";
import type {  TimeSlot } from "@/api/interfaces";

//api3
export const serviceSlots = (
  reservation_id: number,
  reservation_date: string
) =>
  api.get(
    `/api/v1/appointments/available_slots/${reservation_id}/${reservation_date}`
  );

//api4 - Get available slots by category ID (reservation ID)
export const getAvailableSlots = (reservation_id: number) =>
  api.get<TimeSlot[]>(`/api/v1/appointments/available_slots/${reservation_id}`);

//api5 - Create a new time slot
export const createTimeSlot = (payload: {
  booking_date: string;
  end_time: string;
  max_capacity: number;
  recurrent_count: number;
  reservation_id: number;
  reserved_count: number;
  start_time: string;
  status: string;
}) => {
  console.log("Creating time slot with payload:", payload);
  return api.post<TimeSlot>("/api/v1/appointments/create_slot", payload, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

//api6 - Get a specific time slot
export const getTimeSlot = (slot_id: number) =>
  api.get<TimeSlot>(`/api/v1/appointments/slot/${slot_id}`);

//api7 - Update a time slot
export const updateTimeSlot = (slot_id: number, payload: {
  booking_date: string;
  end_time: string;
  max_capacity: number;
  reserved_count: number;
  start_time: string;
  status: string;
}) =>
  api.put<TimeSlot>(`/api/v1/appointments/slot/${slot_id}`, payload, {
    headers: {
      "Content-Type": "application/json"
    }
  });

//api8 - Delete a time slot
export const deleteTimeSlot = (slot_id: number) =>
  api.delete(`/api/v1/appointments/slot/${slot_id}`);