"use client";
import { useState, useEffect } from "react";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { AudioIcon, HomeIcon, ProfileIcon, ProjectsIcon, ReferIcon, TextIcon, VideoIcon, MenuIcon, ToggleClose } from "@/utils/svgIcons"; // Import Hamburger and Close icons
import useSWR from "swr";
import { getUserInfo } from "@/services/user-service";
import { useSession } from "next-auth/react";
import ReactLoading from 'react-loading'


interface SideBarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SideBar = ({ isOpen, toggleSidebar }: SideBarProps) => {
  const pathname = usePathname()
  const session = useSession()
  const { data, isLoading, mutate } = useSWR(`/user/${session.data?.user?.id}`, getUserInfo, { revalidateOnFocus: false })
  const dataOfUser = data?.data.data
  const isActive = (path: string) => pathname === path ? 'active' : '';

  const handleLinkClick = (path: string) => {
    if (isOpen) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  return (
    <div className="side-bar z-2 relative  h-[100%]  flex lg:flex-col justify-between">

      {/* Sidebar */}
      <div className={`fixed z-[3] flex flex-col justify-between overflo-custom  overflow-y-scroll lg:relative top-0 left-0 w-[262px] h-full bg-white transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="pl-[30px] pt-[60px] md:pt-[38px] ">
          <ul className="navList">
            <li className={isActive('/')}>
              <Link href="/"
                onClick={() => handleLinkClick("/")}
              >
                <HomeIcon />
                <span>Home</span>
              </Link>
            </li>
            <li className={isActive('/my-projects')}>
              <Link href="/my-projects" onClick={() => handleLinkClick("/my-projects")}>
                <ProjectsIcon />
                <span>My Projects</span>
              </Link>
            </li>
            <p className="text-[#818999] text-[10px] font-medium mt-5 mb-[2px] pl-5">SERVICES</p>
            <li className={isActive('/text-photo')}>
              <Link href="/text-photo" onClick={() => handleLinkClick("/text-photo")}>
                <TextIcon />
                <span>Text & Photo</span>
              </Link>
            </li>
            <li className={isActive('/audio-photo')}>
              <Link href="/audio-photo" onClick={() => handleLinkClick("/audio-photo")}>
                <AudioIcon />
                <span>Audio & Photo</span>
              </Link>
            </li>
            <li className={isActive('/video-translation')}>
              <Link href="/video-translation" onClick={() => handleLinkClick("/video-translation")}>
                <VideoIcon />
                <span>Video Translation</span>
              </Link>
            </li>
            <p className="text-[#818999] text-[10px] font-medium mt-5 mb-[2px] pl-5">Other</p>
            <li className={isActive('/refer')}>
              <Link href="/refer" onClick={() => handleLinkClick("/refer")}>
                <ReferIcon />
                <span>Refer</span>
              </Link>
            </li>
            <li className={isActive('/my-profile')}>
              <Link href="/my-profile" onClick={() => handleLinkClick("/my-profile")}>
                <ProfileIcon />
                <span>My Profile</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className=" block lg:hidden my-5 px-5">
          <h3 className="bg-[#FFEEE2] font-[500] text-xs text-[#3A2C23] border border-[#FFE2CE] px-6 py-[9px] rounded-full">
            Credits left
            <span className="text-[#E87223] ml-[10px]">{!isLoading ? dataOfUser?.creditsLeft : <ReactLoading type="spin" color="#E87223" height={40} width={40} />}</span>
          </h3>
        </div>
        <div className="md:my-[50px] my-5 mx-[30px]">
          <Link href={'/plans'} className="w-full px-5 h-[50px] py-[10px] text-[#e87223] text-base font-medium bg-white rounded-lg border border-[#e87223]">
            UPGRADE PLAN
          </Link >
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[1] bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />

      )}
    </div>
  );
};

export default SideBar;
