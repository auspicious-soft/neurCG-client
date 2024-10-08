"use client";
import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { CrownIcon, FemaleIcon, MaleIcon } from "@/utils/svgIcons";
import { space } from "postcss/lib/list";
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
    audioSrc: "/public/assets/audio/audio1.mp3",
  },
  {
    value: "sanya_jean",
    label: "Sanya Jean",
    gender: "female",
    audioSrc: "/public/assets/audio/audio2.mp3",
  },
  // Add more voices as needed
];

const TextSelection = () => {
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const handleVoiceSelect = (option: VoiceOption | null) => {
    setSelectedVoice(option);
  };

  const playAudio = (audioSrc: string) => {
    const audio = new Audio(audioSrc);
    audio.play();
  };

  const playAudioWithStopPropagation = (
    audioSrc: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent the click event from selecting the option
    playAudio(audioSrc);
  };

  const formatOptionLabel = (option: VoiceOption) => (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-[10px]  ">
        {option.label}{" "}
        {option.gender === "male" ? (
          <span><MaleIcon /> </span>
          // <span className="text-blue-500">♂</span>
        ) : (
          // <span className="text-pink-500">♀</span>
          <span><FemaleIcon /> </span>
        )}
      </span>
      <SpeakerWaveIcon
        className="h-5 w-5 text-gray-500 cursor-pointer"
        onClick={(e) => playAudioWithStopPropagation(option.audioSrc, e)}
      />
    </div>
  );

  return (
    <div className="mt-5 bg-white rounded-lg p-[15px] md:p-[30px] shadow-[0_0_40px_0_rgba(235,130,60,0.06)]">
      <h2  
      className={`section-title dropdown-title ${isOpen ? 'active' : ''}`}
      onClick={toggleOpen}>
        Text</h2>
    <div ref={contentRef}
                className={` overflow-hidden transition-[max-height] duration-500 ease-in-out`}
                style={{
                    maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
                    opacity: isOpen ? 1 : 0,
                }}>
    <div className="mt-5 text-selecion grid md:grid-cols-[minmax(0,_7fr)_minmax(0,_5fr)] gap-5">
        <div>
          <label htmlFor="" className="grid gap-2">
            Enter Your Text Here
            <textarea name="" id="" rows={5} className="text-area md:h-[240px]"></textarea>
          </label>
        </div>
        <div>
          <label htmlFor="" className="grid gap-2 mb-5">
            Text Language
            <select name="" id="">
              <option value="">Language Select</option>
              <option value="">Language 1</option>
              <option value="">Language 2</option>
            </select>
          </label>
         <div className="mb-5">
         <PreferredVoice />
         </div>
          {/* <label htmlFor="" className="grid gap-2 mb-5">
            Preferred Voice
            <Select
              options={voiceOptions}
              formatOptionLabel={formatOptionLabel}
              isSearchable
              className="custom-select outline-none text-[#828282]"
              placeholder="Select Voice"
              onChange={handleVoiceSelect}
            />
          </label> */}
          <label htmlFor="" className="grid gap-2">
           <p className="flex justify-between items-center font-inter"> Use Your Own Voice 
            <span className="flex items-center gap-2 text-xs"><CrownIcon />Premium </span></p>
            <div className="flex items-center justify-between  relative border border-[#FFE2CE] py-2 pl-[18px] pr-[5px] md:pr-2 rounded-[5px] h-[45px] md:h-[50px] ">
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
            <div className="w-full flex items-center justify-between "> 
              <p className="text-[#828282] text-sm ">Browse</p>
              <button className="text-xs bg-[#E87223] text-white px-[28px] py-[9px] rounded-[3px] ">Browse</button> </div>
            </div>
          </label>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TextSelection;
