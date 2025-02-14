"use client";
import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { CrownIcon, FemaleIcon, MaleIcon } from "@/utils/svgIcons";
import PreferredVoice from "./PreferredVoice";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { getUserInfo } from "@/services/user-service";

interface VoiceOption {
  value: string;
  label: string;
  gender: "male" | "female";
  audioSrc: string;
}


interface TextSelectionProps {
  setText: (text: string) => void;
  setTextLanguage: (language: string) => void;
  setPreferredVoice: React.Dispatch<React.SetStateAction<string | File | null>>; // Updated to handle both string and File
  preferredVoice: string | File | null
  text: string
}

const TextSelection: React.FC<TextSelectionProps> = ({ setText, setTextLanguage, setPreferredVoice, preferredVoice, text }) => {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(true);
  const [customVoice, setCustomVoice] = useState<string | null>(null);
  const [customVoiceFileName, setCustomVoiceFileName] = useState<string | null>(null)
  const contentRef = useRef<HTMLDivElement>(null);
  const { data } = useSWR(session.data?.user?.id ?`/user/${session.data?.user?.id}` : null, getUserInfo, { revalidateOnFocus: false });
  const planType = data?.data?.data?.planType;
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  }
  const [isPredefinedSelected, setIsPredefinedSelected] = useState(false);

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
    setIsPredefinedSelected(typeof preferredVoice === "string")
    if (isPredefinedSelected) {
      setCustomVoice(null);
      setCustomVoiceFileName(null);
    }
  }, [isOpen, isPredefinedSelected, preferredVoice]);


  const playAudio = (audioSrc: string) => {
    const audio = new Audio(audioSrc);
    audio.play();
  };

  const playAudioWithStopPropagation = (audioSrc: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the click event from selecting the option
    playAudio(audioSrc);
  };

  const handleCustomVoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setCustomVoice(fileUrl);
      setPreferredVoice(file); // Set the file object
      setCustomVoiceFileName(file.name); // Set the file name
      playAudio(fileUrl);
    }
  };

  const formatOptionLabel = (option: VoiceOption) => (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-[10px]">
        {option.label}{" "}
        {option.gender === "male" ? (
          <span><MaleIcon /></span>
        ) : (
          <span><FemaleIcon /></span>
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
        onClick={toggleOpen}
      >
        Text
      </h2>
      <div
        ref={contentRef}
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out`}
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="mt-5 text-selecion grid md:grid-cols-[minmax(0,_7fr)_minmax(0,_5fr)] gap-5">
          <div>
            <label htmlFor="" className="grid gap-2">
              Enter Your Text Here
              <textarea
                name=""
                id=""
                rows={5}
                required
                value={text}
                className="text-area md:h-[240px]"
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </label>
          </div>
          <div>
            <label htmlFor="" className="grid gap-2 mb-5">
              Text Language
              <select required name="" id="" onChange={(e) => setTextLanguage(e.target.value)}>
                <option value=""  >Language Select</option>
                <option value="English"  >English</option>
                <option value="Spanish"  >Spanish</option>
                <option value="French"  >French</option>
                <option value="German"  >German</option>
                <option value="Italian"  >Italian</option>
                <option value="Portuguese"  >Portuguese</option>
                <option value="Polish"  >Polish</option>
              </select>
            </label>
            <div className="mb-5">
              <PreferredVoice setPreferredVoice={setPreferredVoice} preferredVoice={preferredVoice} />
            </div>
            <label htmlFor="" className="grid gap-2">
              <p className="flex justify-between items-center font-inter">
                Use Your Own Voice
                <span className="flex items-center gap-2 text-xs"><CrownIcon />Premium</span>
              </p>
              <div className="flex items-center justify-between relative border border-[#FFE2CE] py-2 pl-[18px] pr-[5px] md:pr-2 rounded-[5px] h-[45px] md:h-[50px]">
                <input
                  type="file"
                  accept="audio/*"
                  disabled={planType !== 'pro'}
                  onChange={handleCustomVoiceChange}
                  className={`${planType !== 'pro' && 'cursor-not-allowed'} absolute top-0 left-0 h-full w-full opacity-0 !p-0`}
                />
                <div className="w-full flex items-center justify-between">
                  <p className="text-[#828282] text-sm">{customVoiceFileName || "Browse"}</p> {/* Display file name or "Browse" */}
                  <button className="text-xs bg-[#E87223] text-white px-[28px] py-[9px] rounded-[3px]">Browse</button>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSelection;