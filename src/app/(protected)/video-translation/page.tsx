'use client'
import AddVideo from '@/components/AddVideo';
import AddVoice from '@/components/AddVoice';
import Subtitles from '@/components/Subtitles';
import Modal from "react-modal";
import React, { use, useEffect, useState, useTransition } from 'react';
import AvatarSelection from '@/components/AvatarSelection';
import TextSelection from '@/components/TextSelection';
import { toast } from 'sonner';
import { convertTextToVideo, getUserInfo, translateVideo } from '@/services/user-service';
import { useSession } from 'next-auth/react';
import { generateSignedUrlToUploadOn, getImageUrl } from '@/actions';
import ReactLoading from 'react-loading'
import ProcessingLoader from "@/components/ProcessingLoader";
import VideoResponse from "@/components/VideoResponse";
import useSWR from "swr";
import { SECONDS_PER_CREDIT } from '../text-photo/page';

const customStyles = {
    content: {
        // width: '450px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
        padding: '20px',
    }
}
const Page = () => {
    const [projectAvatar, setProjectAvatar] = useState<string | null | File>(null)
    const [videoUploaded, setVideoUploaded] = useState<string | File | null>(null)
    const [videoDuration, setVideoDuration] = useState(0)
    const [originalText, setOriginalText] = useState<string>('');
    const [translatedText, setTranslatedText] = useState<string>('');
    const [subtitles, setSubtitles] = useState(false);
    const [subtitlesLanguage, setSubtitlesLanguage] = useState<string | null | undefined>();
    const [preferredVoice, setPreferredVoice] = useState<string | null | undefined | File>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [progress, setProgress] = useState(0)
    const [isPending, startTransition] = useTransition()
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const { data: session } = useSession()
    const { data: userData, isLoading, mutate } = useSWR(`/user/${session?.user?.id}`, getUserInfo, { revalidateOnFocus: false })
    const userCreditsLeft = userData?.data?.data?.creditsLeft || 0
    const totalSeconds = userCreditsLeft * SECONDS_PER_CREDIT
    const totalAvailableMinutes = totalSeconds / 60

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isPending && progress < 100) {
            intervalId = setInterval(() => {
                setProgress(prevProgress => {
                    const newProgress = prevProgress + Math.floor(Math.random() * 30);
                    return newProgress > 100 ? 100 : newProgress;
                });
            }, 1500)
        }
        return () => {
            if (intervalId) clearInterval(intervalId)
        }
    }, [isPending, progress])


    useEffect(() => {
        if (videoUploaded) {
            const videoFile = videoUploaded as File;
            const videoElement = document.createElement('video');
            videoElement.src = URL.createObjectURL(videoFile);

            videoElement.addEventListener('loadedmetadata', () => {
                setVideoDuration(videoElement.duration);
                // Generate thumbnail
                videoElement.currentTime = 2; // Set the time for the thumbnail frame
            });

            videoElement.addEventListener('seeked', () => {
                // Ensure video is ready at the desired frame
                const canvas = document.createElement('canvas');
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const thumbnailFile = new File([blob], `thumbnail.jpg`, { type: 'image/jpeg' });
                            setProjectAvatar(thumbnailFile);
                        }
                    }, 'image/jpeg');
                }
                URL.revokeObjectURL(videoElement.src)
            });
            if (videoDuration > totalSeconds) {
                toast.warning(`Video is too long! You have credits for ${totalAvailableMinutes.toFixed(1)} minutes of video. Please reduce the text or purchase more credits.`, { duration: 2000 })
            }
            // Clean up when the component unmounts
            return () => {
                videoElement.src = '';
                videoElement.load();
            };

        }
    }, [videoUploaded, videoDuration, totalSeconds, totalAvailableMinutes])

    const handleAnimateClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (isLoading) {
            toast.error("Please wait while we load your credit information");
            return
        }

        if (videoDuration > totalSeconds) {
            toast.warning(`You need ${Math.ceil(videoDuration / 60)} minutes of credit. Current balance: ${(totalSeconds * 60).toFixed(1)} minutes. Please purchase more credits or reduce text length.`, { duration: 3000 })
            return
        }

        openModal()
        setProgress(0)
        startTransition(async () => {
            try {
                const email = session?.user?.email;
                if (!email) throw new Error("User ID is not available")

                // Upload the videoUploaded file
                const videoUploadedFile = videoUploaded as File;
                const uploadUrl = await generateSignedUrlToUploadOn(videoUploadedFile.name, videoUploadedFile.type, email)
                const uploadResponse = await fetch(uploadUrl, {
                    method: 'PUT',
                    body: videoUploadedFile,
                    headers: {
                        'Content-Type': videoUploadedFile.type,
                    },
                    cache: 'no-store'
                })
                if (!uploadResponse.ok) toast.error('Something went wrong. Please try again')
                const videoKey = `projects/${email}/my-media/${videoUploadedFile.name}`

                let projectAvatarUrl: string | undefined;
                let preferredVoiceUrl: string | undefined;

                if (projectAvatar instanceof File) {
                    const uploadUrl = await generateSignedUrlToUploadOn(projectAvatar.name, projectAvatar.type, email)
                    const uploadResponse = await fetch(uploadUrl, {
                        method: 'PUT',
                        body: projectAvatar,
                        headers: {
                            'Content-Type': projectAvatar.type,
                        },
                        cache: 'no-store'
                    })

                    if (!uploadResponse.ok) toast.error('Something went wrong. Please try again')
                    const imageKey = `projects/${email}/my-media/${projectAvatar.name}`
                    projectAvatarUrl = imageKey
                }

                if (preferredVoice instanceof File) {
                    const uploadUrl = await generateSignedUrlToUploadOn(preferredVoice.name, preferredVoice.type, email)
                    const uploadResponse = await fetch(uploadUrl, {
                        method: 'PUT',
                        body: preferredVoice,
                        headers: {
                            'Content-Type': preferredVoice.type,
                        },
                        cache: 'no-store'
                    })
                    if (!uploadResponse.ok) toast.error('Something went wrong. Please try again')
                    const audioKey = `projects/${email}/my-media/${preferredVoice.name}`
                    preferredVoiceUrl = audioKey
                }
                const data = {
                    video: videoKey,
                    projectAvatar: projectAvatarUrl,
                    originalText,
                    translatedText,
                    preferredVoice: typeof preferredVoice === 'string' ? preferredVoice : preferredVoiceUrl,
                    subtitles,
                    videoLength: Math.floor(videoDuration),
                    ...(subtitles && { subtitlesLanguage })
                }

                Object.keys(data).forEach(key => (data as any)[key] === undefined && delete (data as any)[key])
                const response = await translateVideo(`/user/${session?.user?.id}/video-translation`, data)
                const video = await response?.data?.data?.videoUrl
                if (!video) {
                    toast.error('Something went wrong. Please try again')
                    setProgress(0)
                    setIsModalOpen(false)
                }
                setVideoSrc(video)
                await mutate()
                setProgress(100)

            } catch (error) {
                toast.error('Something went wrong. Please try again')
                setProgress(0)
                setIsModalOpen(false)
            }
        })
    }

    const openModal = () => setIsModalOpen(true)

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[200px]">
            <ReactLoading type="spin" color="#E87223" height={40} width={40} />
        </div>
    }

    return (
        <div>
            <AddVideo
                videoUploaded={videoUploaded}
                setVideoUploaded={setVideoUploaded}
                setOriginalText={setOriginalText}
                setTranslatedText={setTranslatedText}
            />
            <AddVoice
                preferredVoice={preferredVoice}
                setPreferredVoice={setPreferredVoice}
            />
            <Subtitles
                setSubtitlesLanguage={setSubtitlesLanguage}
                subtitles={subtitles}
                setSubtitles={setSubtitles}
            />

            <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Available credits video length:</span>
                    <span className="font-medium text-gray-900">{(totalSeconds / 60).toFixed(1)} minutes</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Estimated video length:</span>
                    <span className={`font-medium ${(videoDuration > totalSeconds) ? 'text-red-600' : 'text-gray-900'}`}>
                        {(videoDuration / 60).toFixed(2)} minutes
                    </span>
                </div>
                {(videoDuration > totalSeconds) && (
                    <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-red-600">
                            Exceeds available credits by {(Math.abs(totalSeconds - videoDuration) / 60).toFixed(1)} minutes.
                            Please purchase more credits or audio length.
                        </p>
                    </div>
                )}
            </div>

            <div className='flex justify-end mt-10'>
                <button
                    type='submit'
                    disabled={!preferredVoice || !originalText || !translatedText || (subtitles && (subtitlesLanguage === undefined))}
                    className={`text-sm bg-[#E87223] text-white px-[28px] py-[11px] rounded-[5px] 
                        ${(!preferredVoice || !originalText || !translatedText || (subtitles && (subtitlesLanguage === undefined))) ?
                            'cursor-not-allowed opacity-50' : ''}`}
                    onClick={handleAnimateClick}
                >
                    {!isPending ? 'Animate' : <ReactLoading type={'bars'} color={'white'} height={'40px'} width={'40px'} />}
                </button>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    style={customStyles}
                    contentLabel="Confirm Cancel Subscription"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                    ariaHideApp={false}
                >
                    {(isPending && progress <= 100) ?
                        <ProcessingLoader progress={progress} /> :
                        <VideoResponse modalClose={() => setIsModalOpen(false)} videoSrc={videoSrc} />
                    }
                </Modal>
            </div>
        </div>
    );
}

export default Page;
