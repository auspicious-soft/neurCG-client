"use client";
import React, { useState } from "react";
import Image from "next/image";
import previmg2 from "@/assets/images/previmg.png"
import { EditImgIcon } from "@/utils/svgIcons";
import CreditScore from "@/components/CreditScore";

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    phoneNumber: string;
    gender: string;
    state: string;
    city: string;
    address: string;
    about: string;
    preferredConsultation: string;
    preferredLanguage: string;
    startTime: string;
    endTime: string;
    image: string;
    repeatDays: string[]; // Explicitly define repeatDays as an array of strings
  };

const CreditScores =[
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
]  
  
const Page = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        dob: "",
        phoneNumber: "",
        gender: "",
        state: "",
        city: "",
        address: "",
        about: "",
        preferredConsultation: "",
        preferredLanguage: "",
        startTime: "",
        endTime: "",
        image: "",
        repeatDays: [], // Initialize as an empty array
      });
      
const [imagePreview, setImagePreview] = useState<string | null>(null);
const [notification, setNotification] = useState<string | null>(null);

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData((prevData) => ({
          ...prevData,
          image: result,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileInputClick = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (day: string) => {
    setFormData((prevData) => {
      const updatedDays = prevData.repeatDays.includes(day)
        ? prevData.repeatDays.filter((d) => d !== day)
        : [...prevData.repeatDays, day];
      return { ...prevData, repeatDays: updatedDays };
    });
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //console.log("Form Data Submitted: ", formData);

    setNotification("Payment Request Submitted");
    setTimeout(() => {
      setNotification(null);
    }, 3000);
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
        <div className="grid gap-[6px] w-full">
          {CreditScores.map((item)=>(
            <CreditScore 
            key={item.id}
            text={item.text}
            value={item.value}
            />
          ))}
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
                  name="address"
                  placeholder="Home Address"
                  value={formData.address}
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
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            <div className="w-full">
            <button type="submit" className="button md:!h-[50px] w-[169px] "> Update</button>
            </div>
             
            </div>
            
            </div>
            </form>
        </div>
    );
}

export default Page;
