"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { CrownIcon, FemaleIcon, MaleIcon } from "@/utils/svgIcons";

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
  {
    value: "marya_jean",
    label: "Marya Jean",
    gender: "female",
    audioSrc: "/assets/audio/audio3.mp3",
  },
  // Add more voices as needed
];

const PreferredVoice = () => {
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingAudioSrc, setPlayingAudioSrc] = useState<string | null>(null); // Track the currently playing audio source
  const [menuPortalTarget, setMenuPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setMenuPortalTarget(document.body);
    }
  }, []);

  const handleVoiceSelect = (option: VoiceOption | null) => {
    setSelectedVoice(option);
  };

  const playAudio = (audioSrc: string) => {
    if (currentAudio && playingAudioSrc === audioSrc) {
      // If the same audio is playing, pause it
      currentAudio.pause();
      setPlayingAudioSrc(null); // No audio is playing
    } else {
      // If a different audio is playing, stop the current one first
      if (currentAudio) {
        currentAudio.pause();
      }

      const newAudio = new Audio(audioSrc);
      newAudio.play();

      setCurrentAudio(newAudio); // Track the new audio
      setPlayingAudioSrc(audioSrc); // Track the source of the new playing audio
    }
  };

  const playAudioWithStopPropagation = (
    audioSrc: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    playAudio(audioSrc);
  };

  const formatOptionLabel = (option: VoiceOption) => (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-[10px]">
        {option.label}{" "}
        {option.gender === "male" ? (
          <span>
            <MaleIcon />
          </span>
        ) : (
          <span>
            <FemaleIcon />
          </span>
        )}
      </span>
      <SpeakerWaveIcon
        className="h-5 w-5 text-gray-500 cursor-pointer"
        onClick={(e) => playAudioWithStopPropagation(option.audioSrc, e)}
      />
    </div>
  );

  return (
    <div className=" bg-white rounded-lg shadow-[0_0_40px_0_rgba(235,130,60,0.06)]">
        <label htmlFor="" className="grid gap-2">
          Preferred Voice
          <Select
            options={voiceOptions}
            formatOptionLabel={formatOptionLabel}
            isSearchable
            className="custom-select outline-none text-[#828282]"
            classNamePrefix="react-select"
            placeholder="Select Voice"
            onChange={handleVoiceSelect}
            menuPortalTarget={menuPortalTarget}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
        </label>
      </div>    
  );
};

export default PreferredVoice;
