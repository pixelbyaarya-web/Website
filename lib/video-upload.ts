/**
 * Video upload utilities with validation, error handling, and progress tracking
 */

/** Maximum video file size: 500MB */
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024

/** Supported video formats */
export const SUPPORTED_VIDEO_FORMATS = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
]

/** Video extensions (uppercase) */
export const SUPPORTED_VIDEO_EXTENSIONS = [".MP4", ".WEBM", ".MOV", ".AVI", ".MKV"]

export interface VideoUploadError {
  code: string
  message: string
}

/**
 * Validate video file before upload
 */
export function validateVideoFile(file: File): VideoUploadError | null {
  // Check file size
  if (file.size > MAX_VIDEO_SIZE) {
    return {
      code: "FILE_TOO_LARGE",
      message: `Video file too large. Maximum size is 500MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
    }
  }

  // Check file type
  if (!SUPPORTED_VIDEO_FORMATS.includes(file.type)) {
    return {
      code: "UNSUPPORTED_FORMAT",
      message: `Unsupported video format. Supported formats: MP4, WebM, MOV, AVI, MKV. Your file: ${file.type || "unknown"}`,
    }
  }

  // Check file extension for additional validation
  const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toUpperCase()
  if (!SUPPORTED_VIDEO_EXTENSIONS.includes(fileExtension)) {
    return {
      code: "UNSUPPORTED_EXTENSION",
      message: `Unsupported video extension: ${fileExtension}. Supported: MP4, WebM, MOV, AVI, MKV`,
    }
  }

  return null
}

/**
 * Upload video to ImageKit directly from browser
 */
export async function uploadVideoToImageKit(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; fileId: string }> {
  // Validate file first
  const error = validateVideoFile(file)
  if (error) {
    throw new Error(error.message)
  }

  // Get ImageKit auth parameters
  const authRes = await fetch("/api/imagekit-auth")
  if (!authRes.ok) {
    throw new Error("Failed to get ImageKit authentication parameters")
  }
  const authData = await authRes.json()

  // Get public key from environment
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
  if (!publicKey) {
    throw new Error("ImageKit public key is not configured. Please set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY environment variable.")
  }

  // Prepare FormData for upload
  const formData = new FormData()
  formData.append("file", file)
  formData.append("fileName", file.name)
  formData.append("publicKey", publicKey)
  formData.append("signature", authData.signature)
  formData.append("expire", authData.expire)
  formData.append("token", authData.token)
  formData.append("folder", "/artworks/videos")
  formData.append("useUniqueFileName", "true")

  // Create XMLHttpRequest to track upload progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          onProgress(percentComplete)
        }
      })
    }

    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText)
          if (result.url && result.fileId) {
            resolve({ url: result.url, fileId: result.fileId })
          } else {
            reject(new Error("Invalid upload response: missing url or fileId"))
          }
        } catch (e) {
          reject(new Error("Failed to parse upload response"))
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText)
          reject(new Error(errorData.message || `Upload failed with status ${xhr.status}`))
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }
    })

    // Handle errors
    xhr.addEventListener("error", () => {
      reject(new Error("Network error during video upload"))
    })

    xhr.addEventListener("abort", () => {
      reject(new Error("Video upload was cancelled"))
    })

    // Send request
    xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload")
    xhr.send(formData)
  })
}

/**
 * Upload image to ImageKit (reused from existing function)
 */
export async function uploadImageToImageKit(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; fileId: string }> {
  // Get ImageKit auth parameters
  const authRes = await fetch("/api/imagekit-auth")
  if (!authRes.ok) {
    throw new Error("Failed to get ImageKit authentication parameters")
  }
  const authData = await authRes.json()

  // Get public key from environment
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
  if (!publicKey) {
    throw new Error("ImageKit public key is not configured. Please set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY environment variable.")
  }

  // Prepare FormData for upload
  const formData = new FormData()
  formData.append("file", file)
  formData.append("fileName", file.name)
  formData.append("publicKey", publicKey)
  formData.append("signature", authData.signature)
  formData.append("expire", authData.expire)
  formData.append("token", authData.token)
  formData.append("folder", "/artworks/images")
  formData.append("useUniqueFileName", "true")

  // Create XMLHttpRequest to track upload progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          onProgress(percentComplete)
        }
      })
    }

    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText)
          if (result.url && result.fileId) {
            resolve({ url: result.url, fileId: result.fileId })
          } else {
            reject(new Error("Invalid upload response: missing url or fileId"))
          }
        } catch (e) {
          reject(new Error("Failed to parse upload response"))
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText)
          reject(new Error(errorData.message || `Upload failed with status ${xhr.status}`))
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }
    })

    // Handle errors
    xhr.addEventListener("error", () => {
      reject(new Error("Network error during image upload"))
    })

    xhr.addEventListener("abort", () => {
      reject(new Error("Image upload was cancelled"))
    })

    // Send request
    xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload")
    xhr.send(formData)
  })
}

/**
 * Convert file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

/**
 * Get video duration in seconds from a File object
 */
export async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    const objectUrl = URL.createObjectURL(file)

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(video.duration)
    }

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("Failed to load video metadata"))
    }

    video.src = objectUrl
  })
}

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

/**
 * Delete a video from ImageKit by fileId
 */
export async function deleteVideoFromImageKit(fileId: string): Promise<void> {
  if (!fileId) {
    throw new Error("FileId is required to delete a video")
  }

  try {
    const res = await fetch("/api/videos/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileId }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || "Failed to delete video from ImageKit")
    }
  } catch (err: any) {
    throw new Error(err.message || "Failed to delete video from ImageKit")
  }
}
