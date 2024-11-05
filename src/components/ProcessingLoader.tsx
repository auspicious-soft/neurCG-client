import React from 'react'

const ProcessingLoader = ({ progress }: any) => {
    return (
        <div className="flex p-7 justify-center flex-col items-center ">
            <p className="text-[28px] font-semibold text-[#3A2C23]">Its Worth The Wait!!</p>
            <p className="text-[14px] mt-4 max-w-[14rem] text-center text-[#6B6B6B]">We are processing your video and might take a minute or two. Please hold on to see the magic.</p>
            
            <div className="w-full mt-10">
                <div className="flex justify-between mb-2">
                    <span className="text-[12px] font-semibold text-[#6B6B6B] ">Processing</span>
                    <span className="text-[12px] font-semibold text-[#6B6B6B]">{progress}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-5">
                    <div className="bg-[#307FE2] h-5 rounded-full " style={{ width: `${progress}%` , transition: 'width 0.5s ease' }}></div>
                </div>
            </div>
        </div>
    )
}

export default ProcessingLoader