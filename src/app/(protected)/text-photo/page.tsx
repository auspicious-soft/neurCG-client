"use client";
import Modal from "react-modal";
import React, { useEffect, useState, useTransition } from 'react';
import AvatarSelection from '@/components/AvatarSelection';
import Subtitles from '@/components/Subtitles';
import TextSelection from '@/components/TextSelection';
import { toast } from 'sonner';
import { convertTextToVideo } from '@/services/user-service';
import { useSession } from 'next-auth/react';
import { generateSignedUrlToUploadOn, getImageUrl } from '@/actions';
import ReactLoading from 'react-loading'
import ProcessingLoader from "@/components/ProcessingLoader";
import VideoResponse from "@/components/VideoResponse";

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
    },
}

const Page = () => {
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
                const data = {
                    projectAvatar: avatarId || projectAvatarUrl,
                    text,
                    textLanguage,
                    preferredVoice: typeof preferredVoice === 'string' ? preferredVoice : preferredVoiceUrl,
                    subtitles,
                    ...(subtitles && { subtitlesLanguage })
                };
                // Remove any undefined values
                Object.keys(data).forEach(key => (data as any)[key] === undefined && delete (data as any)[key])
                const response = await convertTextToVideo(`/user/${session?.user?.id}/text-to-video`, data);
                setProgress(100)

            } catch (error) {
                toast.error('Something went wrong. Please try again')
                setProgress(0);
            }
        })
    }
    const openModal = () => setIsModalOpen(true)

    return (
        <form>
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
            <div className='flex justify-end mt-10'>
                <button type='submit' disabled={!text || !textLanguage || !preferredVoice || (subtitles && (subtitlesLanguage === undefined))}
                    className={`text-sm bg-[#E87223] text-white px-[28px] py-[11px] rounded-[5px] ${!text || !textLanguage || !preferredVoice || (subtitles && (subtitlesLanguage === undefined)) ? 'cursor-not-allowed' : ''} ${!text || !textLanguage || !preferredVoice || (subtitles && (subtitlesLanguage === undefined)) ? 'opacity-50' : ''}`}
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
                    // shouldCloseOnOverlayClick = {false}
                    // shouldCloseOnEsc={false}
                    ariaHideApp={false} // Add this line to disable aria app element error
                >
                    {(isPending && progress <= 100) ? <ProcessingLoader progress={progress} /> : <VideoResponse modalClose={() => setIsModalOpen(false)} />}
                </Modal>
            </div>
        </form>
    )
}

export default Page;