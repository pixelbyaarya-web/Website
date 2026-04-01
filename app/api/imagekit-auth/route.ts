import { imagekit } from "@/lib/imagekit"
import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function GET() {
    // Only allow authenticated users to get an ImageKit token
    const authClient = await createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 })

    // Use ImageKit SDK to get signature, token, and expiry
    const authParams = imagekit.getAuthenticationParameters()
    return NextResponse.json(authParams)
}
