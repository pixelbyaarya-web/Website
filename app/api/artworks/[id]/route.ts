import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server"
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authClient = await createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 })

    const { id } = await params
    const formData = await req.formData()
    const supabase = createSupabaseServiceClient()

    const { data: existing } = await supabase
        .from("artworks").select("imagekit_file_id, video_filekit_id").eq("id", id).single()

    const updates: Record<string, unknown> = {}
    if (formData.has("title")) updates.title = formData.get("title")
    if (formData.has("category")) updates.category = formData.get("category")
    if (formData.has("description")) updates.description = formData.get("description")
    if (formData.has("tags")) updates.tags = JSON.parse(formData.get("tags") as string)
    if (formData.has("process_steps")) updates.process_steps = JSON.parse(formData.get("process_steps") as string)
    if (formData.has("order")) updates.order = parseInt(formData.get("order") as string)

    // Replace image
    const imageFile = formData.get("image") as File | null
    if (imageFile && imageFile.size > 0) {
        if (existing?.imagekit_file_id) {
            try { await deleteFromImageKit(existing.imagekit_file_id) } catch { }
        }
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        const result = await uploadToImageKit(buffer, imageFile.name, "/artworks/images")
        updates.image_url = result.url
        updates.imagekit_file_id = result.fileId
    }

    // Replace video
    const videoFile = formData.get("video") as File | null
    if (videoFile && videoFile.size > 0) {
        if (existing?.video_filekit_id) {
            try { await deleteFromImageKit(existing.video_filekit_id) } catch { }
        }
        const buffer = Buffer.from(await videoFile.arrayBuffer())
        const result = await uploadToImageKit(buffer, videoFile.name, "/artworks/videos")
        updates.video_url = result.url
        updates.video_filekit_id = result.fileId
        updates.media_type = "video"
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
        .from("artworks").select("imagekit_file_id, video_filekit_id").eq("id", id).single()

    if (artwork?.imagekit_file_id) {
        try { await deleteFromImageKit(artwork.imagekit_file_id) } catch { }
    }
    if (artwork?.video_filekit_id) {
        try { await deleteFromImageKit(artwork.video_filekit_id) } catch { }
    }

    const { error } = await supabase.from("artworks").delete().eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}