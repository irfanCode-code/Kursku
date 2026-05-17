"use client"

import React from "react"

export default function Footer() {
    return(
        <footer className="border-t-4 border-[#7E7F97] md:mt-[120px] md:h-[400px] flex md:pl-[128px] gap-20">
            <div className="md:pt-[44px]">
                <img src="/logo.png" alt="logo" className="md:h-[115px] md:w-[115px]" />
                <p className="text-[19px] text-[#5C5858]">Belajar bersama di kursku</p>
            </div>
            <div className="md: pt-[84px]">
                <p className="text-[21px] font-bold">Tentang Kami</p>
                <a href=""><p className="text-[19px] md:pt-[40px]">tentang kursus</p></a>
            </div>
        </footer>
    )
}