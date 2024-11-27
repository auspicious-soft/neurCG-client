"use client"
import AddAudio from '@/components/AddAudio';
import AvatarSelection from '@/components/AvatarSelection';
import ProcessingLoader from '@/components/ProcessingLoader';
import Subtitles from '@/components/Subtitles';
import VideoResponse from '@/components/VideoResponse';
import React, { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import Modal from 'react-modal';
import ReactLoading from 'react-loading'
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { convertAudioToVideo, getUserInfo } from '@/services/user-service';
import { generateSignedUrlToUploadOn } from '@/actions';
import { SECONDS_PER_CREDIT } from '@/constants';

const Page = () => {
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [recordedVoice, setRecordedVoice] =useState<string | File | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subtitles, setSubtitles] = useState(false);
    const [subtitlesLanguage, setSubtitlesLanguage] = useState<string | null | undefined>();
    const [isPending, startTransition] = useTransition();
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [preferredVoice, setPreferredVoice] = useState<string | File | null>(null)
    const [avatarId, setAvatarId] = useState<string | null>(null);
    const [myOwnImage, setMyOwnImage] = useState<File | null>(null);
    const { data: session } = useSession()
    const { data: userData, isLoading, mutate } = useSWR(`/user/${session?.user?.id}`, getUserInfo, { revalidateOnFocus: false })
    const userCreditsLeft = userData?.data?.data?.creditsLeft || 0
    const totalSeconds = userCreditsLeft * SECONDS_PER_CREDIT
    const totalAvailableMinutes = totalSeconds / 60
    const openModal = () => setIsModalOpen(true)

    useEffect(() => {
        if (preferredVoice && !isLoading) {
            const availableSeconds = totalAvailableMinutes * 60;
            const file = preferredVoice as File;
            const url = URL.createObjectURL(file);
            const audio = new Audio(url);
            audio.addEventListener('loadedmetadata', () => {
                const duration = audio.duration;                    // duration in seconds
                setDuration(duration)
                URL.revokeObjectURL(url);
            })
            if (duration > availableSeconds) toast.warning(`Audio is too long! You have credits for ${totalAvailableMinutes.toFixed(1)} minutes of video. Please reduce the text or purchase more credits.`, { duration: 3000 })
        }
    }, [preferredVoice, isLoading, totalAvailableMinutes, duration])

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

    const handleAnimateClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (isLoading) {
            toast.error("Please wait while we load your credit information");
            return
        }

        if (duration > totalSeconds) {
            toast.warning(`You need ${Math.ceil(duration / 60)} minutes of credit. Current balance: ${(totalSeconds * 60).toFixed(1)} minutes. Please purchase more credits or reduce text length.`, { duration: 6000 })
            return
        }
        openModal()
        setProgress(0)
        startTransition(async () => {
            try {
                const email = session?.user?.email;
                if (!email) throw new Error("User ID is not available")

                let projectAvatarUrl: string | undefined;
                let preferredVoiceUrl: string | undefined;

                // Handle file uploads first if myOwnImage exists
                if (myOwnImage instanceof File) {
                    const uploadUrl = await generateSignedUrlToUploadOn(myOwnImage.name, myOwnImage.type, email)
                    const uploadResponse = await fetch(uploadUrl, {
                        method: 'PUT',
                        body: myOwnImage,
                        headers: {
                            'Content-Type': myOwnImage.type,
                        },
                        cache: 'no-store'
                    })

                    if (!uploadResponse.ok) toast.error('Something went wrong. Please try again')
                    const imageKey = `projects/${email}/my-media/${myOwnImage.name}`
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

                if(recordedVoice instanceof File) {
                    const uploadUrl = await generateSignedUrlToUploadOn(recordedVoice.name, recordedVoice.type, email)
                    const uploadResponse = await fetch(uploadUrl, {
                        method: 'PUT',
                        body: recordedVoice,
                        headers: {
                            'Content-Type': recordedVoice.type,
                        },
                        cache: 'no-store'
                    })
                    if (!uploadResponse.ok) toast.error('Something went wrong. Please try again')
                    const audioKey = `projects/${email}/my-media/${recordedVoice.name}`
                    preferredVoiceUrl = audioKey
                }
                const data = {
                    projectAvatar: avatarId || projectAvatarUrl,
                    audio: preferredVoiceUrl,
                    subtitles,
                    audioLength: Math.floor(duration),
                    ...(subtitles && { subtitlesLanguage })
                }
                // Remove any undefined values
                Object.keys(data).forEach(key => (data as any)[key] === undefined && delete (data as any)[key])
                const response = await convertAudioToVideo(`/user/${session?.user?.id}/audio-to-video`, data, {
                    responseType: 'arraybuffer', // Axios configuration for binary response
                });
                const video = await response?.data?.data?.videoUrl?.data
                // Create a Blob from the binary data
                const videoBlob = new Blob([new Uint8Array(video)], { type: 'video/mp4' });
                // Generate a URL for the Blob
                const videoUrl = URL.createObjectURL(videoBlob);

                if (!video) {
                    toast.error('Something went wrong. Please try again')
                    setProgress(0)
                    setIsModalOpen(false)
                }
                setVideoSrc(videoUrl)
                await mutate()
                setProgress(100)

            } catch (error) {
                toast.error('Something went wrong. Please try again')
                setProgress(0)
                setIsModalOpen(false)
            }
        })
    }
    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[200px]">
            <ReactLoading type="spin" color="#E87223" height={40} width={40} />
        </div>
    }

    return (
        <div>
            <AvatarSelection
                setAvatarId={setAvatarId}
                setMyOwnImage={setMyOwnImage}
                myOwnImage={myOwnImage}
                avatarId={avatarId}
            />
            <AddAudio
                recordedVoice=  {recordedVoice}
                setRecordedVoice=  {setRecordedVoice}
                preferredVoice={preferredVoice}
                setPreferredVoice={setPreferredVoice}
            />
            <Subtitles
                setSubtitles={setSubtitles}
                setSubtitlesLanguage={setSubtitlesLanguage}
                subtitles={subtitles}
            />

            <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Available credits video length:</span>
                    <span className="font-medium text-gray-900">{(totalSeconds / 60).toFixed(1)} minutes</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Estimated video length:</span>
                    <span className={`font-medium ${(duration > totalSeconds) ? 'text-red-600' : 'text-gray-900'}`}>
                        {(duration / 60).toFixed(2)} minutes
                    </span>
                </div>
                {(duration > totalSeconds) && (
                    <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-red-600">
                            Exceeds available credits by {(Math.abs(totalSeconds - duration) / 60).toFixed(1)} minutes.
                            Please purchase more credits or audio length.
                        </p>
                    </div>
                )}
            </div>
            <div className='flex justify-end mt-10'>
                <button
                    type='submit'
                    disabled={(!recordedVoice && !preferredVoice) || (subtitles && (subtitlesLanguage === undefined))}
                    className={`text-sm bg-[#E87223] text-white px-[28px] py-[11px] rounded-[5px] ${(!recordedVoice && !preferredVoice) || (subtitles && (subtitlesLanguage === undefined)) ?
                        'cursor-not-allowed opacity-50' : ''}`}
                    onClick={handleAnimateClick}
                >
                    {!isPending ? 'Animate' : <ReactLoading type={'bars'} color={'white'} height={'40px'} width={'40px'} />}
                </button>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    style={{
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
                    }}
                    contentLabel="Confirm Cancel Subscription"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                    ariaHideApp={false}
                >
                    {(isPending && progress <= 100) ?
                        <ProcessingLoader progress={progress} /> : <VideoResponse modalClose={() => setIsModalOpen(false)} videoSrc={videoSrc} />
                    }
                </Modal>
            </div>
        </div>
    );
}

export default Page;
