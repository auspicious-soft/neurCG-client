"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { CrossIcon, ShareIcon, VideoPlayerIcon, DeleteIcon } from "@/utils/svgIcons";
import Image from "next/image";
import Modal from "react-modal";
import deleteCross from "@/assets/images/delete.svg";
import { toast } from "sonner";
import { deleteProject } from "@/services/user-service";
import { useRouter } from "next/navigation";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoCardProps {
  videoSrc: string;
  title: string;
  thumbnail?: string;
  isDeletable?: boolean;
  mutate?: any
  id?: string
}

const VideoCards: React.FC<VideoCardProps> = ({
  videoSrc,
  title,
  thumbnail,
  isDeletable,
  mutate,
  id
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const handleCardClick = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoSrc;
    link.target = "_blank";
    link.download = title || "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const res = await deleteProject(`/user/projects/${id}`)
        if (res.status === 200) {
          console.log("Video Deleted Successfully")
          window.location.reload()
          setIsDeleteOpen(false)
          toast.success("Video Deleted Successfully");
        }
      }
      catch (error) {
        console.log("Failed to delete video", error)
        toast.error("Failed to delete video");
      }
    })
  };

  return (
    <>
      <div
        className="p-1 rounded-lg bg-white cursor-pointer relative"
        onClick={handleCardClick}
      >
        {isDeletable && (
          <button
            className="absolute top-2 right-2 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteOpen(true);
            }}
          >
            <DeleteIcon />
          </button>
        )}
        <div className="player-wrapper relative">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              className="w-full h-auto rounded-lg"
              width={500}
              height={300}
              layout="responsive"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
              <p>Click to Play Video</p>
            </div>
          )}
          <div className="mt-[15px] mb-[11px] flex items-center gap-[10px] px-[14px]">
            <p>
              <VideoPlayerIcon />
            </p>
            <h3 className="text-[#3A2C23] text-sm">{title}</h3>
          </div>
        </div>
      </div>

      <Modal
        bodyOpenClassName="overflow-hidden"
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Open Camera"
        className="modal w-full md:max-w-[45%] h-auto p-2 md:p-10 pt-[50px] rounded-[20px] overflow-y-auto relative bg-white"
        overlayClassName="z-[10] px-2 md:p-0 w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div>
          <button className="absolute z-10 top-4 right-5" onClick={closeModal}>
            <CrossIcon />
          </button>
          <div className="h-[500px]">
            <ReactPlayer url={videoSrc} width="100%" height="100%" controls />
          </div>
          <div className="flex items-center justify-end gap-5 mt-5">
            <button>
              <ShareIcon />
            </button>
            <button
              className="w-[168px] text-center text-sm bg-[#E87223] text-white py-[15px] px-6 rounded-[5px]"
              onClick={handleDownload}
            >
              Download
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        onRequestClose={() => setIsDeleteOpen(false)}
        contentLabel="Delete Video"
        bodyOpenClassName="overflow-hidden"
        className="modal w-full md:max-w-[45%] h-auto p-5 rounded-[20px] overflow-y-auto relative bg-white"
        overlayClassName="z-[10] px-2 md:p-0 w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <Image src={deleteCross} alt="delete" height={174} width={174} className="mx-auto" />
        <h2 className="text-[20px] text-center leading-normal">Are you sure you want to Delete?</h2>
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            type="button"
            onClick={handleDelete}
            className="py-[10px] px-8 bg-[#E87223] text-white rounded"
          >
         {isPending ? "Deleting..." : "Yes Delete"}
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(false)}
            className="py-[10px] px-8 bg-[#3A2C23] text-white rounded"
          >
            No
          </button>
        </div>
      </Modal>
    </>
  );
};

export default VideoCards;