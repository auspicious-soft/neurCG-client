"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { CrossIcon, ShareIcon, VideoPlayerIcon } from "@/utils/svgIcons";
import Image, { StaticImageData } from "next/image";
import Modal from "react-modal";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoCardProps {
  videoSrc: string; // Static video source
  title: string;
  thumbnail?: string | StaticImageData; // Optional thumbnail
}

const VideoCards: React.FC<VideoCardProps> = ({ videoSrc, title, thumbnail }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCardClick = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoSrc;
    link.download = title || "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div
        className="p-1 rounded-lg bg-white cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="player-wrapper relative">
          {thumbnail ? (
            <Image
              src={typeof thumbnail === "string" ? thumbnail : thumbnail.src}
              alt={title}
              className="w-full h-auto rounded-lg"
              width={500} // Adjust this size as needed
              height={300} // Adjust this size as needed
              layout="responsive"
            /> 
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
              <p>Click to Play Video</p>
            </div>
          )}
          <div className="mt-[15px] mb-[11px] flex items-center gap-[10px] px-[14px]">
            <p><VideoPlayerIcon /></p>
            <h3 className="text-[#3A2C23] text-sm">{title}</h3>
          </div>
        </div>
      </div>

      <Modal
       bodyOpenClassName="overflow-hidden"
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Open Camera"
        className="modal w-full md:max-w-[70%] h-[70vh] md:h-[90vh] p-2 md:p-10 pt-[50px]  rounded-[20px] overflo-custom overflow-y-auto relative bg-white "
        overlayClassName="z-[10] px-2 md:p-0 w-full h-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className=" ">
            <button
              className="absolute z-10 top-4 right-5"
              onClick={closeModal}
            > <CrossIcon />
            </button>
            <ReactPlayer
              url={videoSrc}
              width="100%"
              height="100%"
              controls={true}
            />
           <div className="flex items-center justify-end gap-5 mt-5">
            <button><ShareIcon /> </button>
           <button
              className="w-[168px] text-center text-sm bg-[#E87223] text-white py-[15px] px-6 rounded-[5px] "
              onClick={handleDownload}
            > Download </button>
           </div>
          </div>
    </Modal>
    </>
  );
};

export default VideoCards;
