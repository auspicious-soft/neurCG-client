import AddVideo from '@/components/AddVideo';
import AddVoice from '@/components/AddVoice';
import Subtitles from '@/components/Subtitles';
import React from 'react';

const Page = () => {
    return (
        <div>
            <AddVideo />
            <AddVoice />
            <Subtitles />
            <div className='flex justify-end mt-10'>
                <button className='text-sm bg-[#E87223] text-white px-[28px] py-[11px] rounded-[5px]'>Animate</button>
            </div>
        </div>
    );
}

export default Page;
