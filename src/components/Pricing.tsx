'use client'
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import CheckoutForm from './CheckOut';
import { useSession } from 'next-auth/react';
import { getAxiosInstance } from '@/utils/axios';
import { toast } from 'sonner';
import useSWR from 'swr';
import { buyPlan, getUserInfo } from '@/services/user-service';


const PricingPlans: React.FC = () => {
  const session = useSession()
  const { data, isLoading, mutate } = useSWR(`/user/${session.data?.user?.id}`, getUserInfo, { revalidateOnFocus: false })
  const currentPlan = data?.data.data?.planType

  const handlePlanSelect = async (planType: string) => {
    try {
      const response = await buyPlan(`/user/${session.data?.user?.id}/buy-plan`, { planType })
      const data = await response.data;
      if (data.id) {
        // Redirect to Stripe Checkout
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
        await stripe?.redirectToCheckout({ sessionId: data.id });
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while processing your request.');
    }
  };

  return (
    <div className="container">
      <div className="my-[40px] md:mt-[55px] md:mb-[100px] text-center">
        <h2 className="section-title mb-5 md:mb-[45px]">Choose Your <span>Pricing Plan</span></h2>
        <div className="grid md:grid-cols-3 gap-5 lg:gap-[57px] ">
          {/* Free Trial Plan */}
          <div className="border border-[#262626] rounded-[10px] py-5 px-4 bg-white md:mt-10">
            <div className='flex flex-col justify-between h-full'>
              <div>
                <p className="text-[24px] font-semibold mb-3 border border-[#262626] text-[#262626] rounded-[10px] inline-block px-5 py-1">Free Trial</p>
                <h2 className="md:text-[40px] text-[30px] lg:text-[60px] font-[600] leading-[normal] text-[#262626]">€0</h2>
                <p className="text-sm text-[#81A7BA] mb-5">User/Month</p>
                <ul className="text-left orange-check list-design">
                  <li>3 Credits</li>
                  <li>Avatar with just a picture (Unlimited)</li>
                  <li>Workspace users (1)</li>
                  <li>Recording your audio</li>
                </ul>
              </div>
              <div>
                <button disabled={true} onClick={() => handlePlanSelect('free')} className=" px-4 lg:px-[50px] mt-7 py-3 text-base lg:text-[20px] text-white bg-[#E56F20] rounded-[10px] font-semibold font-inter">
                  {currentPlan === 'free' ? 'Current Plan' : 'Trial expired'}
                </button>
              </div>
            </div>
          </div>

          {/* Intro Plan */}
          <div className="rounded-[10px] px-[17px] pt-5 md:pt-[13px] pb-7 bg-[#E56F20] text-white">
            <p className="text-[24px] font-semibold mb-[30px] border border-white rounded-[10px] inline-block px-5 py-1">Intro Plan</p>
            <h2 className="md:text-[40px] text-[30px] lg:text-[60px] font-[600] leading-[normal] ">€12.50</h2>
            <h3 className="text-[15px] text-[#D3E7F0] mb-5 ">User/Month</h3>
            <ul className="white-checks half-list text-left list-design ">
              <li>100 Credits</li>
              <li>80 Voices</li>
              <li>+30 Languages</li>
              <li>Text to voice</li>
              <li>Translation</li>
              <li>Subtitles</li>
              <li>60 Ai Avatars</li>
              <li>Workspace Users (1)</li>
              <li>Create your avatar with just a picture (Unlimited)</li>
            </ul>
            <button disabled={currentPlan === 'intro'} onClick={() => handlePlanSelect('intro')} className=" px-4 lg:px-[50px] mt-7 py-3 text-base lg:text-[20px] bg-white text-[#E56F20] rounded-[10px] font-semibold font-inter">
              {currentPlan === 'intro' ? 'Current Plan' : 'Select Plan'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="border border-[#262626] rounded-[10px] py-5 px-4 bg-white md:mt-10">
            <div className='flex flex-col justify-between h-full'>
              <div>
                <p className="text-[24px] font-semibold mb-3 border border-[#262626] text-[#262626] rounded-[10px] inline-block px-5 py-1">Pro Plan</p>
                <h2 className="md:text-[40px] text-[30px] lg:text-[60px] font-[600] leading-[normal] text-[#262626]">€37.50</h2>
                <p className="text-sm text-[#81A7BA] mb-5">User/Month</p>
                <ul className="text-left half-list orange-check list-design">
                  <li>300 Credits</li>
                  <li>Text to Voice</li>
                  <li>Video Translation</li>
                  <li>Subtitles</li>
                  <li>60 AI Avatars</li>
                  <li>API</li>
                  <li>80 Voices</li>
                  <li>Workspace users (5)</li>
                  <li>Voice Cloning</li>
                  <li>Creat your own</li>
                </ul>
              </div>
              <div>
                <button disabled={currentPlan === 'pro'} onClick={() => handlePlanSelect('pro')} className=" px-4 lg:px-[50px] mt-7 py-3 text-base lg:text-[20px] text-white bg-[#E56F20] rounded-[10px] font-semibold font-inter">
                  {currentPlan === 'pro' ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Form Component */}


      {/* {selectedPlan && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
          <CheckoutForm userId={session.data?.user?.id as string} planType={selectedPlan} clientSecret={clientSecret} />
        </Elements>
      )} */}
    </div>
  );
};

export default PricingPlans;