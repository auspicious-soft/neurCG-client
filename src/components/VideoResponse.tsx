
import dynamic from 'next/dynamic';
import React from 'react'
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false })

const VideoResponse = ({ modalClose, videoSrc }: any) => {
    return (
        <div className='flex flex-col'>
            <div className="flex justify-between">
                <p className='text-[24px]'>See The Magic!!</p>
                <svg onClick={modalClose}  xmlns="http://www.w3.org/2000/svg" fill="#e87223" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-7 cursor-pointer">
                    <path className='cursor-pointer' strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>

            <div>
                <ReactPlayer
                    url={videoSrc || 'https://videos.pexels.com/video-files/4058000/4058000-hd_1920_1080_25fps.mp4'}
                    controls
                    width='100%'
                    height='100%'
                    style={{ borderRadius: '10px' }}
                />
            </div>
        </div>
    )
}

export default VideoResponse