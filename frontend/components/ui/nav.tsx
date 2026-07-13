'use client';

import { useState } from "react";

export default function NavBar() {
    const [isOpen, setIs] = useState(false)

    return (
        <div className="border-b-4 border-[#7E7F97] w-full fixed">
            <div className="flex w-full justify-between">
                <img src="/logo.png" alt="logo" className="h-20 pl-7 cursor-pointer lg:h-25" />

                <div className="flex flex-col gap-1 pr-10 pt-7 cursor-pointer lg:hidden">
                    <div className="bg-black h-1 w-7 rounded-[10px]"></div>
                    <div className="bg-black h-1 w-7 rounded-[10px]"></div>
                    <div className="bg-black h-1 w-7 rounded-[10px]"></div>
                </div>
                
                <div className="hidden lg:flex lg:gap-15 items-center">
                    <button className="h-15 w-25 rounded-[15px] hover:bg-[#7E7F97] cursor-pointer">Kursus</button>
                    <button className="h-15 w-30 rounded-[15px] hover:bg-[#7E7F97] cursor-pointer">Tentang kami</button>
                </div>

                <div className="hidden lg:flex lg:gap-5 lg:pr-10 items-center">
                    <button className="h-15 w-25 rounded-[15px] bg-[#112F58] text-white hover:bg-[#486894] cursor-pointer">Masuk</button>
                    <button className="h-15 w-25 rounded-[15px] bg-[#A2BEE2] hover:bg-[#486894] cursor-pointer">Daftar</button>
                </div>
            </div>
        </div>
    )
}
