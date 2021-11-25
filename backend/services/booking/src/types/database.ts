import { UUID } from 'dsek-shared';

export type Bookable = {
  id: UUID,
  name: string,
  name_en: string,
}

export type BookingBookables = {
  id: UUID,
  booking_request_id: UUID,
  bookable_id: UUID,
}

export type BookingRequest = {
  id: UUID,
  start: Date,
  end: Date,
  created: Date,
  booker_id: UUID,
  what: Bookable[],
  event: string,
  status: string,
}

type Create<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>
export type CreateBookingRequest = Create<BookingRequest, 'start' | 'end' | 'booker_id' | 'event', 'id' | 'created'>
export type CreateBookable = Create<Bookable, never, 'id'>

type Update<T, O extends keyof T> = Partial<Omit<T, O>>
export type UpdateBookingRequest = Update<BookingRequest, 'id' | 'created' | 'status' | 'booker_id'>

type UpdateStatus<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>
export type UpdateBookingRequestStatus = UpdateStatus<BookingRequest, 'status', 'id' | 'start' | 'end' | 'booker_id' | 'event' | 'created'>