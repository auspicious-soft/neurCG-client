
export const getDbImageUrl = (key: string) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${key}`
}




// export const generateSignedUrlToUploadOn = async (fileName: string, fileType: string, userId: string) => {
//     const uploadParams = {
//         Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
//         Key: `projects/${userId}/${fileName}`,
//         ContentType: fileType,
//     }
//     try {
//         const command = new PutObjectCommand(uploadParams)
//         const signedUrl = await getSignedUrl(s3Client, command)
//         return signedUrl
//     } catch (error) {
//         console.error("Error generating signed URL:", error);
//         throw error
//     }
// }