"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import previmg2 from "@/assets/images/previmg.png";
import { EditImgIcon } from "@/utils/svgIcons";
import CreditScore from "@/components/CreditScore";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { getUserInfo, updateUserInfo } from "@/services/user-service";
import { toast } from "sonner";
import { getDbImageUrl } from "@/utils";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  phoneNumber: string;
  state: string;
  city: string;
  homeAddress: string;
  profilePic: File | null;
};

const CreditScores = [
  {
    id: 1,
    text: "Animation Credit Left",
    value: 148,
  },
  {
    id: 2,
    text: "Audio Upload Credit Left",
    value: 48,
  },
  {
    id: 3,
    text: "Avatar Creation Credit Left",
    value: 18,
  },
];

const Page = () => {
  const { data: session, update } = useSession();
  const { data, isLoading, mutate } = useSWR(
    `/user/${session?.user?.id}`,
    getUserInfo,
    { revalidateOnFocus: false }
  );
  const user = data?.data?.data;

  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    phoneNumber: "",
    state: "",
    city: "",
    homeAddress: "",
    profilePic: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        phoneNumber: user.phoneNumber || "",
        state: user.state || "",
        city: user.city || "",
        homeAddress: user.homeAddress || "",
        profilePic: null,
      });

      if (user.profilePic) {
        const imageUrl = getDbImageUrl(user.profilePic);
        setImagePreview(imageUrl);
      }
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prevData) => ({
        ...prevData,
        profilePic: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInputClick = () => {
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData:any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== 'email' && key !== 'profilePic') {
          formDataToSend.append(key, (formData as any)[key]);
        }
      });

      if (formData.profilePic) {
        formDataToSend.append('profilePic', formData.profilePic)
      }

      const response = await updateUserInfo(`/user/${session?.user?.id}`, formDataToSend)
      mutate()
      if (formData.profilePic) {
        await update({
          ...session,
          user: {
            ...session?.user,
            image: (response.data?.data?.profilePic)
          }
        })
      }
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-[8px] p-5 md:p-[30px]">
          <div className="flex md:flex-row flex-col gap-y-4 justify-between md:items-center mb-10">
            <div className="custom relative w-[177px] h-[177px] ">
              <input
                className="absolute top-0 left-0 h-full w-full opacity-0 p-0 cursor-pointer"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <div className="relative h-full">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={177}
                    height={177}
                    className="rounded-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInputClick}
                    className="absolute bottom-[16px] right-1"
                  >
                    <EditImgIcon />
                  </button>
                </div>
              ) : (
                <div className="grid place-items-center h-full w-full">
                  <div>
                    <Image
                      src={previmg2}
                      alt="upload"
                      width={177}
                      height={177}
                      className="rounded-full"
                    />
                    <p className="absolute bottom-[16px] right-1 pointer-events-none">
                      <EditImgIcon />
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="profile-form flex flex-wrap gap-y-3 md:gap-y-[30px] gap-x-[50px]">
            <div className="md:w-[calc(45%-25px)] w-full">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="md:w-[calc(55%-25px)] w-full">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="md:w-[calc(45%-30px)] w-full">
              <input
                type="email"
                disabled
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="md:w-[calc(20%-36px)] w-full">
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
            <div className="md:w-[calc(35%-34px)] w-full">
              <input
                type="number"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="md:w-[calc(60%-35px)] w-full">
              <input
                type="text"
                name="homeAddress"
                placeholder="Home Address"
                value={formData.homeAddress}
                onChange={handleChange}
              />
            </div>
            <div className="md:w-[calc(20%-34px)] w-full">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="md:w-[calc(20%-34px)] w-full">
              <input
                type="text"
                name="state"
                placeholder="State*"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <button type="submit" className="button md:!h-[50px] w-[169px]">
                Update
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;