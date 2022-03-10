import { UUID } from 'dsek-shared';

export interface Song {
    id: UUID;
    title: string;
    lyrics: string;
    melody: string;
    created_at: Date;
    updated_at: Date;
    category_slug: string;
}

export interface SongWithCategory {
    id: UUID;
    stitle: string;
    lyrics: string;
    melody: string;
    created_at: Date;
    updated_at: Date;
    ctitle: string;
    slug: string;
    description: string;
}

export interface Category {
    slug: string;
    title: string;
    description?: string;
}
