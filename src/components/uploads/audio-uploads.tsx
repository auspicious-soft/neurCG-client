'use client'
import { deleteMyMedia } from '@/services/user-service';
import { getMediaUrlFromFlaskProxy } from '@/utils';
import React, { useEffect, useState, useTransition } from 'react';
import Modal from 'react-modal';
import { toast } from 'sonner';
import { DeleteIcon } from '@/utils/svgIcons';
import deleteCross from '@/assets/images/delete.svg';
import Image from 'next/image';

interface AudioUploadsProps {
    data: any;
}

const AudioUploads = (props: AudioUploadsProps) => {
    const { data } = props;
    const [uploadedAudios, setUploadedAudios] = useState<Record<string, string>>({});
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletableMediaUrl, setDeletableMediaUrl] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const fetchUploadedAudios = async () => {
            if (Array.isArray(data)) {
                const audiosPromise = data.map(async (project: any) => {
                    const audioUrl = await getMediaUrlFromFlaskProxy(project?.audio);
                    return { projectId: project._id, audioUrl };
                });
                const audioResultsArrayOfObjects = await Promise.all(audiosPromise);
                const audioResults = audioResultsArrayOfObjects.reduce((acc: any, curr: any) => {
                    acc[curr.projectId] = curr.audioUrl;
                    return acc;
                }, {});
                setUploadedAudios(audioResults);
            }
        };
        fetchUploadedAudios();
    }, [data]);

    const handleDelete = async () => {
        if (!deletableMediaUrl) return;
        startTransition(async () => {
            try {
                const res = await deleteMyMedia('/file/remove-my-media', { 
                    subpath: deletableMediaUrl,
                    projectType: 'audio'
                });
                if (res.status === 200) {
                    setIsDeleteOpen(false);
                    toast.success('Audio Deleted Successfully');
                    window.location.reload();
                }
            } catch (error) {
                toast.error('Failed to delete audio');
            }
        });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-10">
            {Object.keys(uploadedAudios).length > 0 ? (
                Object.entries(uploadedAudios).map(([projectId, audioUrl]) => {
                    const currentProject = data.find((project: any) => project._id === projectId);
                    console.log('currentProject: ', currentProject);
                    return (
                        <div key={projectId} className="relative flex justify-center items-center p-2 border border-gray-300 rounded bg-gray-100">
                            <audio controls className="w-full">
                                <source src={audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                            <button
                                className="top-2 right-2 z-[1]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDeleteOpen(true);
                                    setDeletableMediaUrl(currentProject?.audio);
                                }}
                            >
                                <DeleteIcon />
                            </button>
                        </div>
                    );
                })
            ) : (
                <div className="text-center">No audios uploaded yet</div>
            )}

            {isDeleteOpen && (
                <Modal
                    isOpen={isDeleteOpen}
                    onRequestClose={() => setIsDeleteOpen(false)}
                    contentLabel="Delete Audio"
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

export default AudioUploads;