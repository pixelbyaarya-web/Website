import { imagekit } from "@/lib/imagekit"
import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function GET() {
    try {
        // Only allow authenticated users to get an ImageKit token
        const authClient = await createSupabaseServerClient()
        const { data: { user }, error: authError } = await authClient.auth.getUser()
        
        if (authError || !user) {
            console.error("[ImageKit] Auth check failed or no user:", authError?.message)
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
        }

        console.log(`[ImageKit] Generating auth params for user: ${user.email}`)
        // Use ImageKit SDK to get signature, token, and expiry
        const authParams = imagekit.getAuthenticationParameters()
        return NextResponse.json(authParams)
    } catch (err: any) {
        console.error("[ImageKit] Unexpected error in auth route:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
