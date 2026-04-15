export interface Artwork {
    id: string
    title: string
    category: string
    description: string | null
    tags: string[]
    process_steps: string[]
    image_url: string | null
    imagekit_file_id: string | null
    image_urls: string[]
    image_file_ids: string[]
    video_url: string | null
    video_filekit_id: string | null
    media_type: "image" | "video"
    order: number
    created_at: string
}

export type ArtworkInsert = Omit<Artwork, "id" | "created_at">
export type ArtworkUpdate = Partial<ArtworkInsert>