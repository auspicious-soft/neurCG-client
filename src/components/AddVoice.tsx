"use client";
import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { CrownIcon, FemaleIcon, MaleIcon } from "@/utils/svgIcons";
import PreferredVoice from "./PreferredVoice";

interface VoiceOption {
  value: string;
  label: string;
  gender: "male" | "female";
  audioSrc: string;
}

const voiceOptions: VoiceOption[] = [
  {
    value: "david_gotham",
    label: "David Gotham",
    gender: "male",
    audioSrc: "/assets/audio/audio1.mp3",
  },
  {
    value: "sanya_jean",
    label: "Sanya Jean",
    gender: "female",
    audioSrc: "/assets/audio/audio2.mp3",
  },
  // Add more voices as needed
];

const AddVoice = () => {
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [menuPortalTarget, setMenuPortalTarget] = useState<HTMLElement | null>(null);

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

  useEffect(() => {
    if (typeof document !== "undefined") {
      setMenuPortalTarget(document.body);
    }
  }, []);


  const playAudio = (audioSrc: string) => {
    const audio = new Audio(audioSrc);
    audio.play();
  };


  return (
    <div className="mt-5 bg-white rounded-lg p-[15px] md:p-[30px]  shadow-[0_0_40px_0_rgba(235,130,60,0.06)]">
      <h2
        className={`section-title dropdown-title ${isOpen ? "active" : ""}`}
        onClick={toggleOpen}
      >
        Voice
      </h2>
      <div
        ref={contentRef}
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out`}
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="text-selecion mt-5 flex md:flex-row flex-col items-center gap-5">
          <div className="md:min-w-[359px] min-w-full ">
          <PreferredVoice />
          </div>
          <label htmlFor="" className="grid gap-2 w-full max-w-[359px]">
            <p className="flex justify-between items-center font-inter">
              Use Your Own Voice
              <span className="flex items-center gap-2 text-xs">
                <CrownIcon />
                Premium
              </span>
            </p> 
            <div className="flex items-center justify-between relative border border-[#FFE2CE] py-2 pl-[18px] pr-2 rounded-[5px] h-[50px]">
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fileUrl = URL.createObjectURL(file);
                    playAudio(fileUrl);
                  }
                }}
                className="absolute top-0 left-0 h-full w-full opacity-0 !p-0"
              />
              <div className="w-full flex items-center justify-between">
                <p className="text-[#828282] text-sm">Browse</p>
                <button className="text-xs bg-[#E87223] text-white px-[28px] py-[9px] rounded-[3px]">
                  Browse
                </button>
              </div>
            </div>
          </label>
        </div>
      </div>
      
    </div>
  );
};

export default AddVoice;
