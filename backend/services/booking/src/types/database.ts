export type BookingRequest = {
  id: number,
  start: Date,
  end: Date,
  created: Date,
  what: string,
  booker_id: number,
  event: string,
  status: string,
}

type Create<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>
export type CreateBookingRequest = Create<BookingRequest, 'start' | 'end' | 'what' | 'booker_id' | 'event', 'id' | 'created' | 'status'>

type Update<T, O extends keyof T> = Partial<Omit<T, O>>
export type UpdateBookingRequest = Update<BookingRequest, 'id' | 'created' | 'status' | 'booker_id'>

type UpdateStatus<T, N extends keyof T, O extends keyof T> = Pick<T, N> & Partial<Omit<T, O>>
export type UpdateBookingRequestStatus = UpdateStatus<BookingRequest, 'status', 'id' | 'start' | 'end' | 'what' | 'booker_id' | 'event' | 'created'>