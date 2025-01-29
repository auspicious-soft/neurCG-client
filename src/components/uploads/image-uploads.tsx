'use client'
import { deleteMyMedia, deleteProject } from '@/services/user-service';
import { getAvatarsUsedFromFlask } from '@/utils'
import { DeleteIcon } from '@/utils/svgIcons';
import Image from 'next/image'
import React, { useEffect } from 'react'
import ReactLoading from 'react-loading';
import { toast } from 'sonner';
import Modal from 'react-modal';
import deleteCross from "@/assets/images/delete.svg";
interface ImageUploadsProps {
    data: any
}
const ImageUploads = (props: ImageUploadsProps) => {
    const { data } = props
    const [uploadedImages, setUploadedImages] = React.useState<any>([])
    const [isDeleteOpen, setIsDeleteOpen] = React.useState<any>(false)
    const [deletableMediaUrl, setDeletableMediaUrl] = React.useState<any>()
    const [isPending, startTransition] = React.useTransition();
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


    const handleDelete = async () => {
        startTransition(async () => {
            const subpath = deletableMediaUrl
            try {
                const res = await deleteMyMedia(`/file/remove-my-media`, { subpath, projectType: 'projectAvatar' })
                if (res.status === 200) {
                    setIsDeleteOpen(false);
                    toast.success("Video Deleted Successfully");
                    window.location.reload();
                }
            } catch (error) {
                toast.error("Failed to delete video");
            }
        });
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-10">
            {data?.length > 0 ?
                data?.map((data: any, index: number) => {
                    return <div key={index}>
                        {Object.keys(uploadedImages).length > 0 ?
                            <div className='relative'>
                                <Image
                                    src={uploadedImages[data._id]}
                                    alt={data.projectName}
                                    className={`${uploadedImages[data._id] ? 'w-20' : 'w-full'} h-auto rounded-lg`}
                                    width={200}
                                    height={200}
                                    layout="responsive"
                                />
                                <button
                                    className="absolute top-2 right-2 z-[1]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDeleteOpen(true);
                                        setDeletableMediaUrl(data.projectAvatar)
                                    }}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                            :
                            <ReactLoading type={'bars'} color={'#e87223'} height={'40px'} width={'40px'} />
                        }
                    </div>
                })
                :
                <div className="text-center">No images uploaded yet</div>}
            {isDeleteOpen && <Modal
                isOpen={isDeleteOpen}
                onRequestClose={() => setIsDeleteOpen(false)}
                contentLabel="Delete Video"
                bodyOpenClassName="overflow-hidden"
                className="modal w-full md:max-w-[45%] h-auto p-5 rounded-[20px] overflow-y-auto relative bg-white"
                overlayClassName="z-[10] px-2 md:p-0 w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <Image
                    src={deleteCross}
                    alt="delete"
                    height={174}
                    width={174}
                    className="mx-auto"
                />
                <h2 className="text-[20px] text-center leading-normal">
                    Are you sure you want to Delete?
                </h2>
                <div className="flex items-center justify-center gap-6 mt-8">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="py-[10px] px-8 bg-[#E87223] text-white rounded"
                    >
                        {isPending ? "Deleting..." : "Yes Delete"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsDeleteOpen(false)}
                        className="py-[10px] px-8 bg-[#3A2C23] text-white rounded"
                    >
                        No
                    </button>
                </div>
            </Modal>}
        </div>
    )
}

export default ImageUploads