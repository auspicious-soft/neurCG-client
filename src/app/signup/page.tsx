"use client";
import { Suspense, useState } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.png";
import LoginCard from "@/components/LoginCard";
import loginImg from "@/assets/images/loginimg.png";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { signupAction } from "@/actions";
import { useSession } from "next-auth/react";
import Modal from "react-modal";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import { CrossIcon } from "@/utils/svgIcons";
export default function Signup() {
  const [opemModal, setOpenModal] = useState(false);
  const SearchParamsFunction = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const referralCode = searchParams.get("referralCode") ?? "";
    useEffect(() => {
      if (session) {
        router.push("/");
      }
    }, [session, router]);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
      event
    ) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;

      if (!email || !password || !firstName || !lastName)
        return toast.error("All fields are required");
      const resss = await signupAction({
        email,
        password,
        firstName,
        lastName,
        ...(referralCode && { referralCode }),
      });
      if (resss?.success) {
        toast.success("Signed up successfully");
        router.push("/login");
      } else {
        toast.error(
          Array.isArray(resss?.message)
            ? resss?.message[0].message
            : resss?.message
        );
      }
    };
    return (
      <div className="">
        <div className="grid md:grid-cols-2 gap-y-10 items-center">
          <div className="bg-[#F5F7FA] flex flex-col justify-center mobile-space lg:pl-[113px] md:pr-4 h-full">
            <div className="md:max-w-[418px] 2xl:mx-auto">
              <Image src={logo} height={100} width={200} alt="Logo" />
              <h1 className="main-title mt-[30px] md:mt-[94px] mb-[5px] md:mb-3">
                Sign Up
              </h1>
              <p className="login-desc mb-5 md:mb-10">
                Create a new account and see the magic of AI.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mb-2 md:mb-[15px]">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="mb-2 md:mb-[15px]">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    required
                  />
                </div>
                <div className="mb-2 md:mb-[15px]">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                  />
                </div>
                <div className="mb-2 md:mb-[15px]">
                  <input
                    type="password"
                    name="password"
                    placeholder="Create Password"
                    required
                  />
                </div>
                <div className="mb-[20px]">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="" className="flex items-center gap-2 mb-5 text-[#686c78] ">
                    <input type="checkbox" name="" className="w-auto" />I agree to the
                    <span onClick={()=> setOpenModal(true)} className="cursor-pointer text-[#e87223] font-bold  ">Privacy Policy</span>
                  </label>
                </div>
                <div>
                  <button
                    type="submit"
                    className="button inline-block text-center md:leading-7 w-full bg-[#e87223] rounded-[5px] text-white text-base p-[15px]"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              <p className="login-desc mt-[20px] md:mt-[153px]">
                Copyright © 2020 - 2025 NeurCG.
              </p>
            </div>
          </div>
          <div className="waves">
            <div className="md:py-[125px] py-10 px-5 md:px-10">
              <LoginCard imgSrc={loginImg} />
            </div>
          </div>
        </div>
        <Modal isOpen={opemModal} onRequestClose={() => setOpenModal(false)}
         className="modal w-full md:max-w-[70%] h-[90vh] p-4 md:p-[30px] pt-[50px]  rounded-[20px] overflo-custom overflow-y-auto relative bg-white "
         overlayClassName="z-[10] px-2 md:p-0 w-full h-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
         bodyOpenClassName='overflow-hidden'
         >
          <button
            className="absolute top-4 right-5"
            onClick={() => setOpenModal(false)}
          > <CrossIcon />
          </button>
          <PrivacyPolicy />
        </Modal>
      </div>
    );
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsFunction />
    </Suspense>
  );
}
