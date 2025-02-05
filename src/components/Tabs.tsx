"use client"
import { DesignIcon, EmojiIcon, RingIcon } from "@/utils/svgIcons";
import Image from "next/image";
import { useState } from "react";
import hangemoji from "@/assets/images/Hand.png";
interface TabContent {
  title: string;
  content: string;
}

const tabsData: TabContent[] = [
  {
    title: "Congrats on your start in MaiTY!",
    content: "Welcome to MaiTY! Now you can start exploring the amazing functionalities MaiTY offers. To help you get started, here's a quick introduction to guide you through everything you can do.",
  },
  {
    title: "Create your digital twin",
    content: "Ready to create your own digital twin? Start by selecting the service you prefer—Text & Photo or Audio & Photo—and upload a photo of yourself! Simply follow the instructions for the best results and enjoy bringing your digital twin to life!",
  },
  {
    title: "Your Projects and Uploads Are Safe",
    content: "Great news! Once you’ve created your videos, they’ll be securely saved in the My Projects tab, ready for you to revisit anytime. And if you’ve used your own photos or videos, you’ll find them neatly stored in the My Uploads tab. Everything you need, right at your fingertips!",
  },
  {
    title: "Translate a video",
    content: "Transform your videos into any language you desire! With MaiTY, the audio adjusts seamlessly to the new language, and the lip-sync is perfectly aligned. Give it a try and see the magic for yourself!",
  },
];

const Tabs: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentTab < tabsData.length - 1) {
      setCurrentTab(currentTab + 1);
    } else {
      setIsVisible(false);
    }
  };

  return (
    <>
      {isVisible && (
    <div className="mb-[30px] md:mb-[50px]">
      <h2 className="section-title mb-5">Getting Started</h2>
          <div className="flex gap-y-5 flex-col md:flex-row items-center rounded-lg p-[15px] md:p-[7px] bg-white relative ">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 py-[5px] px-[10px] bg-[#F5F7FA] rounded-[4px]  ">
            <ul className="space-y-2 custom-tabs">
              {tabsData.map((tab, index) => (
                <li
                  key={index}
                  className={`flex font-inter text-sm items-center text-[#828282] gap-[10px]  py-[13px] px-5 rounded-lg ${
                    index === currentTab ? "shadow-[0_4px_4px_0_rgba(0,0,0,0.08)] !text-[#292929] active" : ""
                  }`}
                  // onClick={() => setCurrentTab(index)}
                >
               <p><RingIcon /> </p>
                <h3>{tab.title}</h3>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3  md:pl-[50px] flex flex-col md:flex-row justify-between md:items-center">
            <div className="max-w-[546px] w-full">
            <h2 className="section-title !text-[28px]">{tabsData[currentTab].title}</h2>
            <p className="mb-5 mt-[10px] text-[#828282] text-sm leading-6 ">{tabsData[currentTab].content}</p>
            <button
              className="button"
              onClick={handleNext}
            >
              {currentTab < tabsData.length - 1 ? "Next Step" : "Finish"}
            </button>
            </div>
            <div className="md:min-w-[168px] pb-8 md:pb-0 pr-[30px] ">
           <Image src={hangemoji} alt="" className="max-w-[80px] ml-auto" />
            </div>
          </div>
          <div className="absolute right-0 bottom-0 ">
            <DesignIcon />
          </div>
        </div>
    </div>
      )}
    </>
  );
};

export default Tabs;
