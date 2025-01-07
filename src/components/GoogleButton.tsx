import React, { useTransition } from 'react'
import GoogleSvg from '@/assets/images/google.svg'
import Image from 'next/image'
import { handleGoogleLogin } from '@/actions'

const GoogleButton = () => {
    const [isPending, startTransition] = useTransition()
    return (
        <div onClick={() => {
            startTransition(async () => {
                await handleGoogleLogin()
            })
        }} className={`flex items-center gap-4 mb-2 cursor-pointer bg-[#4285F4] ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            <Image src={GoogleSvg} alt="google" width={40} height={43} className="h-[43px] object-contain pl-[4px]" />
            <p className='text-white font-medium'>Continue with Google</p>
        </div>
    )
}

export default GoogleButton