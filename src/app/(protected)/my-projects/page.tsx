import React from "react";
import { getUserProjects } from "@/services/user-service";
import { auth } from "@/auth";
import ProjectMap from "@/components/project-map";

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
        <ProjectMap data={ClientVideos} isDeletable={true} />
      </section>

      <section className="last-months mt-[30px] md:mt-[40px]">
        {LastMonthData?.length > 0 && <h2 className="section-title mb-[10px] md:mb-5">Last Month</h2>}
        <ProjectMap data={LastMonthData} isDeletable={true} />
      </section>

    </div>
  );
};

export default Page;
