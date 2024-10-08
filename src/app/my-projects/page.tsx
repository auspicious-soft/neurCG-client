import React from "react";
import thumbimg1 from "@/assets/images/video1.png";
import thumbimg2 from "@/assets/images/video2.png";
import thumbimg3 from "@/assets/images/video3.png";
import thumbimg4 from "@/assets/images/video4.png";
import VideoCards from "@/components/VideoCards";

const ClientVideos = [
  {
    id: 1,
    title: "Lorem Ipsum Dummy Title",
    thumbnail: thumbimg1,
    videoSrc: "/assets/videos/file.mp4",
  },
  {
    id: 2,
    title: "Lorem Ipsum Dummy Title",
    thumbnail: thumbimg2,
    videoSrc: "/assets/videos/video1.mp4",
  },
  {
    id: 3,
    title: "Lorem Ipsum Dummy Title",
    thumbnail: thumbimg3,
    videoSrc: "/assets/videos/video1.mp4",
  },
];
const LastMonthData = [
  {
    id: 1,
    title: "Lorem Ipsum Dummy Title",
    thumbnail: thumbimg1,
    videoSrc: "/assets/videos/video1.mp4",
  },
  {
    id: 2,
    title: "Lorem Ipsum Dummy Title",
    thumbnail: thumbimg2,
    videoSrc: "/assets/videos/video1.mp4",
  },
  {
    id: 3,
    title: "Lorem Ipsum Dummy Title",
    thumbnail: thumbimg3,
    videoSrc: "/assets/videos/video1.mp4",
  },
  {
    id: 4,
    title: "Lorem Ipsum Dummy Title",
    thumbnail: thumbimg4,
    videoSrc: "/assets/videos/video1.mp4",
  },
  {
    id:5,
    title: "Lorem Ipsum Dummy Title",
    thumbnail: thumbimg2,
    videoSrc: "/assets/videos/video1.mp4"
  },
  {
    id:6,
    title: "Lorem Ipsum Dummy Title",
    thumbnail: thumbimg3,
    videoSrc: "/assets/videos/video1.mp4"
  },
];
const Page = () => {
  return (
    <div>
      <section className="my-projects-recent">
        <h2 className="section-title mb-[10px] md:mb-5">Recent</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {ClientVideos.map((data) => (
            <VideoCards
              key={data.id}
              title={data.title}
              thumbnail={data.thumbnail}
              videoSrc={data.videoSrc}
            />
          ))}
        </div>
      </section>
      <section className="last-months mt-[30px] md:mt-[40px]">
        <h2 className="section-title mb-[10px] md:mb-5">Last Month</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {LastMonthData.map((data) => (
            <VideoCards
              key={data.id}
              title={data.title}
              thumbnail={data.thumbnail}
              videoSrc={data.videoSrc}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
