import React from "react";
import thumbimg1 from "@/assets/images/video1.png";
import thumbimg2 from "@/assets/images/video2.png";
import thumbimg3 from "@/assets/images/video3.png";
import thumbimg4 from "@/assets/images/video4.png";
import VideoCards from "@/components/VideoCards";
import useSWR from "swr";
import { getUserProjects } from "@/services/user-service";
import { auth } from "@/auth";
import { getImageUrl } from "@/actions";
import { getImageUrlOfS3 } from "@/utils";



const Page = async () => {
  const session = await auth()
  const response = await getUserProjects(`/user/${session?.user?.id}/projects`)
  const data = await response.data
  const ClientVideos = data?.data?.recentProjects
  const LastMonthData = data?.data?.oldProjects
  return (
    <div>
      <section className="my-projects-recent">
        <h2 className="section-title mb-[10px] md:mb-5">Recent</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {ClientVideos?.map((data:any) => (
            <VideoCards
              key={data._id}
              title={data.projectName}
              thumbnail={getImageUrlOfS3(data.projectAvatar as string)}
              videoSrc={data.projectVideoLink}
            />
          ))}
        </div>
      </section>
      <section className="last-months mt-[30px] md:mt-[40px]">
        <h2 className="section-title mb-[10px] md:mb-5">Last Month</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {LastMonthData?.map((data:any) => (
            <VideoCards
              key={data._id}
              title={data.projectName}
              thumbnail={getImageUrlOfS3(data.projectAvatar as string)}
              videoSrc={data.projectVideoLink}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
