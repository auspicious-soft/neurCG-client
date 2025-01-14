'use client'
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import LoginCard from "@/components/LoginCard";
import loginImg from "@/assets/images/loginimg.png";
import { updatePasswordServiceAfterOtpVerified } from "@/services/user-service";
import { toast } from "sonner";
import { Suspense, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const otp = searchParams.get('otp');
    if (!otp) {
      router.push('/forgotpassword');
      // toast.error('Please complete the forgot password process first');
    }
  }, [router, searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
    const otp = searchParams.get('otp');
    
    if (newPassword === confirmPassword) {
      startTransition(async () => {
        try {
          const response = await updatePasswordServiceAfterOtpVerified({ password: newPassword as string, otp: otp as string });
          if (response.status === 200) {
            toast.success('Password updated successfully');
            router.push('/login');
          } else {
            toast.error('Something went wrong');
          }
        } catch (error: any) {
          if (error.status === 404) {
            toast.error('Invalid OTP');
          } else {
            toast.error('Something went wrong');
          }
        }
      });
    } else {
      toast.warning('Passwords must match');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2 md:mb-[17px]">
        <input type="password" name="newPassword" placeholder="Create Password" id="newPassword" />
      </div>
      <div className="mb-4 md:mb-[24px]">
        <input type="password" name="confirmPassword" placeholder="Confirm Password" id="confirmPassword" />
      </div>
      <button disabled={isPending} type="submit" className="button inline-block text-center md:leading-7 w-full bg-[#e87223] rounded-[5px] text-white text-base p-[15px]">
        Create New Password
      </button>
    </form>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="grid md:grid-cols-2 gap-y-10 items-center h-full">
        <div className=" bg-[#F5F7FA] flex flex-col justify-center lg:pl-[113px] md:pr-4 h-full">
          <div className="md:max-w-[418px] 2xl:mx-auto">
            <Image src={logo} height={100} width={200} alt="" />
            <h1 className="main-title mt-[30px] md:mt-[94px] mb-[5px] md:mb-3 ">Create New Password</h1>
            <p className="login-desc mb-5 md:mb-10">Create a new password at least 8 digits long.</p>
            <PasswordForm />
            <p className="login-desc mt-[20px] md:mt-[153px] ">Copyright © 2020 - 2025 Maity.</p>
          </div>
        </div>
        <div className="waves">
          <div className="md:py-[125px] py-10 px-5 md:px-10">
            <LoginCard imgSrc={loginImg} />
          </div>
        </div>
      </div>
    </Suspense>
  );
}