"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  CrossIcon,
  ShareIcon,
  VideoPlayerIcon,
  DeleteIcon,
} from "@/utils/svgIcons";
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
  isDeletable: boolean;
  mutate?: any;
  id?: string;
}

const VideoCards: React.FC<VideoCardProps> = ({
  videoSrc,
  title,
  thumbnail,
  isDeletable,
  mutate,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  const handleCardClick = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  };

  const handleDownload = () => {
    fetch(videoSrc)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], `${title || "video"}.mp4`, {
          type: "video/mp4",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.target = "_blank";
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(() => {
        toast.error("Failed to download video");
      });
  };

  const handleLocalShare = async (e: any) => {
    e.stopPropagation();

    try {
      const response = await fetch(videoSrc);
      const blob = await response.blob();
      const file = new File([blob], `${title || "video"}.mp4`, {
        type: "video/mp4",
      });

      const shareData = {
        title: title,
        files: [file],
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        toast.error("Sharing not supported on this device");
      }
    } catch (error) {
      toast.error("Failed to share content");
    }

    setIsDropdownOpen(false);
  };

  const handleSocialShare = async (platform: 'facebook' | 'twitter') => {
    try {
      // Fetch the video/image file
      const response = await fetch(videoSrc);
      const blob = await response.blob();

      // Create a File object from the blob
      const file = new File([blob], `${title || "video"}.mp4`, {
        type: response.headers.get('content-type') || 'video/mp4'
      });

      let result: any;
      if (platform === 'facebook') {
        // result = await shareToFacebook(file, title);
      } else {
        // result = await shareToTwitter(file, title);
      }

      if (result.success) {
        toast.success(`Successfully shared on ${platform}`);
      } else {
        throw new Error(result.error || `Failed to share on ${platform}`);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to share on ${platform}`);
      console.error('Share error:', error);
    }

    setIsDropdownOpen(false);
  };

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const res = await deleteProject(`/user/projects/${id}`);
        if (res.status === 200) {
          console.log("Video Deleted Successfully");
          window.location.reload();
          setIsDeleteOpen(false);
          toast.success("Video Deleted Successfully");
        }
      } catch (error) {
        toast.error("Failed to delete video");
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !(dropdownRef as any).current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      <div
        className="p-1 rounded-lg bg-white cursor-pointer relative"
        onClick={handleCardClick}
      >
        {isDeletable && (
          <button
            className="absolute top-2 right-2 z-[1]"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteOpen(true);
            }}
          >
            <DeleteIcon />
          </button>
        )}
        <div className="player-wrapper relative h-full flex flex-col gap-4">
          {thumbnail ? (
            <div className="h-auto">
              <Image
                src={thumbnail}
                alt={title}
                className="w-full rounded-lg object-fit"
                width={500}
                height={300}
                layout="responsive"
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
              <p>Click to Play Video</p>
            </div>
          )}
          <div className="mt-auto mb-[11px] flex items-center gap-[10px] px-[14px]">
            <p>
              <VideoPlayerIcon />
            </p>
            <h3 className="text-[#3A2C23] text-sm ">{title}</h3>
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
          <div className="flex items-center justify-end gap-5 mt-5 relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <ShareIcon />
            </button>

            {isDropdownOpen && (
              <div ref={dropdownRef} className="absolute left-0 bottom-14 bg-white shadow-md rounded mt-2 border-[1px]">
                <button
                  onClick={handleLocalShare}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-left"
                >
                  Share Locally
                </button>
                <button
                  onClick={() => handleSocialShare('facebook')}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-left"
                >
                  Share on Facebook
                </button>
                <button
                  onClick={() => handleSocialShare('twitter')}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 text-left"
                >
                  Share on Twitter
                </button>
              </div>
            )}

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
        <Image
          src={deleteCross}
          alt="delete"
          height={174}
          width={174}
          className="mx-auto"
        />
        <h2 className="text-[20px] text-center leading-normal">
          Are you sure you want to Delete?
        </h2>
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