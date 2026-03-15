import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    if (!email || !password)
        return NextResponse.json({ error: "Email and password required" }, { status: 400 })

    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error)
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

    return NextResponse.json({ user: data.user })
}