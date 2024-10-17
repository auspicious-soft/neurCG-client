import { s3Client } from "@/config/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getDbImageUrl = (key: string) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${key}`
}



export const generateSignedUrl = async (file: any, userId: string) => {
    const uploadParams = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: `projects/${userId}/${file.name}`,
        ContentType: file.type,
    }
    try {
        const command = new PutObjectCommand(uploadParams)
        const signedUrl = await getSignedUrl(s3Client, command)
        return signedUrl
    } catch (error) {
        console.error("Error generating signed URL:", error);
        throw error
    }
}
