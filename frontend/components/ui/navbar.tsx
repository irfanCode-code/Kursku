"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState("")
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if(token) {
            setIsLoggedIn(true)
            setUsername("pbleee")
        }
    }, [])

    const initial = (name: string) => {
        if(!name) return "?"
        return name.charAt(0).toUpperCase()
    }
    return (
        <nav className="border-b-4 border-[#7E7F97] flex justify-between items-center w-full fixed top-0 left-0 z-50 bg-white">
            <div>
                <a href=""><img src="/logo.png" alt="logo" className="md:h-[100px] md:w-[100px] md:ml-[30px]" /></a>
            </div>

            <div className="flex gap-25">
                <a href="" className="md:text-[20px] font-bold md:pr-[12px] md:pl-[12px] md:pt-[6px] md:pb-[6px] rounded-[12px] hover:bg-[#7E7F97]">Kursus</a>
                <a href="" className="md:text-[20px] font-bold md:pr-[12px] md:pl-[12px] md:pt-[6px] md:pb-[6px] rounded-[12px] hover:bg-[#7E7F97]">Tentang Kami</a>
            </div>

            <div>
                {isLoggedIn ? (
                    <div className="bg-[#D9D9D9] md:mr-[25px] md:h-[50px] md:w-[50px] rounded-[100px] flex items-center justify-center">
                        {initial(username)}
                    </div>
                ): (
                    <div className="flex gap-10 md:mr-[25px]">
                        <button className="bg-[#112F58] text-white text-[20px] md:pl-[15px] md:pr-[15px] md:pt-[8px] md:pb-[8px] rounded-[12px] hover:bg-[#486894] cursor-pointer">Masuk</button>
                        <button className="bg-[#A2BEE2] text-[20px] md:pl-[15px] md:pr-[15px] md:pt-[8px] md:pb-[8px] rounded-[12px] hover:bg-[#597DAC] cursor-pointer">Daftar</button>
                    </div>
                )}
            </div>
        </nav>
    )
}