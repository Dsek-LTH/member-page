import { UUID } from '~/src/shared';

/**
 * A custom author represents a group or entity of which some members can post as.
 */
export interface CustomAuthor {
  id: UUID,
  name: string,
  name_en?: string,
  image_url?: string,
  created_at: Date,
  updated_at: Date,
}

export interface Author {
  id: UUID,
  member_id: UUID,
  mandate_id?: UUID,
  custom_id?: UUID,
  type: 'Member' | 'Mandate' | 'Custom',
  created_at: Date,
  updated_at: Date,
}
