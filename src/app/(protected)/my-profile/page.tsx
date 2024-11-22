"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import previmg2 from "@/assets/images/previmg.png";
import { EditImgIcon } from "@/utils/svgIcons";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { cancelSubscription, getUserInfo, updateUserInfo } from "@/services/user-service";
import { toast } from "sonner";
import { getImageUrlOfS3 } from "@/utils";
import Modal from "react-modal";
import { deleteImageFromS3, generateSignedUrlToUploadOn } from "@/actions";

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
}

const customStyles = {
  content: {
    width: '400px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',
    padding: '20px',
  },
};

const Page = () => {
  const { data: session, update } = useSession();
  const { data, isLoading, mutate } = useSWR(`/user/${session?.user?.id}`, getUserInfo, { revalidateOnFocus: false })
  const user = data?.data?.data;
  const CreditScores = [
    {
      id: 1,
      text: "Credit Left",
      value: user?.creditsLeft,
    },
    {
      id: 2,
      text: "Video Creation Time Left",
      value: (user?.creditsLeft * 10) / 60,
    },
  ];

  const [formData, setFormData] = useState<FormData>({
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
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        profilePic: user.profilePic || "",
      });

      if (user.profilePic) {
        const imageUrl = getImageUrlOfS3(user.profilePic);
        setImagePreview(imageUrl);
      }
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prevData: any) => ({
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
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true)
    try {
      delete (formData as any).email
      const formDataToSend = formData
      const imageKey = `projects/${session?.user?.email}/my-media/${typeof (formData as any)?.profilePic === 'string' ? (formData as any).profilePic : formData?.profilePic?.name}`

      if (formData.profilePic && typeof formData.profilePic !== 'string') {
        const signedUrl = await generateSignedUrlToUploadOn(formData.profilePic.name, formData.profilePic.type, session?.user?.email as string)
        const uploadResponse = await fetch(signedUrl, {
          method: 'PUT',
          body: formData.profilePic,
          headers: {
            'Content-Type': formData.profilePic.type,
          },
          cache: 'no-store'
        })
        if (!uploadResponse.ok) {
          toast.error('Something went wrong. Please try again')
          return
        }
        const imageKey = `projects/${session?.user?.email}/my-media/${formData.profilePic.name}`;
        // Delete the old image from the S3 bucket
        if (user?.profilePic) {
          await deleteImageFromS3(user?.profilePic);
        }
        (formDataToSend as any).profilePic = imageKey
      }
      if ((formData as any).profilePic == '' || typeof (formData as any).profilePic !== 'string' || (formData as any).profilePic === undefined || imageKey === user?.profilePic) {
        delete (formDataToSend as any).profilePic
      }
      const response = await updateUserInfo(`/user/${session?.user?.id}`, formDataToSend);
      mutate()
      if (formData.profilePic) {
        await update({
          ...session,
          user: {
            ...session?.user,
            image: response.data?.data?.profilePic,
          },
        });
      }
      setIsSubmitting(false)
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const confirmCancelSubscription = async () => {
    const response = await cancelSubscription(`/user/${session?.user?.id}/cancel-subscription`, { subscriptionId: user?.planOrSubscriptionId })
    if (response.data.success) {
      toast.success("Subscription cancelled successfully");
      mutate();
      closeModal();
    } else {
      toast.error("Something went wrong");
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
                    unoptimized
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
              <button type="submit" className="button md:!h-[50px] w-[169px] hover:bg-orange-700 transition duration-200" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </form>


      <div className="bg-white rounded-[8px] p-5 md:p-[30px] mt-8 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Plans & Subscription</h2>
        <div className="text-lg font-medium">
          <p className="text-[#6B6B6B] text-[14px]">Selected Plan</p>
          <div className="text-orange-600 text-xl font-semibold">
            {user?.planType !== "free" ? (
              <p>
                {user?.planType === "pro" && "Professional Plan"}
                {user?.planType === "enterprise" && "Enterprise Plan"}
                {user?.planType === "intro" && "Intro Plan"}
                {user?.planType === "expired" && "Expired Plan"}
              </p>
            ) : (
              "Free"
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-col items-end gap-y-2 text-[#3A2C23]">
          <div className="flex items-center">
            <span className="mr-2 text-gray-700 text-[14px]">Credits Left:</span>
            <span className="bg-orange-100 text-[#3A2C23] text-[14px] px-2 py-1 rounded-full">{CreditScores[0].value}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-gray-700 text-[14px]">Video Creation Time Left:</span>
            <span className="bg-orange-100 text-[#3A2C23] text-[14px] px-2 py-1 rounded-full">{CreditScores[1].value.toFixed(2)} minutes</span>
          </div>
        </div>
        {(user?.planType === "intro" || user?.planType === "pro") && (
          <button
            onClick={openModal}
            className="mt-6 text-[14px] bg-orange-600 text-white p-3 rounded-md hover:bg-orange-700 transition duration-200"
          >
            Cancel Subscription
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Confirm Cancel Subscription"
        ariaHideApp={false} // Add this line to disable aria app element error
      >
        <h2>Are you sure you want to cancel your subscription?</h2>
        <div className="flex justify-end mt-4">
          <button onClick={closeModal} className="mr-4 px-4 rounded">No</button>
          <button onClick={confirmCancelSubscription} className="px-4 py-2  bg-red-600 text-white rounded">Yes</button>
        </div>
      </Modal>
    </div>
  );
};

export default Page;