export interface Artwork {
    id: string
    title: string
    category: string
    description: string | null
    tags: string[]
    process_steps: string[]
    image_url: string | null
    imagekit_file_id: string | null
    video_url: string | null
    video_filekit_id: string | null
    media_type: "image" | "video"
    order: number
    created_at: string
}

export type ArtworkInsert = Omit<Artwork, "id" | "created_at">
export type ArtworkUpdate = Partial<ArtworkInsert>