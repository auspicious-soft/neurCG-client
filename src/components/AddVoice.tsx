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

const AddVoice = (props: any) => {
  const { preferredVoice, setPreferredVoice } = props
  const session = useSession();
  const { data } = useSWR(`/user/${session.data?.user?.id}`, getUserInfo, { revalidateOnFocus: false });
  const planType = data?.data?.data?.planType;
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [menuPortalTarget, setMenuPortalTarget] = useState<HTMLElement | null>(null);
  const [customVoiceFileName, setCustomVoiceFileName] = useState<string | null>(null)


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

  }, [isOpen])

  useEffect(() => {
    const isPredefinedSelected = typeof preferredVoice === "string";
    if (isPredefinedSelected) {
      setCustomVoiceFileName(null);
    }
  }, [preferredVoice])

  useEffect(() => {
    if (typeof document !== "undefined") {
      setMenuPortalTarget(document.body);
    }
  }, []);

  const playAudio = (audioSrc: string) => {
    const audio = new Audio(audioSrc);
    audio.play();
  }

  const handleCustomVoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('file: ', file);
      const fileUrl = URL.createObjectURL(file);
      // setCustomVoice(fileUrl);
      setPreferredVoice(file); // Set the file object
      console.log('file.name: ', file.name);
      setCustomVoiceFileName(file.name); // Set the file name
      playAudio(fileUrl);
    }
  }

  return (
    <div className="mt-5 bg-white rounded-lg p-[15px] md:p-[30px] shadow-[0_0_40px_0_rgba(235,130,60,0.06)]">
      <div className="flex items-center gap-6 sm:flex-row flex-col">
        <div className="sm:w-[50%] w-full">
          <PreferredVoice
            setPreferredVoice={setPreferredVoice}
            preferredVoice={preferredVoice}
          />
        </div>
        <label htmlFor="" className="grid gap-2 sm:w-[50%] w-full">
          <p className="flex justify-between items-center font-inter">
            Use Your Own Voice
            <span className="flex items-center gap-2 text-xs">
              <CrownIcon />
              Premium
            </span>
          </p>
          <div className="flex items-center justify-between relative border border-[#FFE2CE] py-2 pl-[18px] pr-[5px] md:pr-2 rounded-[5px] h-[45px] md:h-[50px]">
            <input
              type="file"
              accept="audio/*"
              disabled={planType !== "pro"}
              onChange={handleCustomVoiceChange}
              className={`${planType !== "pro" && "cursor-not-allowed"
                } absolute top-0 left-0 h-full w-full opacity-0 !p-0`}
            />
            <div className="w-full flex items-center justify-between">
              <p className="text-[#828282] text-sm">
                {customVoiceFileName || "Browse"}
              </p>
              <button className="text-xs bg-[#E87223] text-white px-[28px] py-[9px] rounded-[3px]">
                Browse
              </button>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default AddVoice;
