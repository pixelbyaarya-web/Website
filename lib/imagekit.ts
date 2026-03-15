import ImageKit from "imagekit"

export const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

export async function uploadToImageKit(
    file: Buffer,
    fileName: string,
    folder = "/artworks"
): Promise<{ url: string; fileId: string }> {
    const result = await imagekit.upload({
        file,
        fileName,
        folder,
        useUniqueFileName: true,
    })
    return { url: result.url, fileId: result.fileId }
}

export async function deleteFromImageKit(fileId: string) {
    await imagekit.deleteFile(fileId)
}