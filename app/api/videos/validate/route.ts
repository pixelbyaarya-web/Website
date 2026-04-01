import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

/**
 * POST /api/videos/validate
 * Validate uploaded video metadata
 * Returns validation status and any errors
 */
export async function POST(req: NextRequest) {
  // Verify user is authenticated
  const authClient = await createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const { fileId, url, fileName, fileSize } = await req.json()

  // Validate required fields
  if (!fileId || !url) {
    return NextResponse.json(
      { error: "Missing fileId or url" },
      { status: 400 }
    )
  }

  // Validate file size
  const MAX_VIDEO_SIZE = 500 * 1024 * 1024
  if (fileSize && fileSize > MAX_VIDEO_SIZE) {
    return NextResponse.json(
      {
        error: `File too large. Maximum is 500MB`,
        valid: false,
      },
      { status: 400 }
    )
  }

  // Return validation success
  return NextResponse.json({
    valid: true,
    fileId,
    url,
    fileName,
    fileSize,
  })
}
