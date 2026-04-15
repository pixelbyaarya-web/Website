import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server"
import { uploadToImageKit, uploadVideoToImageKit, deleteFromImageKit } from "@/lib/imagekit"

export const maxDuration = 300
// Body size limit configurations are deprecated in App Router.

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authClient = await createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 })

    const { id } = await params
    const formData = await req.formData()
    const supabase = createSupabaseServiceClient()

    const { data: existing } = await supabase
        .from("artworks").select("image_file_ids, video_filekit_id").eq("id", id).single()

    const updates: Record<string, unknown> = {}
    if (formData.has("title")) updates.title = formData.get("title")
    if (formData.has("category")) updates.category = formData.get("category")
    if (formData.has("description")) updates.description = formData.get("description")
    if (formData.has("tags")) updates.tags = JSON.parse(formData.get("tags") as string)
    if (formData.has("process_steps")) updates.process_steps = JSON.parse(formData.get("process_steps") as string)
    if (formData.has("order")) updates.order = parseInt(formData.get("order") as string)
    if (formData.has("media_type")) updates.media_type = formData.get("media_type")

    // Handle Image Updates
    if (formData.has("image_file_ids")) {
        const newFileIds = JSON.parse(formData.get("image_file_ids") as string) as string[]
        const oldFileIds = existing?.image_file_ids || []
        
        // Find deleted images
        const deletedIds = (oldFileIds as string[]).filter((id: string) => !newFileIds.includes(id))
        for (const fileId of deletedIds) {
            try { await deleteFromImageKit(fileId) } catch (err) { console.error(`Failed to delete image ${fileId}:`, err) }
        }

        updates.image_file_ids = newFileIds
        updates.image_urls = JSON.parse(formData.get("image_urls") as string) as string[]
        
        // Sync primary image_url/id
        updates.image_url = (updates.image_urls as string[])[0] || null
        updates.imagekit_file_id = (updates.image_file_ids as string[])[0] || null
    }

    // Add new images
    const imageFiles = formData.getAll("images") as File[]
    if (imageFiles.length > 0) {
        let currentUrls = (updates.image_urls as string[]) || existing?.image_urls || []
        let currentIds = (updates.image_file_ids as string[]) || existing?.image_file_ids || []

        for (const file of imageFiles) {
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer())
                const result = await uploadToImageKit(buffer, file.name)
                currentUrls.push(result.url)
                currentIds.push(result.fileId)
            }
        }

        updates.image_urls = currentUrls
        updates.image_file_ids = currentIds
        updates.image_url = currentUrls[0] || null
        updates.imagekit_file_id = currentIds[0] || null
    }

    // Replace video (Client-side upload)
    if (formData.has("video_url")) {
        if (existing?.video_filekit_id) {
            try { await deleteFromImageKit(existing.video_filekit_id) } catch { }
        }
        updates.video_url = formData.get("video_url")
        updates.video_filekit_id = formData.get("video_filekit_id")
        updates.media_type = "video"
    }
    
    // Handle video deletion
    if (formData.has("remove_video_filekit_id")) {
        const removeVideoFileId = formData.get("remove_video_filekit_id") as string
        if (removeVideoFileId && existing?.video_filekit_id) {
            try { await deleteFromImageKit(removeVideoFileId) } catch { }
        }
        updates.video_url = null
        updates.video_filekit_id = null
        updates.media_type = "image"
    }

    const { data, error } = await supabase
        .from("artworks").update(updates).eq("id", id).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authClient = await createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 })

    const { id } = await params
    const supabase = createSupabaseServiceClient()

    const { data: artwork } = await supabase
        .from("artworks").select("image_file_ids, video_filekit_id").eq("id", id).single()

    if (artwork?.image_file_ids) {
        for (const fileId of artwork.image_file_ids) {
            try { await deleteFromImageKit(fileId) } catch { }
        }
    }
    if (artwork?.video_filekit_id) {
        try { await deleteFromImageKit(artwork.video_filekit_id) } catch { }
    }

    const { error } = await supabase.from("artworks").delete().eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}