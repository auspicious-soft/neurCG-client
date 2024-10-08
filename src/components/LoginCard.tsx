import React from 'react';
import Image, {StaticImageData} from 'next/image';
import { ImgIcon1, ImgIcon2, ImgIcon3 } from '@/utils/svgIcons';


interface LoginCardProps {
    imgSrc?: string | StaticImageData;
}
const LoginCard: React.FC<LoginCardProps> = ({imgSrc}) => {
    return (
        <div className='blurr-bg relative'>
             {imgSrc && <Image src={imgSrc} height={100} width={200} alt="Card img" className=" w-full" />}
             <div className='absolute left-[-30px] top-[50%] translate-y-[-50%] '> <ImgIcon1 /></div>
             <div className='absolute right-[-30px] top-5 md:top-[89px] '> <ImgIcon2 /></div>
             <div className='absolute right-[-30px] bottom-5 md:bottom-[65px] '> <ImgIcon3 /></div>
        </div>
    );
}

export default LoginCard;
