import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export const maxDuration = 300

/**
 * POST /api/videos/upload
 * Upload video directly from client (client-side upload through this endpoint for auth)
 * Returns auth parameters for direct upload to ImageKit
 */
export async function POST(req: NextRequest) {
  // Verify user is authenticated
  const authClient = await createSupabaseServerClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized - Please login first" },
      { status: 401 }
    )
  }

  // Get file metadata from request
  const { fileName, fileSize } = await req.json()

  // Validate file metadata
  if (!fileName) {
    return NextResponse.json(
      { error: "Missing fileName in request" },
      { status: 400 }
    )
  }

  // Validate file size (max 500MB)
  const MAX_VIDEO_SIZE = 500 * 1024 * 1024
  if (fileSize && fileSize > MAX_VIDEO_SIZE) {
    return NextResponse.json(
      {
        error: `File too large. Maximum size is 500MB. Your file is ${(fileSize / (1024 * 1024)).toFixed(2)}MB.`,
      },
      { status: 400 }
    )
  }

  // Get ImageKit auth parameters from the imagekit-auth endpoint
  const authRes = await fetch(
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/imagekit-auth`,
    {
      method: "GET",
      headers: {
        "Cookie": req.headers.get("cookie") || "",
      },
    }
  )

  if (!authRes.ok) {
    return NextResponse.json(
      { error: "Failed to get upload credentials" },
      { status: 500 }
    )
  }

  const authParams = await authRes.json()

  // Check that public key is configured
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
  if (!publicKey) {
    return NextResponse.json(
      { error: "ImageKit public key is not configured" },
      { status: 500 }
    )
  }

  // Return auth parameters for client-side upload
  return NextResponse.json({
    ...authParams,
    publicKey,
    uploadUrl: "https://upload.imagekit.io/api/v1/files/upload",
    folder: "/artworks/videos",
  })
}
