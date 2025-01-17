'use server'
import { TwitterApi } from 'twitter-api-v2';
import axios from 'axios';
import { signIn, signOut } from "@/auth"
import { createS3Client } from "@/config/s3"
import { loginService, signupService } from "@/services/user-service"
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { cookies } from "next/headers"

export const handleGoogleLogin = async () => {
    await signIn('google')
}

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
        return error?.response?.data
    }
}

export const signupAction = async (payload: any) => {
    try {
        const res: any = await signupService(payload);
        return res.data;
    } catch (error: any) {
        return error?.response?.data;
    }
}


export const logoutAction = async () => {
    try {
        await signOut()
    } catch (error: any) {
        return error?.response?.data
    }
}

export const getTokenCustom = async () => {
    const cookiesOfNextAuth = cookies().get(process.env.JWT_SALT as string)
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

export const deleteImageFromS3 = async (imageKey: string) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey
    }

    try {
        const command = new DeleteObjectCommand(params)
        await (await createS3Client()).send(command)
        console.log(`Successfully deleted ${imageKey} from S3`)
    } catch (error) {
        console.error("Error deleting image from S3:", error)
        throw error
    }
}



interface ShareResponse {
  success: boolean;
  postId?: string;
  error?: string;
}

export async function shareToFacebook(
  mediaFile: File,
  title: string
): Promise<ShareResponse> {
  try {
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

    // Convert File to Buffer
    const arrayBuffer = await mediaFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create FormData for Facebook API
    const formData = new FormData();
    formData.append('source', new Blob([buffer]), mediaFile.name);

    // Upload media to Facebook
    const uploadResponse = await axios.post(
      `https://graph.facebook.com/v18.0/me/photos`, // Use 'me/videos' for video
      formData,
      {
        params: {
          access_token: accessToken,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const mediaId = uploadResponse.data.id;

    // Create post with the uploaded media
    const postResponse = await axios.post(
      `https://graph.facebook.com/v18.0/me/feed`,
      null,
      {
        params: {
          message: title,
          attached_media: [{ media_fbid: mediaId }],
          access_token: accessToken,
        },
      }
    );

    return {
      success: true,
      postId: postResponse.data.id
    };

  } catch (error: any) {
    console.error('Facebook sharing error:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
}

export async function shareToTwitter(
  mediaFile: File,
  title: string
): Promise<ShareResponse> {
  try {
    // Initialize Twitter client
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    // Convert File to Buffer
    const arrayBuffer = await mediaFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload media to Twitter
    const mediaId = await client.v1.uploadMedia(buffer, {
      mimeType: mediaFile.type,
    });

    // Create tweet with media
    const tweet = await client.v2.tweet({
      text: title,
      media: {
        media_ids: [mediaId]
      }
    });

    return {
      success: true,
      postId: tweet.data.id
    };

  } catch (error: any) {
    console.error('Twitter sharing error:', error);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
}