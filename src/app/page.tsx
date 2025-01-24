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
    title: "Text and Photo to Video",
    thumbnail: thumbimg1,
    url: "https://youtu.be/Vue05PRQXmA"
  },
  {
    id: 2,
    title: "Audio and Photo to Video",
    thumbnail: thumbimg2,
    url: "https://youtu.be/Q__os6uXFos"
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
      <div className='bg-black mb-2'>
        <GoogleAd
          slot="5920617536"  // Replace with your ad slot ID
          // style={{ maxHeight: '300px' }}
        />
      </div>
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
