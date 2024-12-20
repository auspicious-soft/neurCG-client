'use client'
import Tabs from '@/components/Tabs';
import React from 'react';
import thumbimg1 from "@/assets/images/video1.png"
import thumbimg2 from "@/assets/images/video2.png"
import thumbimg3 from "@/assets/images/video3.png"
import thumbimg4 from "@/assets/images/video4.png"
import NeurcgCard from "@/components/NeurcgCard"
import { redirect } from 'next/navigation';
import { getUserProjects } from '@/services/user-service';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import ProjectMap from '@/components/project-map';
import GoogleAd from '@/components/hooks/google-ads';

const VideoData = [
  {
    id: 1,
    title: "Lorem Ipsum Dummy Title",
    thumbnail: thumbimg1,
    url: "https://youtu.be/K4TOrB7at0Y?si=zFMHw8k0jDjXiGMi"
  },
  {
    id: 2,
    title: "Lorem Ipsum Dummy Title",
    thumbnail: thumbimg2,
  },
  {
    id: 3,
    title: "Lorem Ipsum Dummy Title",
    thumbnail: thumbimg3
  },
  {
    id: 4,
    title: "Lorem Ipsum Dummy Title",
    thumbnail: thumbimg4
  },
]


const Home = () => {
  const session = useSession()
  const { data: projectData } = useSWR(`/user/${session?.data?.user?.id}/projects`, getUserProjects)
  const ClientVideos = projectData?.data?.data?.recentProjects
  if (!session?.data) {
    redirect("/login")
  }

  return (
    <div>
      <Tabs />
      <section className=''>
        <h2 className='section-title mb-[10px] md:mb-5'>How to use Maity</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {VideoData.map((data) => (
            <NeurcgCard
              key={data.id}
              title={data.title}
              thumbnail={data.thumbnail}
              url={data.url}
            />
          ))}
        </div>
      </section>
      <section className='mt-[30px] md:mt-[50px]'>
        <h2 className="section-title mb-[10px] md:mb-5">Recent</h2>
        <ProjectMap data={ClientVideos} isDeletable={false} />
      </section>
    </div>
  );
}

export default Home;
