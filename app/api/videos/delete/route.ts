import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import { deleteFromImageKit } from "@/lib/imagekit"

/**
 * POST /api/videos/delete
 * Delete a video from ImageKit
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

  try {
    const { fileId } = await req.json()

    if (!fileId) {
      return NextResponse.json(
        { error: "Missing fileId" },
        { status: 400 }
      )
    }

    // Delete from ImageKit
    await deleteFromImageKit(fileId)

    return NextResponse.json(
      { success: true, message: "Video deleted successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error deleting video:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete video" },
      { status: 500 }
    )
  }
}
