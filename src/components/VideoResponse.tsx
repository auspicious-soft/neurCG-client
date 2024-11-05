
import dynamic from 'next/dynamic';
import React from 'react'
import { toast } from 'sonner';
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false })


const VideoResponse = ({ modalClose, videoSrc = 'https://videos.pexels.com/video-files/4058000/4058000-hd_1920_1080_25fps.mp4'}: any) => {
    const handleShare = () => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(videoSrc).then(() => {
                toast.success('Link copied to clipboard');
            }, () => {
                toast.error('Failed to copy link');
            });
        } 
        else {
            const textArea = document.createElement('textarea');
            textArea.value = videoSrc;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            if (document.execCommand('copy')) {
                toast.success('Link copied to clipboard');
            } else {
                toast.error('Failed to copy link');
            }
            document.body.removeChild(textArea);
        }
    };
    
    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = videoSrc
        link.download = 'video.mp4'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className='flex flex-col lg:w-[800px] p-2'>
            <div className="flex justify-between">
                <p className='text-[24px]'>See The Magic!!</p>
                <svg onClick={modalClose} xmlns="http://www.w3.org/2000/svg" fill="#e87223" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-7 cursor-pointer">
                    <path className='cursor-pointer' strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>

            <div className='mt-5 rounded-xl overflow-hidden'>
                <ReactPlayer
                    url={videoSrc}
                    controls
                    width='100%'
                    height='100%'
                />
            </div>
            <div className='flex w-full gap-5 mt-5 mb-1 justify-end'>
                <svg onClick={handleShare} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#E87223] border border-[#E87223] rounded-md w-10 h-10 p-2 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                </svg>

                <button onClick={handleDownload} className='text-white bg-[#E87223] rounded-md p-2 px-5 text-[14px] font-medium'>Download</button>
            </div>
        </div>
    )
}

export default VideoResponse