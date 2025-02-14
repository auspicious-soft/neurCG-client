import { getAxiosInstance } from "./axios"
import profilePic from "@/assets/images/logo.png";

export const getDbImageUrl = (key: string) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${key}`
}


export const getImageUrlOfS3 = (subPath: string): string => {
    const path = `${process.env.NEXT_PUBLIC_AWS_BUCKET_PATH}${subPath}`
    return path
}

export const getMediaUrlFromFlaskProxy = async (subpath: string): Promise<string | undefined> => {
    try {
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.post(`/file`, { subpath }, {
            responseType: 'arraybuffer'
        })

        // Convert the arraybuffer to a Blob 
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        return URL.createObjectURL(blob);
    } catch (error) {
        return undefined;
    }
}

export const postMediaToFlaskProxy = async (file: File, subpath: string) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subpath', subpath);
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.post(`/file/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'json'
        })
        return response.data;
    } catch (error) {
        console.error('Error posting media to flask:', error);
        return undefined;
    }
}

export const deleteMediaFromFlaskProxy = async (subpath: string) => {
    try {
        const axiosInstance = await getAxiosInstance();
        const response = await axiosInstance.delete(`/file/remove`, { data: { subpath } });
        return response.data;
    } catch (error) {
        console.error('Error deleting media from flask:', error);
        return undefined;
    }
}

export const getImage = async (data: any) => {
    return data?.profilePic?.includes('lh3.googleusercontent.com') ? data?.profilePic : data?.profilePic ? await getMediaUrlFromFlaskProxy(data?.profilePic) : profilePic
}

export const getAvatarsUsedFromFlask = async (avatar: any) => {
    return avatar ? await getMediaUrlFromFlaskProxy(avatar) : profilePic
}


export const getFileNameAndExtension = (file: File) => {
    const lastDotIndex = file.name.lastIndexOf('.');
    const fileName = file.name.substring(0, lastDotIndex);
    const fileExtension = file.name.substring(lastDotIndex + 1);
    return { fileName, fileExtension };
}

export const containsMyMedia = (project: any) => {
    return ['projectAvatar', 'preferredVoice', 'audio', 'video'].some(key => project[key]?.includes('my-media'))
}

export const containsMyImages = (project: any) => {
    return ['jpg', 'png', 'jpeg', 'gif', 'bmp', 'svg', 'webp', 'tiff', 'ico', 'heic'].some(ext => project?.projectAvatar?.includes(ext) && project?.projectAvatar?.includes('my-media'))
}

export const containsMyAudio = (project: any) => {  
    return ['mp3', 'wav', 'ogg'].some(ext => project?.audio?.includes(ext) && project?.audio?.includes('my-media'))
}

export const containsMyVideos = (project: any) => {
    return ['mp4', 'webm', 'mkv', 'avi', 'mov'].some(ext => project?.video?.includes(ext) && project?.video?.includes('my-media'))
}