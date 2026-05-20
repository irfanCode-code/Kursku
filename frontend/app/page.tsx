"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/ui/navbar"
import Hero from "@/components/ui/hero"
import Footer from "@/components/ui/footer"
import { useRouter } from "next/navigation"
import Marquee from "@/components/ui/quotes"


export default function dashpage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()

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
                    <div className="w-full flex flex-col justify-center items-center md:mt-[63px]">
                        <div className="text-[40px] md:mb-[100px]">
                            Fitur Yang Ada
                        </div>
                        <div className="gap-40 flex">
                            <div className=" md:h-[300px] md:w-[370px] rounded-[12px] shadow-xl hover:translate-y-[-20px] hover:shadow-xl/20 cursor-pointer" onClick={() => {
                                router.push("/login")
                            }}>
                                <img src="/group.png" alt="group" className="md:h-[50px] md:w-[50px] md:ml-[30px] md:mt-[20px]" />
                                <p className="text-[20px] md:ml-[30px] md:w-[150px] md:mt-[10px]">Diskusi Tugas & Catatan</p>
                                <p></p>
                                <p></p>
                            </div>
                            <div className="md:h-[300px] md:w-[370px] rounded-[12px] shadow-xl hover:translate-y-[-20px] hover:shadow-xl/20 cursor-pointer" onClick={() => {
                                router.push("/login")
                            }}>
                                <img src="/book.png" alt="book" className="md:h-[50px] md:w-[50px] md:ml-[30px] md:mt-[20px]" />
                                <p className="text-[20px] md:ml-[30px] md:mt-[10px]">Kelas Belajar</p>
                                <p></p>
                                <p></p>
                            </div>
                            <div className="md:h-[300px] md:w-[370px] rounded-[12px] shadow-xl hover:shadow-xl/20 hover:translate-y-[-20px]">
                                <img src="/shop.png" alt="toko" className="md:h-[50px] md:w-[50px] md:ml-[30px] md:mt-[20px]" />
                                <p className="text-[20px]  md:ml-[30px] md:mt-[10px]">Toko Penukaran</p>
                                <p></p>
                                <p></p>
                            </div>
                        </div>
                        <div className="flex gap-3 md:mt-[20px]">
                            <div className="md:h-[8px] md:w-[30px] rounded bg-[#125E9C]"></div>
                            <div className="md:h-[8px] md:w-[30px] rounded bg-[#D9D9D9]"></div>
                            <div className="md:h-[8px] md:w-[30px] rounded bg-[#D9D9D9]"></div>
                            <div className="md:h-[8px] md:w-[30px] rounded bg-[#D9D9D9]"></div>
                            <div className="md:h-[8px] md:w-[30px] rounded bg-[#D9D9D9]"></div>
                        </div>
                    </div>
                    <Marquee />
                </section>
            </div>
            <Footer />
        </main>
    )
}