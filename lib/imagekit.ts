import ImageKit from "imagekit"

export const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

/** Upload an image to ImageKit (default folder: /artworks/images) */
export async function uploadToImageKit(
    file: Buffer,
    fileName: string,
    folder = "/artworks/images"
): Promise<{ url: string; fileId: string }> {
    const result = await imagekit.upload({
        file,
        fileName,
        folder,
        useUniqueFileName: true,
        // 2-minute timeout for images
        responseFields: ["url", "fileId"],
    })
    return { url: result.url, fileId: result.fileId }
}

/**
 * Upload a video to ImageKit — targets /artworks/videos.
 * Uses a higher effective timeout via chunked streaming handled
 * by the imagekit SDK; the caller should ensure the route's
 * maxDuration is set to at least 300s (see route config).
 */
export async function uploadVideoToImageKit(
    file: Buffer,
    fileName: string,
    folder = "/artworks/videos"
): Promise<{ url: string; fileId: string }> {
    const result = await imagekit.upload({
        file,
        fileName,
        folder,
        useUniqueFileName: true,
        responseFields: ["url", "fileId"],
        // Extensions can carry extra metadata; keep it minimal for videos
        extensions: [],
    })
    return { url: result.url, fileId: result.fileId }
}

export async function deleteFromImageKit(fileId: string) {
    await imagekit.deleteFile(fileId)
}