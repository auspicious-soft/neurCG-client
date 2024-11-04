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
    value: "male-david-gotham",
    label: "David Gotham",
    gender: "male",
    audioSrc: "/assets/audio/male.wav",
  },
  {
    value: "male-jacob-hardy",
    label: "Jacob Hardy",
    gender: "male",
    audioSrc: "/assets/audio/male2.wav",
  },
  {
    value: "female-sanya-jean",
    label: "Sanya Jean",
    gender: "female",
    audioSrc: "/assets/audio/female.wav", 
  },
  {
    value: "female-marya-jean",
    label: "Marya Jean",
    gender: "female",
    audioSrc: "/assets/audio/female2.wav",
  },
  // Add more voices as needed
];

interface PreferredVoiceProps {
  setPreferredVoice: React.Dispatch<React.SetStateAction<string | File | null>>; // Updated to handle both string and File
  preferredVoice: string | File | null
}

const PreferredVoice: React.FC<PreferredVoiceProps> = ({ setPreferredVoice , preferredVoice}) => {
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingAudioSrc, setPlayingAudioSrc] = useState<string | null>(null); // Track the currently playing audio source
  const [menuPortalTarget, setMenuPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setMenuPortalTarget(document.body);
    }
    if(typeof preferredVoice === 'object') {
      setSelectedVoice(null);
    }
  }, [preferredVoice]);

  const handleVoiceSelect = (option: VoiceOption | null) => {
    setSelectedVoice(option);
    setPreferredVoice(option ? option.value : null); // Set the string value for predefined voices
  }


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
          required
          options={voiceOptions}
          formatOptionLabel={formatOptionLabel}
          isSearchable
          className="custom-select outline-none text-[#828282]"
          classNamePrefix="react-select"
          placeholder="Select Voice"
          value={selectedVoice}
          onChange={handleVoiceSelect}
          menuPortalTarget={menuPortalTarget}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999, borderRadius: 10,
              border: "1px solid silver", }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? "#1967d2" : "white",
              paddingLeft: 6,
              paddingRight: 6,
              paddingTop:3,
              paddingBottom:3,
            }),
          }}
        />
      </label>
    </div>
  );
};

export default PreferredVoice;