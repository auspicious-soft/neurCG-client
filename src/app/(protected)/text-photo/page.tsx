"use client";
import React, { useState } from 'react';
import AvatarSelection from '@/components/AvatarSelection';
import Subtitles from '@/components/Subtitles';
import TextSelection from '@/components/TextSelection';

const Page = () => {
    const [avatarId, setAvatarId] = useState<string | null>(null);
    const [myOwnImage, setMyOwnImage] = useState<File | null>(null);
    const [text, setText] = useState<string>('');
    const [textLanguage, setTextLanguage] = useState<string>('');
    const [preferredVoice, setPreferredVoice] = useState<string | File | null>(null)
    const [subtitles, setSubtitles] = useState(false);
    const [subtitlesLanguage, setSubtitlesLanguage] = useState<string>('');

    const handleAnimateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const data = { ...(avatarId && { projectAvatar: avatarId }), ...(myOwnImage && { projectAvatar: myOwnImage }), text, textLanguage, preferredVoice, subtitles, ...(subtitles && { subtitlesLanguage }) }
        console.log('data: ', data);

        fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

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
                preferredVoice = {preferredVoice}
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