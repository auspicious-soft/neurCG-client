import Image from "next/image";
import logo from "@/assets/images/logo.png";
import LoginCard from "@/components/LoginCard";
import loginImg from "@/assets/images/loginimg.png";
import Link from "next/link";

export default function Home() {
  return (
    <div className=" ">
      <div className="grid md:grid-cols-2 gap-y-10 items-center">
        {/* min-h-[100vh]  max-w-[418px] pl-[113px] pr-4 */}
        <div className=" bg-[#F5F7FA] flex flex-col justify-center lg:pl-[113px] md:pr-4 h-full">
          <div className="md:max-w-[418px] 2xl:mx-auto ">
            <Image src={logo} height={100} width={200}  alt="" />
            <h1 className="main-title mt-[30px] md:mt-[94px] mb-[5px] md:mb-3 ">Create New Password</h1>
            <p className="login-desc mb-5 md:mb-10">Create a new password at least 8 digit long.</p>
            <div className="mb-2 md:mb-[17px]"><input type="password" name="" placeholder="Create Password" id="" /></div>
           <div className="mb-4 md:mb-[24px]"> <input type="password" name="" placeholder="Confirm Password" id="" /></div>

      <div><Link href="/home-page" className="button inline-block text-center md:leading-7 w-full bg-[#e87223] rounded-[5px] text-white text-base p-[15px]">
      Create New Password</Link> </div>
          <p className="login-desc mt-[20px] md:mt-[153px] ">Copyright © 2020 - 2025 NeurCG.</p>
          </div> 
        </div>
        <div className="waves">
          <div className="md:py-[125px] py-10 px-5 md:px-10  ">
            <LoginCard imgSrc={loginImg} />
          </div>
        </div>
      </div>
    </div> 
  );
}
