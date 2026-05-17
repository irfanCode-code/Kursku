"use client"

import React from "react"
import { useRouter } from "next/navigation"

interface Hero{
    isLoggedIn: boolean
}

export default function Hero({isLoggedIn}: Hero) {
    const router = useRouter()
    return (
        <section className="md:mt-[103px]">
            {isLoggedIn ? (
                <div className="bg-[#D9D9D9] md:h-[546px]">
                    <h1 className="md:text-[40px] md:pt-[130px] font-bold md:pl-[170px] md:w-[500px]">Selama Datang di Kursku!</h1>
                    <p className="md:text-[24px] md:pl-[170px] md:mt-[30px]">Ayo mulai belajar!</p>
                </div>
            ) : (
                <div className="bg-[#D9D9D9] md:h-[546px]">
                    <h1 className="md:text-[40px] md:pt-[130px] md:pl-[170px] md:w-[600px] font-bold">Mari Belajar Bersama di Kursku!</h1>
                    <button onClick={() => {
                        router.push("/login")
                    }} className="bg-[#112F58] text-white md:pl-[19px] md:pr-[19px] md:pt-[12px] md:pb-[12px] rounded-[12px] md:ml-[170px] md:mt-[90px] hover:bg-[#0D2342] cursor-pointer">Bergabung sekarang</button>
                </div>
            )}
        </section>
    )
}