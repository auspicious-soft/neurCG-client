"use client";
import React, { useState, useRef, useEffect } from "react";
import { VideoCameraIcon } from "@heroicons/react/24/solid"; // Assuming you have this icon or any other
import { CrossIcon, UploadIcon } from "@/utils/svgIcons";

const AddVideo = (props: any) => {
  const { setVideoUploaded, setOriginalText, setTranslatedText } = props
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        contentRef.current.style.maxHeight = contentRef.current.scrollHeight + "px";
        contentRef.current.style.opacity = "1";
      } else {
        contentRef.current.style.maxHeight = "0px";
        contentRef.current.style.opacity = "0";
      }
    }
  }, [isOpen]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoUploaded(e.target.files[0])
      const videoUrl = URL.createObjectURL(e.target.files[0]);
      setPreviewVideo(videoUrl);
    }
  }

  const handleRemoveVideo = () => {
    setPreviewVideo(null)
    setVideoUploaded(null)
  };

  return (
    <div className="md:mt-5 bg-white rounded-lg p-[15px] md:p-[30px]  shadow-[0_0_40px_0_rgba(235,130,60,0.06)]">
      <h2
        className={`section-title dropdown-title ${isOpen ? 'active' : ''}`}
        onClick={toggleOpen}>
        Video
      </h2>
      <div ref={contentRef}
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out`}
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
          opacity: isOpen ? 1 : 0,
        }}>
        <div className="text-selecion mt-5 grid md:grid-cols-[minmax(0,_7fr)_minmax(0,_5fr)] gap-5">
          <div>
            <label htmlFor="" className="grid mb-2">
              Upload Video
            </label>
            <div className="custom border-dashed border-[#E87223] border relative h-[146px] rounded-[5px]">
              <input
                className="absolute z-[1] top-0 left-0 h-full w-full opacity-0 cursor-pointer"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
              />
              {previewVideo ? (
                <div className="relative h-full z-[2]">
                  <video
                    src={previewVideo}
                    className="rounded-[5px] object-contain h-full w-full"
                    controls
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 "
                    onClick={handleRemoveVideo}
                  ><CrossIcon />
                  </button>
                </div>
              ) : (
                <div className="grid place-items-center h-full w-full">
                  <div className="text-center grid justify-items-center ">
                    <UploadIcon />
                    {/* <VideoCameraIcon className="h-10 w-10 text-[#283c63]" /> */}
                    <h3 className="text-[#6B6B6B] text-sm font-[500] mt-[18px]">
                      Drag & drop the video of your choice
                    </h3>
                    <h3 className="text-[#6B6B6B] text-sm">
                      or <span className="text-[#E87223] cursor-pointer">browse file</span> from device
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="" className="grid gap-2 mb-5">
              Original Language
              <select required name="" id="" onChange={(e) => setOriginalText(e.target.value)}>
                <option value=""  >Original Language</option>
                <option value="English"  >English</option>
                <option value="Spanish"  >Spanish</option>
                <option value="French"  >French</option>
                <option value="German"  >German</option>
                <option value="Italian"  >Italian</option>
                <option value="Japanese"  >Japanese</option>
                <option value="Korean"  >Korean</option>
                <option value="Portuguese"  >Portuguese</option>
                <option value="Russian"  >Russian</option>
                <option value="Chinese"  >Chinese</option>
              </select>
            </label>
            <label htmlFor="" className="grid gap-2">
              Translational Language
              <select required name="" id="" onChange={(e) => setTranslatedText(e.target.value)}>
                <option value=""> Translational Language</option>
                <option value="English"  >English</option>
                <option value="Spanish"  >Spanish</option>
                <option value="French"  >French</option>
                <option value="German"  >German</option>
                <option value="Italian"  >Italian</option>
                <option value="Japanese"  >Japanese</option>
                <option value="Korean"  >Korean</option>
                <option value="Portuguese"  >Portuguese</option>
                <option value="Russian"  >Russian</option>
                <option value="Chinese"  >Chinese</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVideo;
