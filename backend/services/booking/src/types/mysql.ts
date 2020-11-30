import { BookingStatus } from "./graphql"

//TODO: Define how a booking request is saved in the database.
export type DbBookingRequest = {
  id: number,
  start: number,
  end: number,
  created: number,
  what: string,
  booker_id: number,
  event: string,
  status: string,
}

type DbCreate<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>
export type DbCreateBookingRequest = DbCreate<DbBookingRequest, 'start' | 'end' | 'what' | 'booker_id' | 'event', 'id' | 'created' | 'status'>

type DbUpdate<T, O extends keyof T> = Partial<Omit<T, O>>
export type DbUpdateBookingRequest = DbUpdate<DbBookingRequest, 'id' | 'created' | 'status' | 'booker_id'>

type DbUpdateStatus<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>
export type DbUpdateBookingRequestStatus = DbUpdateStatus<DbBookingRequest, 'status', 'id' | 'start' | 'end' | 'what' | 'booker_id' | 'event' | 'created'>