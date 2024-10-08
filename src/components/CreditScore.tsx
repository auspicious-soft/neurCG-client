import React from 'react';

interface CreditDataProps {
    text: string;
    value: number;

}

const CreditScore: React.FC<CreditDataProps> = ({text, value}) => {
    return (
        <div className=''>
            <div className='flex items-center md:justify-end gap-5 '>
                <h3 className='text-[#3A2C23] text-sm md:text-right '>{text} </h3>
                <h3 className='rounded-[50px] text-[#3A2C23] text-sm text-center py-[5px] w-[54px] border border-[#FFE2CE] bg-[#FFEEE2] '>{value} </h3>
            </div>
        </div>
    );
}

export default CreditScore;
