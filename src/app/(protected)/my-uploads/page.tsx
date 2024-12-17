import React from "react";
import { auth } from "@/auth";
import { getUserProjects } from "@/services/user-service";
import { containsMyAudio, containsMyImages, containsMyMedia, containsMyVideos } from "@/utils";
import ImageUploads from "@/components/uploads/image-uploads";
import AudioUploads from "@/components/uploads/audio-uploads";
import VideoUploads from "@/components/uploads/video-uploads";



const Page = async () => {
  const session = await auth()
  const response = await getUserProjects(`/user/${session?.user?.id}/projects`)
  const data = await response.data
  const ClientVideos = data?.data?.recentProjects
  const filteredMyUploads = ClientVideos?.filter(containsMyMedia)

  const filteredMyImages = filteredMyUploads?.filter(containsMyImages)
  const filteredMyAudio = filteredMyUploads?.filter(containsMyAudio)
  const filteredMyVideos = filteredMyUploads?.filter(containsMyVideos)

  return (
    <div>
      <section className="my-projects-recent">
        <h2 className="section-title mb-[10px] md:mb-5">Your Images</h2>
        <ImageUploads data={filteredMyImages} />
        <h2 className="section-title mb-[10px] md:mb-5">Your Audios</h2>
        <AudioUploads data={filteredMyAudio} />
        <h2 className="section-title mb-[10px] md:mb-5">Your Videos</h2>
        <VideoUploads data={filteredMyVideos} />
      </section>
    </div>
  );
};

export default Page;
