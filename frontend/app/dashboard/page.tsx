"use client"

import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselApi, CarouselContent, CarouselItem,CarouselNext } from "@/components/ui/carousel"
import * as React from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)
    const router = useRouter()

    React.useEffect(() => {
        if(!api) return
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap())
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    },[api])
    return(
        <main>
            <div>
                <Navbar />
            </div>
            <div>
                <Carousel setApi={setApi} plugins={[Autoplay({ delay: 3000, stopOnInteraction:false })]} className="w-full md:mt-[150px] md:w-[1150px] md:ml-[400px] rounded-[15px]">
                    <CarouselContent className="md:h-[418px] rounded-[15px] gap-1">
                        <CarouselItem>
                            <div className="bg-[#585FC6] rounded-[15px] md:h-[418px]">
                                <p className="text-white text-[48px] md:pt-[65px] md:w-[500px] md:pl-[100px]">Selamat Datang di kursku!</p>
                                <p className="text-white text-[24px] md:pl-[100px] md:pt-[40px]">Ayo mulai belajar!</p>
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div className="bg-[#C0C8EC] rounded-[15px] md:h-[418px] flex items-center md:pl-[130px]">
                                <div className="bg-white md:w-[264px] md:h-[272px] rounded-[15px] flex flex-col items-center justify-center">
                                    <div className="border-[#FFD700] md:w-[80px] md:h-[80px] rounded-full border-5 bg-transparent"></div>
                                    <p className="text-[24px] md:mt-[37px]">Gold Border</p>
                                </div>
                                <div>
                                    <p className="text-[32px] md:ml-[50px]">Ada yang baru nih!</p>
                                    <p className="text-[24px] md:ml-[50px] md:pt-[28px] md:w-[450px]">Sekarang ada border yang lebih bagus buat kamu!</p>
                                    <button className="text-[16px] md:ml-[50px] md:mt-[90px] bg-[#5382EE] md:h-[38px] md:w-[153px] rounded-[15px] cursor-pointer">Kunjungi Sekarang</button>
                                </div>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>

                <div className="w-full justify-center flex md:mt-[25px] gap-3">
                    {Array.from({length: count}).map((_, index) => (
                        <button key={index} onClick={() => api?.scrollTo(index)} className={`h-1.5 rounded-full ${
                            index === current ? "w-[69px] bg-blue-500" : "w-[69px] bg-gray-300 hover:bg-gray-400"
                        }`} />
                    ))}
                </div>
            </div>

            <div className="bg-[#F9FAFF] md:w-[1150px] md:ml-[400px] md:h-[812px] md:mt-[67px] rounded-[15px] shadow-xl/10 flex items-center justify-center gap-[100px] overflow-hidden relative">
                <div className="md:w-[433px] md:h-[618px] rounded-[15px] shadow-xl/10 hover:translate-y-[-10px] z-10 cursor-pointer" onClick={() => {
                    router.push("/forum")
                }}>
                    <div className="bg-[#B6B6B6] md:h-[275px] rounded-t-[15px] flex items-center justify-center">
                        <img src="/forum.png" alt="forum" className="md:w-[273px] md:h-[273px]" />
                    </div>
                    <div className="bg-white md:py-[33px]">
                        <p className="text-[40px] md:w-[250px] text-center font-bold md:ml-[78px]">Diskusi Tugas & Catatan</p>
                        <p className="text-[24px] md:w-[250px] text-center md:ml-[78px] md:mt-[48px]">Diskusi tugas & buat catatan bersama </p>
                    </div>
                    <div className="bg-[#BABABA] md:h-[37px] rounded-b-[15px] "></div>
                </div>

                <div className="md:w-[433px] md:h-[618px] rounded-[15px] shadow-xl/10 hover:translate-y-[-10px] z-10 cursor-pointer" onClick={() => {
                    router.push("/kelas")
                }}>
                    <div className="bg-[#B6B6B6] md:h-[275px] rounded-t-[15px] flex items-center justify-center">
                        <img src="/kelas.png" alt="kelas" className="md:w-[220px] md:h-[220px]" />
                    </div>
                    <div className="bg-white md:py-[51px]">
                        <p className="text-[40px] md:ml-[110px]  font-bold">Kelas Belajar</p>
                        <p className="text-[24px] md:w-[300px] text-center md:ml-[70px] md:mt-[72px]">Ruang belajar dan kerjakan tugas</p>
                    </div>
                    <div className="bg-[#BABABA] md:h-[37px] rounded-b-[15px] "></div>
                </div>

                <div className="absolute md:h-[191px] bg-[#2180EE]/82 md:w-[345px] rounded-[15px] bottom-175 -rotate-140 left-60"></div>
                <div className="bg-[#0019A8]/70 md:w-[401px] md:h-[401px] absolute rounded-full -bottom-30 -right-20"></div>
                <div className="bg-[#7098EE] md:h-[223px] md:w-[223px] absolute rounded-full bottom-7 left-10"></div>
            </div>

            <div>
                <Footer />
            </div>
        </main>
    )
}