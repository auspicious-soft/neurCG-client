'use client'
import AddVideo from '@/components/AddVideo';
import AddVoice from '@/components/AddVoice';
import Subtitles from '@/components/Subtitles';
import Modal from "react-modal";
import React, { useEffect, useState, useTransition } from 'react';
import AvatarSelection from '@/components/AvatarSelection';
import TextSelection from '@/components/TextSelection';
import { toast } from 'sonner';
import { convertTextToVideo, getUserInfo } from '@/services/user-service';
import { useSession } from 'next-auth/react';
import { generateSignedUrlToUploadOn, getImageUrl } from '@/actions';
import ReactLoading from 'react-loading'
import ProcessingLoader from "@/components/ProcessingLoader";
import VideoResponse from "@/components/VideoResponse";
import useSWR from "swr";

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

    const [subtitles, setSubtitles] = useState(false);
    const [subtitlesLanguage, setSubtitlesLanguage] = useState<string | null | undefined>();
    const [preferredVoice, setPreferredVoice] = useState<string | null | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [progress, setProgress] = useState(0)
    const [isPending, startTransition] = useTransition()
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const { data: session } = useSession()
    const { data: userData, isLoading, mutate } = useSWR(`/user/${session?.user?.id}`, getUserInfo, { revalidateOnFocus: false })
    const userCreditsLeft = userData?.data?.data?.creditsLeft || 0
    const totalSeconds = userCreditsLeft * 60
    const handleAnimateClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        // event.preventDefault()
        // if (isLoading) {
        //     toast.error("Please wait while we load your credit information");
        //     return
        // }
        // const estimatedSeconds = estimateVideoLengthOfText(text);
        // const availableSeconds = availableMinutes * 60;

        // if (estimatedSeconds > availableSeconds) {
        //     toast.error(`You need ${Math.ceil(estimatedSeconds / 60)} minutes of credit. Current balance: ${availableMinutes.toFixed(1)} minutes. Please purchase more credits or reduce text length.`, { duration: 6000 })
        //     return
        // }
        // if (text.length < 5) {
        //     toast.warning("Please enter at least 5 characters of text", { duration: 6000 })
        //     return
        // }
        // openModal()
        // setProgress(0)
        // startTransition(async () => {
        //     try {
        //         const email = session?.user?.email;
        //         if (!email) throw new Error("User ID is not available")

        //         let projectAvatarUrl: string | undefined;
        //         let preferredVoiceUrl: string | undefined;

        //         // Handle file uploads first if myOwnImage exists
        //         if (myOwnImage instanceof File) {
        //             const uploadUrl = await generateSignedUrlToUploadOn(myOwnImage.name, myOwnImage.type, email)
        //             const uploadResponse = await fetch(uploadUrl, {
        //                 method: 'PUT',
        //                 body: myOwnImage,
        //                 headers: {
        //                     'Content-Type': myOwnImage.type,
        //                 },
        //                 cache: 'no-store'
        //             })

        //             if (!uploadResponse.ok) toast.error('Something went wrong. Please try again')
        //             const imageKey = `projects/${email}/my-media/${myOwnImage.name}`
        //             projectAvatarUrl = imageKey
        //         }

        //         if (preferredVoice instanceof File) {
        //             const uploadUrl = await generateSignedUrlToUploadOn(preferredVoice.name, preferredVoice.type, email)
        //             const uploadResponse = await fetch(uploadUrl, {
        //                 method: 'PUT',
        //                 body: preferredVoice,
        //                 headers: {
        //                     'Content-Type': preferredVoice.type,
        //                 },
        //                 cache: 'no-store'
        //             })
        //             if (!uploadResponse.ok) toast.error('Something went wrong. Please try again')
        //             const audioKey = `projects/${email}/my-media/${preferredVoice.name}`
        //             preferredVoiceUrl = audioKey
        //         }
        //         const data = {
        //             projectAvatar: avatarId || projectAvatarUrl,
        //             text,
        //             textLanguage,
        //             preferredVoice: typeof preferredVoice === 'string' ? preferredVoice : preferredVoiceUrl,
        //             subtitles,
        //             ...(subtitles && { subtitlesLanguage })
        //         }
        //         // Remove any undefined values
        //         Object.keys(data).forEach(key => (data as any)[key] === undefined && delete (data as any)[key])
        //         const response = await convertTextToVideo(`/user/${session?.user?.id}/text-to-video`, data)
        //         const video = await response?.data?.data?.videoUrl
        //         if (!video) {
        //             toast.error('Something went wrong. Please try again')
        //             setProgress(0)
        //             setIsModalOpen(false)
        //         }
        //         setVideoSrc(video)
        //         await mutate()
        //         setProgress(100)

        //     } catch (error) {
        //         toast.error('Something went wrong. Please try again')
        //         setProgress(0)
        //         setIsModalOpen(false)
        //     }
        // })
    }
    const openModal = () => setIsModalOpen(true)

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[200px]">
            <ReactLoading type="spin" color="#E87223" height={40} width={40} />
        </div>
    }

    return (
        <div>
            <AddVideo />
            <AddVoice />
            <Subtitles
                setSubtitlesLanguage={setSubtitlesLanguage}
                subtitles={subtitles}
                setSubtitles={setSubtitles}
            />
            <div className='flex justify-end mt-10'>
                <button
                    type='submit'
                    disabled={!preferredVoice || (subtitles && (subtitlesLanguage === undefined))}
                    className={`text-sm bg-[#E87223] text-white px-[28px] py-[11px] rounded-[5px] 
                        ${(!preferredVoice || (subtitles && (subtitlesLanguage === undefined))) ?
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
