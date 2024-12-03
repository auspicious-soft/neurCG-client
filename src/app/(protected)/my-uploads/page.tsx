import React from "react";
import VideoCards from "@/components/VideoCards";
import { auth } from "@/auth";
import { getImageUrlOfS3 } from "@/utils";
import { getUserProjects } from "@/services/user-service";



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
          {ClientVideos?.map((data: any) => (
            <VideoCards
              isDeletable
              key={data._id}
              title={data.projectName}
              thumbnail={getImageUrlOfS3(data.projectAvatar as string)}
              videoSrc={data.projectVideoLink}
              id={data._id}
              // mutate={handleRevalidate}
            />
          ))}
        </div>
      </section>
      <section className="last-months mt-[30px] md:mt-[40px]">
        {LastMonthData.length > 0 && <h2 className="section-title mb-[10px] md:mb-5">Last Month</h2>}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {LastMonthData?.map((data: any) => (
            <VideoCards
              isDeletable
              key={data._id}
              title={data.projectName}
              thumbnail={getImageUrlOfS3(data.projectAvatar as string)}
              videoSrc={data.projectVideoLink}
              id={data._id}
              // mutate={handleRevalidate}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
