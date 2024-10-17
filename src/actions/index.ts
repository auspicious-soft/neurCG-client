'use server'

import { signIn, signOut } from "@/auth"
import { s3Client } from "@/config/s3"
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

// Get file from S3
export const getImageUrl = async (dbImageKey: string) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${dbImageKey}`,
    };

    const command = new GetObjectCommand(params)
    
    const url = await getSignedUrl(s3Client, command
        // , { expiresIn: 3600 }
    ); // URL valid for 1 hour
    return url;
}