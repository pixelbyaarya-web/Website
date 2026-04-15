import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password)
            return NextResponse.json({ error: "Email and password required" }, { status: 400 })

        console.log(`[Auth] Attempting login for: ${email}`)
        const supabase = await createSupabaseServerClient()
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            console.error(`[Auth] Login error for ${email}:`, error.message)
            return NextResponse.json({ error: error.message || "Invalid credentials" }, { status: 401 })
        }

        console.log(`[Auth] Login successful for: ${email}`)
        return NextResponse.json({ user: data.user })
    } catch (err: any) {
        console.error(`[Auth] Unexpected login error:`, err)
        return NextResponse.json({ error: "An internal error occurred" }, { status: 500 })
    }
}