import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server"
import { uploadToImageKit, uploadVideoToImageKit } from "@/lib/imagekit"

// Allow up to 5 minutes for video uploads on Vercel / serverless
export const maxDuration = 300

// Raise Next.js body-parser limit isn't done via export const config in App Router.
// For large files (videos), we handle it by uploading directly from the client.

export async function GET() {
    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .order("order", { ascending: true })
        .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
    const authClient = await createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 })

    const formData = await req.formData()
    const title = formData.get("title") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const tags = JSON.parse(formData.get("tags") as string || "[]")
    const processSteps = JSON.parse(formData.get("process_steps") as string || "[]")
    const order = parseInt(formData.get("order") as string || "0")
    const imageFiles = formData.getAll("images") as File[]
    
    console.log(`[Artworks] POST received: title="${title}", category="${category}", imagesCount=${imageFiles.length}`)

    if (!title || !category) {
        console.error(`[Artworks] Validation failed: title or category missing`)
        return NextResponse.json({ error: "Title and category required" }, { status: 400 })
    }

    let image_urls: string[] = []
    let image_file_ids: string[] = []
    let video_url: string | null = null
    let video_filekit_id: string | null = null
    let media_type: "image" | "video" = "image"

    // If client already uploaded video
    if (formData.has("video_url")) {
        video_url = formData.get("video_url") as string
        video_filekit_id = formData.get("video_filekit_id") as string
        media_type = "video"
    }

    // Handle multiple image uploads
    for (const file of imageFiles) {
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer())
            const result = await uploadToImageKit(buffer, file.name)
            image_urls.push(result.url)
            image_file_ids.push(result.fileId)
        }
    }

    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase
        .from("artworks")
        .insert({
            title, category, description, tags, process_steps: processSteps,
            image_url: image_urls[0] || null, 
            imagekit_file_id: image_file_ids[0] || null,
            image_urls,
            image_file_ids,
            video_url, video_filekit_id, media_type, order
        })
        .select()
        .single()

    if (error) {
        console.error("Supabase insert error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
}