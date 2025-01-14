'use client'
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import LoginCard from "@/components/LoginCard";
import loginImg from "@/assets/images/loginimg.png";
import Link from "next/link";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sendOtpService } from "@/services/user-service";

export default function Home() {
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const handleOtpChange = (index: number, value: string) => {
    const sanitizedValue = value.slice(-1);

    if (sanitizedValue && !/^\d$/.test(sanitizedValue)) {
      return;
    }
    const newOtpValues = [...otpValues];
    newOtpValues[index] = sanitizedValue;
    setOtpValues(newOtpValues);

    if (sanitizedValue && index < 3) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, 4).split('');

    const newOtpValues = [...otpValues];
    pastedNumbers.forEach((num, index) => {
      if (index < 4) newOtpValues[index] = num;
    });
    setOtpValues(newOtpValues);

    const nextEmptyIndex = newOtpValues.findIndex(value => !value);
    const targetIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex;
    const nextInput = document.querySelector(`input[name="otp-${targetIndex}"]`) as HTMLInputElement;
    if (nextInput) nextInput.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const completeOtp = otpValues.join('');
    startTransition(async () => {
      try {
        const response = await sendOtpService({ otp: completeOtp })
        if (response.status === 200) {
          toast.success('Email sent successfully to you with otp')
          router.push(`/newpassword?otp=${completeOtp}`)
        }
        else {
          toast.error("Something went wrong")
        }
      }
      catch (err: any) {
        if (err.status == 404 || err.status == 400) {
         alert('Invalid otp or expired')
        }
        else toast.error('Something went wrong')
      }
    })
  };

  return (
    <div className="">
      <div className="grid md:grid-cols-2 gap-y-10 items-center h-full">
        <div className="bg-[#F5F7FA] flex flex-col justify-center mobile-space lg:pl-[113px] md:pr-4 h-full">
          <div className="md:max-w-[418px] 2xl:mx-auto">
            <Image src={logo} height={100} width={200} alt="" />
            <h1 className="main-title mt-[30px] md:mt-[94px] mb-[5px] md:mb-3 ">Enter OTP</h1>
            <p className="login-desc mb-5 md:mb-10">Enter 4 digit pin sent to your email address.</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 md:mb-[24px] otp-inputs flex gap-[11px] items-center">
                {otpValues.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    name={`otp-${index}`}
                    value={value}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onPaste={handlePaste}
                    maxLength={1}
                    required
                    className="w-12 h-12 text-center"
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !value && index > 0) {
                        const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`) as HTMLInputElement;
                        if (prevInput) prevInput.focus();
                      }
                    }}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="button inline-block text-center md:leading-7 w-full bg-[#e87223] rounded-[5px] text-white text-base p-[15px]"
              >
                Verify
              </button>
            </form>
            <p className="login-desc text-center mt-3 md:mt-[25px] ">Remember Your Password? <Link href="/" className="text-[#E87223]">Login</Link> </p>
            <p className="login-desc mt-[20px] md:mt-[153px]">Copyright © 2020 - 2025 Maity.</p>
          </div>
        </div>
        <div className="waves">
          <div className="md:py-[125px] py-10 px-5 md:px-10">
            <LoginCard imgSrc={loginImg} />
          </div>
        </div>
      </div>
    </div>
  );
}