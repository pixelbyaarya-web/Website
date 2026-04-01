import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server"
import { uploadToImageKit, uploadVideoToImageKit } from "@/lib/imagekit"

// Allow up to 5 minutes for video uploads on Vercel / serverless
export const maxDuration = 300

// Raise Next.js body-parser limit to 200 MB for video files
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "200mb",
        },
    },
}

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
    const imageFile = formData.get("image") as File | null
    const videoFile = formData.get("video") as File | null

    if (!title || !category)
        return NextResponse.json({ error: "Title and category required" }, { status: 400 })

    let image_url: string | null = null
    let imagekit_file_id: string | null = null
    let video_url: string | null = null
    let video_filekit_id: string | null = null
    let media_type: "image" | "video" = "image"

    if (videoFile && videoFile.size > 0) {
        const buffer = Buffer.from(await videoFile.arrayBuffer())
        const result = await uploadVideoToImageKit(buffer, videoFile.name)
        video_url = result.url
        video_filekit_id = result.fileId
        media_type = "video"
    }

    if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        const result = await uploadToImageKit(buffer, imageFile.name)
        image_url = result.url
        imagekit_file_id = result.fileId
        if (media_type !== "video") media_type = "image"
    }

    const supabase = createSupabaseServiceClient()
    const { data, error } = await supabase
        .from("artworks")
        .insert({
            title, category, description, tags, process_steps: processSteps,
            image_url, imagekit_file_id, video_url, video_filekit_id, media_type, order
        })
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
}