import { UUID } from 'dsek-shared';

export interface Song {
    id: UUID;
    title: string;
    lyrics: string;
    melody: string;
    createdAt: Date;
    updatedAt: Date;
    category_slug: string;
}

export interface Category {
    slug: string;
    title: string;
    description?: string;
}
