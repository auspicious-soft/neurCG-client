"use client";
import React, { useState, useTransition } from 'react';
import AvatarSelection from '@/components/AvatarSelection';
import Subtitles from '@/components/Subtitles';
import TextSelection from '@/components/TextSelection';
import { toast } from 'sonner';
import { convertTextToVideo } from '@/services/user-service';
import { useSession } from 'next-auth/react';
import { generateSignedUrlToUploadOn, getImageUrl } from '@/actions';

const Page = () => {
    const { data: session } = useSession()
    const [avatarId, setAvatarId] = useState<string | null>(null);
    const [myOwnImage, setMyOwnImage] = useState<File | null>(null);
    const [text, setText] = useState<string>('');
    const [textLanguage, setTextLanguage] = useState<string>('');
    const [preferredVoice, setPreferredVoice] = useState<string | File | null>(null)
    const [subtitles, setSubtitles] = useState(false);
    const [subtitlesLanguage, setSubtitlesLanguage] = useState<string>('');
    const [isPending, startTransition] = useTransition()
    const handleAnimateClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        startTransition(async () => {
            try {
                const email = session?.user?.email;
                if (!email) throw new Error("User ID is not available")

                let projectAvatarUrl: string | undefined;
                let preferredVoiceUrl: string | undefined;

                // Handle file uploads first
                if (myOwnImage instanceof File) {
                    // await uploadFile(myOwnImage, userId);
                    const signedUrl = await generateSignedUrlToUploadOn(myOwnImage.name, myOwnImage.type, email)
                    const uploadResponse = await fetch(signedUrl, {
                        method: 'PUT',
                        body: myOwnImage,
                        headers: {
                            'Content-Type': myOwnImage.type,
                        },
                        cache: 'no-store'
                    })

                    if (!uploadResponse.ok) toast.error('Something went wrong. Please try again')
                    const imageKey = `projects/${email}/my-media/${myOwnImage.name}`;
                    projectAvatarUrl = await getImageUrl(imageKey)

                }

                // if (preferredVoice instanceof File) {
                //     await uploadFile(preferredVoice, userId);
                //     preferredVoiceUrl = await getImageUrl(userId, preferredVoice.name);
                // }

                // // Prepare the data object with serializable values
                // const data = {
                //     projectAvatar: avatarId || projectAvatarUrl,
                //     text,
                //     textLanguage,
                //     preferredVoice: typeof preferredVoice === 'string' ? preferredVoice : preferredVoiceUrl,
                //     subtitles,
                //     ...(subtitles && { subtitlesLanguage })
                // };

                // // Remove any undefined values
                // Object.keys(data).forEach(key => (data as any)[key] === undefined && delete (data as any)[key]);

                // console.log('data: ', data);

                // const response = await convertTextToVideo(`/user/${userId}/text-to-video`, data);
                // console.log('response: ', response);

            } catch (error) {
                console.error('error: ', error);
                toast.error('Something went wrong. Please try again')
            }
        })
    }

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
                <button type='submit' disabled={!text || !textLanguage || !preferredVoice}
                    className={`text-sm bg-[#E87223] text-white px-[28px] py-[11px] rounded-[5px] ${!text || !textLanguage || !preferredVoice ? 'cursor-not-allowed' : ''} ${!text || !textLanguage || !preferredVoice ? 'opacity-50' : ''}`}
                    onClick={handleAnimateClick}
                >
                    Animate
                </button>
            </div>
        </form>
    );
}

export default Page;