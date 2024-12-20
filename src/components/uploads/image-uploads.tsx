'use client'
import { getAvatarsUsedFromFlask } from '@/utils'
import Image from 'next/image'
import React, { useEffect } from 'react'
import ReactLoading from 'react-loading';

interface ImageUploadsProps {
    data: any
}
const ImageUploads = (props: ImageUploadsProps) => {
    const { data } = props
    const [uploadedImages, setUploadedImages] = React.useState<any>([])
    useEffect(() => {
        const fetchUploadedImages = async () => {
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
                setUploadedImages(imageResults)
            }
        }

        fetchUploadedImages()
    }, [props, props?.data])
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-10">
            {data?.length > 0 ? data?.map((data: any, index: number) => {
                return <div key={index}>
                    {Object.keys(uploadedImages).length > 0 ?
                        <Image
                            src={uploadedImages[data._id]}
                            alt={data.projectName}
                            className={`${uploadedImages[data._id] ? 'w-20' : 'w-full'} h-auto rounded-lg`}
                            width={200}
                            height={200}
                            layout="responsive"
                        />
                        :
                        <ReactLoading type={'bars'} color={'#e87223'} height={'40px'} width={'40px'} />
                    }
                </div>
            })
                :
                <div className="text-center">No images uploaded yet</div>}
        </div>
    )
}

export default ImageUploads