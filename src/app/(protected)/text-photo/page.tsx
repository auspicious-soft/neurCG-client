    "use client";

    import Modal from "react-modal";
    import React, { useEffect, useState, useTransition } from 'react';
    import AvatarSelection from '@/components/AvatarSelection';
    import Subtitles from '@/components/Subtitles';
    import TextSelection from '@/components/TextSelection';
    import { toast } from 'sonner';
    import { convertTextToVideo, getUserInfo } from '@/services/user-service';
    import { useSession } from 'next-auth/react';
    import ReactLoading from 'react-loading'
    import ProcessingLoader from "@/components/ProcessingLoader";
    import VideoResponse from "@/components/VideoResponse";
    import useSWR from "swr";
    import { CHARS_PER_WORD, SECONDS_PER_CREDIT, WORDS_PER_MINUTE } from "@/constants";
    import { getFileNameAndExtension, getMediaUrlFromFlaskProxy, postMediaToFlaskProxy } from "@/utils";
    import UseReload from "@/components/hooks/use-reload";
    import { getAxiosInstance } from "@/utils/axios";
    import ConfirmModal from "@/components/child modal/child-modal";
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



    type VideoCredits = {
        availableMinutes: number;
        maxCharacters: number;
    }

    const calculateVideoCredits = (credits: number): VideoCredits => {
        const totalSeconds = credits * SECONDS_PER_CREDIT;
        const availableMinutes = totalSeconds / 60;
        const maxCharacters = Math.floor((WORDS_PER_MINUTE * availableMinutes) * CHARS_PER_WORD);
        return { availableMinutes, maxCharacters };
    }

    const estimateVideoLengthOfText = (text: string): number => {
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words / WORDS_PER_MINUTE * 60); // Returns seconds
    }

    const Page = () => {
        const [showConfirmModal, setShowConfirmModal] = useState(false);
        const [isModalOpen, setIsModalOpen] = useState(false)
        const { data: session } = useSession()
        const [avatarId, setAvatarId] = useState<string | null>(null);
        const [myOwnImage, setMyOwnImage] = useState<File | null>(null);
        const [text, setText] = useState<string>('');
        const [textLanguage, setTextLanguage] = useState<string>('');
        const [preferredVoice, setPreferredVoice] = useState<string | File | null>(null)
        const [subtitles, setSubtitles] = useState(false);
        const [subtitlesLanguage, setSubtitlesLanguage] = useState<string | null | undefined>();
        const [progress, setProgress] = useState(0)
        const [isPending, startTransition] = useTransition()
        const { data: userData, isLoading, mutate } = useSWR(session?.user?.id ? `/user/${session?.user?.id}` : null, getUserInfo, { revalidateOnFocus: false })
        const userCreditsLeft = userData?.data?.data?.creditsLeft || 0
        const { availableMinutes, maxCharacters } = calculateVideoCredits(userCreditsLeft);
        const [videoSrc, setVideoSrc] = useState<string | null>(null);
        useEffect(() => {
            if (text && !isLoading) {
                const estimatedSeconds = estimateVideoLengthOfText(text);
                const availableSeconds = availableMinutes * 60;

                if (estimatedSeconds > availableSeconds) {
                    toast.warning(`Text is too long! You have credits for ${availableMinutes.toFixed(1)} minutes of video. Please reduce the text or purchase more credits.`, { duration: 3000 });
                }
            }
        }, [text, availableMinutes, isLoading])

        useEffect(() => {
            let intervalId: NodeJS.Timeout;

            if (isPending && progress < 100) {
                const estimatedSeconds = estimateVideoLengthOfText(text);
                const totalProcessingTime = estimatedSeconds * 12 * 1000; // convert to ms
                const updateInterval = Math.max(totalProcessingTime / 50, 100); // 50 steps, minimum 100ms
                const progressIncrement = 100 / (totalProcessingTime / updateInterval);

                intervalId = setInterval(() => {
                    setProgress((prevProgress:any) => {
                        const newProgress = prevProgress + progressIncrement;
                        return newProgress > 100 ? 100 : Math.floor(newProgress);
                    });
                }, updateInterval);
            }

            return () => {
                if (intervalId) clearInterval(intervalId);
            };
        }, [isPending, progress, text]);
        const handleAnimateClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault()
            if (isLoading) {
                toast.error("Please wait while we load your credit information");
                return
            }
            const estimatedSeconds = estimateVideoLengthOfText(text);
            const availableSeconds = availableMinutes * 60;

            if (estimatedSeconds > availableSeconds) {
                toast.error(`You need ${Math.ceil(estimatedSeconds / 60)} minutes of credit. Current balance: ${availableMinutes.toFixed(1)} minutes. Please purchase more credits or reduce text length.`, { duration: 6000 })
                return
            }
            if (text.length < 5) {
                toast.warning("Please enter at least 5 characters of text", { duration: 6000 })
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
                        const { fileName, fileExtension } = getFileNameAndExtension(myOwnImage);
                        const imageKey = `projects/${email}/my-media/${fileName}-${new Date().getTime()}.${fileExtension}`;
                        const uploadResponse = await postMediaToFlaskProxy(myOwnImage, imageKey)

                        if (!uploadResponse.success) toast.error('Something went wrong. Please try again')
                        projectAvatarUrl = imageKey
                    }

                    if (preferredVoice instanceof File) {
                        const { fileName, fileExtension } = getFileNameAndExtension(preferredVoice);
                        const audioKey = `projects/${email}/my-media/${fileName}-${new Date().getTime()}.${fileExtension}`;
                        const uploadResponse = await postMediaToFlaskProxy(preferredVoice, audioKey)
                        if (!uploadResponse.success) toast.error('Something went wrong. Please try again')
                        preferredVoiceUrl = audioKey
                    }
                    const data = {
                        projectAvatar: avatarId || projectAvatarUrl,
                        text,
                        textLanguage,
                        preferredVoice: typeof preferredVoice === 'string' ? preferredVoice : preferredVoiceUrl,
                        subtitles,
                        ...(subtitles && { subtitlesLanguage })
                    }
                    // Remove any undefined values
                    Object.keys(data).forEach(key => (data as any)[key] === undefined && delete (data as any)[key])
                    const response = await convertTextToVideo(`/user/${session?.user?.id}/text-to-video`, data)
                    const video = await getMediaUrlFromFlaskProxy(response?.data?.data?.videoUrl)
                    if (!video) {
                        toast.error('Something went wrong. Please try again')
                        setProgress(0)
                        setIsModalOpen(false)
                    }
                    setVideoSrc(video as string)
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

        const isTextTooLong = estimateVideoLengthOfText(text) > (availableMinutes * 60);
        const remainingSeconds = (availableMinutes * 60) - estimateVideoLengthOfText(text);
        const estimatedLength = estimateVideoLengthOfText(text)

        const handleBeforeUnload = async () => {
            const axiosInstance = await getAxiosInstance()
            axiosInstance.patch(`/user/${session?.user?.id}/stop-project-creation`)
        }

        const confirmChildClose = async () => {
            setShowConfirmModal(false);
            setIsModalOpen(false);
            await handleBeforeUnload();
        }

        return (
            <form>
                <UseReload isLoading={isPending} onBeforeUnload={handleBeforeUnload} />
                <AvatarSelection
                    setAvatarId={setAvatarId}
                    setMyOwnImage={setMyOwnImage}
                    myOwnImage={myOwnImage}
                    avatarId={avatarId}
                />
                <TextSelection
                    setText={setText}
                    text={text}
                    setTextLanguage={setTextLanguage}
                    setPreferredVoice={setPreferredVoice}
                    preferredVoice={preferredVoice}
                />
                <Subtitles
                    setSubtitles={setSubtitles}
                    setSubtitlesLanguage={setSubtitlesLanguage}
                    subtitles={subtitles}
                />

                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Available credits video length:</span>
                        <span className="font-medium text-gray-900">{availableMinutes.toFixed(1)} minutes</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Estimated video length:</span>
                        <span className={`font-medium ${isTextTooLong ? 'text-red-600' : 'text-gray-900'}`}>
                            {(estimatedLength / 60).toFixed(1)} minutes
                        </span>
                    </div>
                    {isTextTooLong && (
                        <div className="p-3 bg-red-50 rounded-lg">
                            <p className="text-red-600">
                                Exceeds available credits by {(Math.abs(remainingSeconds) / 60).toFixed(1)} minutes.
                                Please purchase more credits or reduce text length.
                            </p>
                        </div>
                    )}
                </div>

                <div className='flex justify-end mt-10'>
                    <button
                        type='submit'
                        disabled={!text || !textLanguage || !preferredVoice || (subtitles && (subtitlesLanguage === undefined)) || isTextTooLong}
                        className={`text-sm bg-[#E87223] text-white px-[28px] py-[11px] rounded-[5px] 
                            ${(!text || !textLanguage || !preferredVoice || (subtitles && (subtitlesLanguage === undefined)) || isTextTooLong) ?
                                'cursor-not-allowed opacity-50' : ''}`}
                        onClick={handleAnimateClick}
                    >
                        {!isPending ? 'Animate' : <ReactLoading type={'bars'} color={'white'} height={'40px'} width={'40px'} />}
                    </button>

                    <Modal
                        isOpen={isModalOpen}
                        onRequestClose={(e) => {
                        if (e.type === 'click' && isPending) {
                                setShowConfirmModal(true)
                                return
                            }
                            setIsModalOpen(false)
                        }}
                        style={customStyles}
                        contentLabel="Confirm Cancel Subscription"
                        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[50]"
                        ariaHideApp={false}
                    >
                        {(isPending && progress <= 100) ?
                            <ProcessingLoader progress={progress} /> :
                            <VideoResponse modalClose={() => setIsModalOpen(false)} videoSrc={videoSrc} />
                        }
                    </Modal>

                    <ConfirmModal
                        isOpen={showConfirmModal}
                        onClose={() => setShowConfirmModal(false)}
                        onConfirm={confirmChildClose}
                    />
                </div>
            </form>
        )
    }

    export default Page;