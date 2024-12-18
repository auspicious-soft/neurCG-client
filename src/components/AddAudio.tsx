"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  CrossIcon,
  DeleteIcon,
  PauseIcon,
  PlayIcon,
  UploadIcon,
} from "@/utils/svgIcons";
import { AudioVisualizer } from "react-audio-visualize";

const AddAudio = (props: any) => {
  const [blob, setBlob] = useState<Blob | null>();
  const visualizerRef = useRef<HTMLCanvasElement>(null);
  const { preferredVoice, setPreferredVoice, recordedVoice, setRecordedVoice } = props;
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [leftAudioUrl, setLeftAudioUrl] = useState<string | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Pause state
  const [showPreview, setShowPreview] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null); // Tracks start time for accurate duration

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        contentRef.current.style.maxHeight =
          contentRef.current.scrollHeight + "px";
        contentRef.current.style.opacity = "1";
      } else {
        contentRef.current.style.maxHeight = "0px";
        contentRef.current.style.opacity = "0";
      }
    }
  }, [isOpen]);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreferredVoice(e.target.files[0]);
      setRecordedVoice(null);
      setIsRecording(false);
      setAudioURL(null);
      const audioUrl = URL.createObjectURL(e.target.files[0]);
      setLeftAudioUrl(audioUrl);
    }
  };

  const handleRemoveAudio = () => {
    setPreferredVoice(null);
    setLeftAudioUrl(null);
  };
  const supportedMimeTypes = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg",
    "audio/wav",
    "audio/mp4"
  ];

  const handleStartRecording = () => {
    if (!isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          // Check supported MIME types
          let mimeType = supportedMimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || "audio/webm";

          if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
            mimeType = "audio/webm;codecs=opus";
          }

          // Initialize recorder with chunks array
          const chunks: BlobPart[] = [];
          const newRecorder = new MediaRecorder(stream, {
            mimeType: mimeType,
          });

          const audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          analyser.fftSize = 2048;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          setRecorder(newRecorder);
          audioContextRef.current = audioContext;

          // Start recording
          newRecorder.start();
          setIsRecording(true);
          setIsPaused(false);
          startTimeRef.current = Date.now();

          // Improved blob creation for visualization
          timerRef.current = setInterval(() => {
            const elapsed = (Date.now() - (startTimeRef.current || 0)) / 1000;
            setRecordingTime(Math.round(elapsed));

            // Create blob only if chunks are not empty
            if (chunks.length > 0) {
              const updatedBlob = new Blob(chunks, { type: mimeType });

              // Verify blob before setting
              if (updatedBlob.size > 0) {
                setBlob(updatedBlob);
              }
            }
          }, 1000);

          // Collect data chunks as they become available
          newRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunks.push(e.data);
            }
          };

          // Handle recording stop
          newRecorder.onstop = () => {
            // Create the final Blob from all chunks
            const audioBlob = new Blob(chunks, { type: mimeType });

            // Create a File object
            const audioFile = new File([audioBlob], `audio-${new Date().getTime()}.wav`, {
              type: 'audio/wav',
              lastModified: Date.now(),
            });

            // Store the file
            setAudioBlob(audioFile);
            setAudioURL(URL.createObjectURL(audioFile));
            setRecordedVoice(audioFile);
            setPreferredVoice(null);
            setShowPreview(true);

            // Cleanup
            stream.getTracks().forEach((track) => track.stop());
            if (timerRef.current) {
              clearInterval(timerRef.current as NodeJS.Timeout);
            }
            setIsRecording(false);

            // Keep a final blob for potential visualization
            if (audioBlob.size > 0) {
              setBlob(audioBlob);
            } else {
              setBlob(null);
            }
          };
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
          if (error.name === "NotFoundError") {
            alert("Media device not found");
          }
        });
    } else {
      if (recorder) {
        recorder.stop();
      }
    }
  };

  const handlePauseRecording = () => {
    if (recorder && isRecording) {
      if (!isPaused) {
        recorder.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current); // Stop the timer when paused
        }
        setIsPaused(true);
      } else {
        recorder.resume();
        startTimeRef.current = Date.now() - recordingTime * 1000; // Adjust the start time
        timerRef.current = setInterval(() => {
          const elapsed = (Date.now() - (startTimeRef.current || 0)) / 1000;
          setRecordingTime(Math.round(elapsed));
        }, 1000);
        setIsPaused(false);
      }
    }
  };

  const handleAudioPlay = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioPause = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleRecordingReset = () => {
    setAudioURL(null);
    setRecordingTime(0);
    setIsPlaying(false);
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <div className="mt-5 bg-white rounded-lg p-[15px] md:p-[30px] shadow-[0_0_40px_0_rgba(235,130,60,0.06)]">
      <h2
        className={`section-title dropdown-title ${isOpen ? "active" : ""}`}
        onClick={toggleOpen}
      >
        Audio
      </h2>
      <div
        ref={contentRef}
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out`}
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="text-selecion mt-5 flex md:flex-row flex-col gap-y-5 lg:items-center">
          <div className="lg:w-1/2 md:w-[45%]">
            <label htmlFor="" className="grid mb-2">
              Upload Audio
            </label>
            <div className="custom border-dashed border-[#E87223] border relative h-[146px] rounded-[5px]">
              <input
                className="absolute z-[1] top-0 left-0 h-full w-full opacity-0 cursor-pointer"
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
              />
              {preferredVoice ? (
                <div className="relative z-[3] h-full grid place-items-center">
                  <audio
                    src={leftAudioUrl as string}
                    className="rounded-[5px] object-cover w-full"
                    controls
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 z-[2]"
                    onClick={handleRemoveAudio}
                  >
                    <CrossIcon />
                  </button>
                </div>
              ) : (
                <div className="grid place-items-center h-full w-full">
                  <div className="text-center grid justify-items-center">
                    <UploadIcon />
                    <h3 className="text-[#6B6B6B] text-sm font-[500] mt-[18px]">
                      Drag & drop the audio of your choice
                    </h3>
                    <h3 className="text-[#6B6B6B] text-sm">
                      or{" "}
                      <span className="text-[#E87223] cursor-pointer">
                        browse file
                      </span>{" "}
                      from device
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>
          <h3 className="md:w-[15%] lg:w-[10%] mx-[20px] 2xl:mx-[45px] flex justify-center items-center text-[#6B6B6B] text-sm italic">
            —— Or ——
          </h3>
          <div className="md:w-[40%]">
            <label htmlFor="recordAudio" className="grid mb-2">
              Record Audio
            </label>
            <div className="relative rounded-[5px]">
              {!audioURL ? (
                <div className="relative h-full flex flex-col justify-center items-center">
                  <div className="h-16 border border-[#FFE2CE] flex w-full items-center rounded-[5px] gap-2 ">
                    <span className="ml-4">{formatTime(recordingTime)}</span>
                    <div>
                      {isRecording && blob && (
                        <AudioVisualizer
                          ref={visualizerRef}
                          blob={blob}
                          width={500}
                          height={75}
                          barWidth={1}
                          gap={0}
                          barColor={"#E87223"}

                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full mt-5">
                    <div>
                      {isRecording && (
                        <div className="flex items-center gap-3">
                          <button className="" onClick={handlePauseRecording}>
                            {isPaused ? <PlayIcon /> : <PauseIcon />}
                          </button>
                          <button
                            disabled
                            className="disabled-button cursor-not-allowed "
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      )}
                    </div>
                    <button
                      className="button md:!h-[32px] !text-xs"
                      onClick={handleStartRecording}
                    >
                      {isRecording ? "Stop Recording" : "Start Recording"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <audio
                    ref={audioPlayerRef}
                    src={audioURL}
                    controls
                    className="w-full"
                  />
                  <div className="flex justify-between items-center w-full px-2 mt-5">
                    <div className="flex items-center gap-3">
                      {isPlaying ? (
                        <button className="" onClick={handleAudioPause}>
                          {" "}
                          <PauseIcon />
                        </button>
                      ) : (
                        <button className="" onClick={handleAudioPlay}>
                          {" "}
                          <PlayIcon />
                        </button>
                      )}
                      <button
                        className=""
                        onClick={() => {
                          setRecordedVoice(null);
                          setIsRecording(false);
                          setAudioURL(null);
                          setRecordingTime(0)
                        }}
                      >
                        {" "}
                        <DeleteIcon />
                      </button>
                    </div>
                    <div>
                      <button className="md:!h-[32px] !text-xs button !text-[#E87223] !bg-white border-[#E87223] border rounded-lg mr-3">
                        Preview
                      </button>
                      {/* <button className="lg:!h-[32px] md:min-w-[145px] !text-xs button">Done</button> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAudio;
