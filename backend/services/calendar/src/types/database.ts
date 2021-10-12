export type Event = {
  id: number;
  title: string;
  title_en?: string;
  location: string;
  organizer: string;
  author_id: number;
  description: string;
  description_en?: string;
  short_description: string;
  short_description_en?: string;
  link: string;
  start_datetime: string;
  end_datetime: string;
};

export type Keycloak = {
  keycloak_id: string;
  member_id: number;
};
