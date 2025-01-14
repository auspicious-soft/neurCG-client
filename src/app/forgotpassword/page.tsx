'use client'
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import LoginCard from "@/components/LoginCard";
import loginImg from "@/assets/images/loginimg.png";
import Link from "next/link";
import { useState, useTransition } from "react";
import { forgotPasswordEmailSentService } from "@/services/user-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isPending, startTransition] = useTransition()
  const handleChange = (e: any) => {
    setEmail(e.target.value)
  }
  const handleSubmit = (e: any) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        const response = await forgotPasswordEmailSentService({ email })
        if (response.status === 200) {
          toast.success('Email sent successfully to you with otp')
          router.push('/otp')
        }
        else {
          toast.error("Something went wrong")
        }
      }
      catch (err: any) {
        if (err.status == 404) toast.error('Email not found')
        else toast.error('Something went wrong')
      }
    })
  }
  return (
    <div className=" ">
      <div className="grid md:grid-cols-2 gap-y-10 items-center h-full">
        {/* min-h-[100vh]  max-w-[418px] pl-[113px] pr-4 */}
        <div className=" bg-[#F5F7FA] flex flex-col justify-center lg:pl-[113px] md:pr-4 h-full">
          <div className="md:max-w-[418px] 2xl:mx-auto ">
            <Image src={logo} height={100} width={200} alt="" />
            <h1 className="main-title mt-[30px] md:mt-[94px] mb-[5px] md:mb-3 ">Forgot Password</h1>
            <p className="login-desc mb-5 md:mb-10">Enter your email to receive an OTP for reset.</p>
            <form >
              <div className="mb-[15px]"><input required type="email" value={email} onChange={handleChange} placeholder="Email Address" id="" /></div>
              <button disabled={isPending} onClick={handleSubmit} type="submit" className="cursor-pointer button inline-block text-center md:leading-7 w-full bg-[#e87223] rounded-[5px] text-white text-base p-[15px]">
                Send OTP</button>
            </form>
            <p className="login-desc text-center mt-[25px] ">Remember Your Password? <Link href="/login" className="text-[#E87223]">Login</Link> </p>

            <p className="login-desc mt-[20px] md:mt-[153px]">Copyright © 2020 - 2025 Maity.</p>
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
