'use client'
import { deleteMyMedia } from '@/services/user-service';
import { getAvatarsUsedFromFlask, getMediaUrlFromFlaskProxy } from '@/utils';
import VideoCards from '../VideoCards';
import { DeleteIcon } from '@/utils/svgIcons';
import React, { useEffect, useState, useTransition } from 'react';
import Modal from 'react-modal';
import { toast } from 'sonner';
import deleteCross from '@/assets/images/delete.svg';
import Image from 'next/image';

interface VideoUploadsProps {
    data: any;
}

const VideoUploads = (props: VideoUploadsProps) => {
    const { data } = props;
    const [projectImages, setProjectImages] = useState<any>({});
    const [projectVideoLink, setProjectVideoLink] = useState<any>({});
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletableMediaUrl, setDeletableMediaUrl] = useState<string | null>(null);
    console.log('deletableMediaUrl: ', deletableMediaUrl);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const fetchProjectImages = async () => {
            if (Array.isArray(data)) {
                const imagesPromise = data.map(async (project: any) => {
                    const imageUrl = await getAvatarsUsedFromFlask(project.projectAvatar);
                    return { projectId: project._id, imageUrl };
                });
                const imageResultsArrayOfObjects = await Promise.all(imagesPromise);
                const imageResults = imageResultsArrayOfObjects.reduce((acc: any, curr: any) => {
                    acc[curr.projectId] = curr.imageUrl;
                    return acc;
                }, {});
                setProjectImages(imageResults);
            }
        };

        const fetchProjectVideoLink = async () => {
            if (Array.isArray(data)) {
                const videoPromises = data.map(async (project: any) => {
                    const videoUrl = await getMediaUrlFromFlaskProxy(project?.projectVideoLink);
                    return { projectId: project._id, videoUrl };
                });
                const videoResultsArrayOfObjects = await Promise.all(videoPromises);
                const videoResults = videoResultsArrayOfObjects.reduce((acc: any, curr: any) => {
                    acc[curr.projectId] = curr.videoUrl;
                    return acc;
                }, {});
                setProjectVideoLink(videoResults);
            }
        };

        fetchProjectVideoLink();
        fetchProjectImages();
    }, [data]);

    const handleDelete = async () => {
        if (!deletableMediaUrl) return;
        startTransition(async () => {
            try {
                const res = await deleteMyMedia('/file/remove-my-media', { subpath: deletableMediaUrl, projectType: 'video' });
                if (res.status === 200) {
                    setIsDeleteOpen(false);
                    toast.success('Video Deleted Successfully');
                    window.location.reload();
                }
            } catch (error) {
                toast.error('Failed to delete video');
            }
        });
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {data?.length > 0 ? data.map((project: any) => {
                return (
                    <div key={project._id} className="relative">
                        <VideoCards
                            isDeletable={false}
                            title={project.projectName}
                            thumbnail={projectImages[project._id]}
                            videoSrc={projectVideoLink[project._id]}
                            id={project._id}
                        />
                        <button
                            className="absolute top-2 right-2 z-[1]"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDeleteOpen(true);
                                setDeletableMediaUrl(project.video);
                            }}
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                )
            }) : (
                <div className="text-center">No videos uploaded yet</div>
            )}

            {isDeleteOpen && (
                <Modal
                    isOpen={isDeleteOpen}
                    onRequestClose={() => setIsDeleteOpen(false)}
                    contentLabel="Delete Video"
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
                            {isPending ? 'Deleting...' : 'Yes Delete'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsDeleteOpen(false)}
                            className="py-[10px] px-8 bg-[#3A2C23] text-white rounded"
                        >
                            No
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default VideoUploads;
