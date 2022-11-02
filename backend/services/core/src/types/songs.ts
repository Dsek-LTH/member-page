import { UUID } from '../shared';

export type Song = {
  id: UUID,
  title: string,
  lyrics: string,
  melody: string,
  category: string,
  created_at: Date,
  updated_at: Date,
}
