import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase-server"

export async function PATCH(req: NextRequest) {
    const authClient = await createSupabaseServerClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 })

    const { items }: { items: { id: string; order: number }[] } = await req.json()
    const supabase = createSupabaseServiceClient()

    await Promise.all(
        items.map(({ id, order }) =>
            supabase.from("artworks").update({ order }).eq("id", id)
        )
    )
    return NextResponse.json({ success: true })
}