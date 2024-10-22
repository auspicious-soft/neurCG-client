'use server'

import { signIn, signOut } from "@/auth"
import { createS3Client } from "@/config/s3"
// import { s3Client } from "@/config/s3"
import { loginService, signupService } from "@/services/user-service"
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { cookies } from "next/headers"

export const loginAction = async (payload: any) => {
    try {
        const res: any = await loginService(payload)
        if (res.data.success) {
            await signIn('credentials', {
                email: payload.email,
                password: payload.password,
                name: res.data.data.firstName + ' ' + res.data.data.lastName,
                _id: res.data.data._id,
                myReferralCode: res.data.data.myReferralCode,
                profilePic: res.data.data.profilePic,
                redirect: false,
            },
            )
        }
        return res.data
    } catch (error: any) {
        return error.response.data
    }
}

export const signupAction = async (payload: any) => {
    try {
        const res: any = await signupService(payload);
        return res.data;
    } catch (error: any) {
        return error.response.data;
    }
}


export const logoutAction = async () => {
    try {
        await signOut()
    } catch (error: any) {
        return error.response.data
    }
}

export const getTokenCustom = async () => {
    const cookiesOfNextAuth = cookies().get("authjs.session-token")
    return cookiesOfNextAuth?.value!
}

// Get an image url from S3 but presigned
export const getImageUrl = async (imageKey: string) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
    }
    try {
        const command = new GetObjectCommand(params)
        const url = await getSignedUrl(await createS3Client(), command
            // , { expiresIn: 3600 }
        )
        return url;
    } catch (error) {
        throw error
    }
}

// Generate a signed URL to upload a file to S3 presigned
export const generateSignedUrlToUploadOn = async (fileName: string, fileType: string, userEmail: string) => {
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `projects/${userEmail}/my-media/${fileName}`,
        ContentType: fileType
    }
    try {
        const command = new PutObjectCommand(uploadParams)
        const signedUrl = await getSignedUrl(await createS3Client(), command)
        return signedUrl
    } catch (error) {
        console.error("Error generating signed URL:", error);
        throw error
    }
}