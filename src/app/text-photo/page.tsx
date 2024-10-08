"use client"
import AvatarSelection from '@/components/AvatarSelection';
import Subtitles from '@/components/Subtitles';
import TextSelection from '@/components/TextSelection';
import React from 'react';
 
const Page = () => {
    return (
        <div>
            <AvatarSelection />
            <TextSelection />
            <Subtitles />
            <div className='flex justify-end mt-10'>
                <button className='text-sm bg-[#E87223] text-white px-[28px] py-[11px] rounded-[5px]'>Animate</button>
            </div>
        </div>
    );
}

export default Page;
