
export const getDbImageUrl = (key: string) => {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${key}`
}


export const getImageUrlOfS3 = (subPath: string): string => {
    const path =  `${process.env.NEXT_PUBLIC_AWS_BUCKET_PATH}${subPath}`
    return path
}