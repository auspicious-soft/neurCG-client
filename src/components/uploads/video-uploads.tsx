'use client'
import { getAvatarsUsedFromFlask, getMediaUrlFromFlaskProxy } from '@/utils'
import React, { useEffect } from 'react'
import VideoCards from '../VideoCards'

interface VideoUploadsProps {
    data: any
}

const VideoUploads = (props: VideoUploadsProps) => {
    const { data } = props
    const [projectImages, setProjectImages] = React.useState<any>([])
    const [projectVideoLink, setProjectVideoLink] = React.useState<any>([])

    useEffect(() => {
        const fetchProjectImages = async () => {
            if (Array.isArray(props?.data)) {
                const imagesPromise = props.data.map(async (project: any) => {
                    const imageUrl = await getAvatarsUsedFromFlask(project.projectAvatar)
                    return { projectId: project._id, imageUrl }
                })
                const imageResultsArrayOfObjects = await Promise.all(imagesPromise);
                const imageResults = imageResultsArrayOfObjects.reduce((acc: any, curr: any) => {
                    acc[curr.projectId] = curr.imageUrl;
                    return acc;
                }, {})
                setProjectImages(imageResults)
            }
        }

        const fetchProjectVideoLink = async () => {
            if (Array.isArray(props?.data)) {
                const videoPromises = props.data.map(async (project: any) => {
                    const videoUrl = await getMediaUrlFromFlaskProxy(project?.projectVideoLink);
                    return { projectId: project._id, videoUrl }
                })
                const videoResultsArrayOfObjects = await Promise?.all(videoPromises);
                const videoResults = videoResultsArrayOfObjects.reduce((acc: any, curr: any) => {
                    acc[curr.projectId] = curr.videoUrl;
                    return acc;
                }, {})
                setProjectVideoLink(videoResults);
            }
        }

        fetchProjectVideoLink()
        fetchProjectImages()
    }, [props, props?.data])
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {data?.map((data: any) => (
                <VideoCards
                    isDeletable={false}
                    key={data._id}
                    title={data.projectName}
                    thumbnail={projectImages[data._id]}
                    videoSrc={projectVideoLink[data._id]}
                    id={data._id}
                />
            ))}
        </div>
    )
}

export default VideoUploads