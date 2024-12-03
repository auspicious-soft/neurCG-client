import React from 'react'
import GoogleSvg from '@/assets/images/google.svg'
import Image from 'next/image'
import { handleGoogleLogin } from '@/actions'

const GoogleButton = () => {

    return (
        <div onClick={() => handleGoogleLogin()} className='flex items-center bg-[#4285F4] gap-4 mb-2 cursor-pointer'>
            <Image src={GoogleSvg} alt="google" width={40} height={43} className="h-[43px] object-contain pl-[4px]" />
            <p className='text-white font-medium'>Continue with Google</p>
        </div>
    )
}

export default GoogleButton