import { BookingStatus } from "./graphql"

//TODO: Define how a booking request is saved in the database.
export type DbBookingRequest = {
  id: number,
  start : number,
  end: number;
  created: number;
  what: string;
  member_id: number;
  event: string;
  status: string;
}

type DbCreate<T, O extends keyof T> = Partial<Omit<T, O>>
export type DbCreateBookingRequest = DbCreate<DbBookingRequest, 'id'>

type DbUpdate<T, O extends keyof T> = Partial<Omit<T, O>>
export type DbUpdateBookingRequest = DbUpdate<DbBookingRequest, 'id'>