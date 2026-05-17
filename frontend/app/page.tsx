"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/ui/navbar"
import Hero from "@/components/ui/hero"
import Footer from "@/components/ui/footer"

export default function dashpage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if(token) {
            setIsLoggedIn(true)
        }
    }, [])
    return(
        <main>
            <div>
                <Navbar />
                <Hero isLoggedIn={isLoggedIn} />
                <section>
                    <div className="bg-[#D9D9D9] md:mt-[126px] md:ml-[128px] md:mr-[126px] md:h-[550px] rounded-[15px] flex justify-center items-center gap-50">
                        <div className="bg-[#112F58] md:w-[340px] md:h-[380px] flex flex-col items-center rounded-[15px]">
                            <img src="/course.png" alt="modul" className="md:h-[120px] md:w-[120px]" />
                            <p className="text-white text-[24px]">Modul Pelajaran</p>
                            <p className="text-white md:w-[200px] text-center md:mt-[25px]">Akses beberapa modul pembelajaran untuk belajar</p>
                            <button className="bg-white md:pl-[27px] md:pr-[27px] md:pt-[10px] md:pb-[10px] rounded-[15px] md:mt-[75px] hover:bg-[#969FB0] cursor-pointer">Mulai Sekarang</button>
                        </div>
                        <div className="bg-[#112F58] md:w-[340px] md:h-[380px] flex flex-col items-center rounded-[15px]">
                            <img src="/lesson.png" alt="absen" className="md:h-[120px] md:w-[120px]" />
                            <p className="text-white text-[24px]">Misi Harian</p>
                            <p className="text-white md:w-[170px] text-center md:mt-[17px]">Asah kemampuanmu setiap hari</p>
                            <button className="bg-white md:pl-[27px] md:pr-[27px] md:pt-[10px] md:pb-[10px] rounded-[15px] md:mt-[75px] hover:bg-[#969FB0] cursor-pointer">Coming Soon</button>
                        </div>
                        <div className="bg-[#112F58] md:w-[340px] md:h-[380px] flex flex-col items-center rounded-[15px]">
                            <img src="/note.png" alt="catatan" className="md:h-[120px] md:w-[120px]" />
                            <p className="text-white text-[24px]">Catatan</p>
                            <p className="text-white md:w-[170px] text-center md:mt-[17px]">Buat catatan supaya mudah mengingat</p>
                            <button className="bg-white md:pl-[27px] md:pr-[27px] md:pt-[10px] md:pb-[10px] rounded-[15px] md:mt-[75px] hover:bg-[#969FB0] cursor-pointer">Coming Soon</button>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    )
}