"use client";
import React, { useState, useRef, useEffect } from 'react';

const Subtitles = () => {
    const [isOpen, setIsOpen] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (contentRef.current) {
            if (isOpen) {
                contentRef.current.style.maxHeight = contentRef.current.scrollHeight + "px";
                contentRef.current.style.opacity = "1";
            } else {
                contentRef.current.style.maxHeight = "0px";
                contentRef.current.style.opacity = "0";
            }
        }
    }, [isOpen]);

    return (
        <div className="mt-5 bg-white rounded-lg p-[15px] md:p-[30px]  shadow-[0_0_40px_0_rgba(235,130,60,0.06)]">
            <h2 
                className={`section-title dropdown-title ${isOpen ? 'active' : ''}`}
                onClick={toggleOpen}
            >
                Subtitles
            </h2>
            <div
                ref={contentRef}
                className={`text-selecion overflow-hidden transition-[max-height] duration-500 ease-in-out`}
                style={{
                    maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
                    opacity: isOpen ? 1 : 0,
                }}
            >
       <div className='mt-5 grid md:grid-cols-[minmax(0,_4fr)_minmax(0,_8fr)] gap-5 '>
                 <label htmlFor="">
                    Subtitles
                    <div className=" mt-2 md:mt-[23px] flex items-center gap-5 md:gap-[50px] md:ml-0">
                        <label className="custom-radio pl-[34px] flex items-center relative ">
                            <input className="mr-2" type="radio" value="Yes" name="3" />
                            <span className="text-[#6B6B6B] text-base"> Yes</span>
                        </label>
                        <label className="custom-radio pl-[34px] flex items-center relative">
                            <input className="mr-2" type="radio" value="No" name="3" />
                            <span className="text-[#6B6B6B] text-base"> No</span>
                        </label>
                    </div>
                </label> 
                <label htmlFor="" className="grid gap-2 md:mb-5 max-w-[359px]">
                    Subtitle Language
                    <select name="" id="">
                        <option value="">Language Select</option>
                        <option value="">Language 1</option>
                        <option value="">Language 2</option>
                    </select>
                </label>
       </div>
            </div>
        </div>
    );
};

export default Subtitles;
