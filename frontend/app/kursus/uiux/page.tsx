"use client"

import "@/app/globals.css"

export default function Uiux() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <header className="fixed top-0 left-0 w-full h-[92px] md:h-[92px] // bg-white flex items-center pl-[20px] md:pl-[70px] border-b-[4px] border-[#7E7F97]">
                        <a href=""><img src="/logo.png" alt="logo" className="w-[67px] h-[67px] // md:w-[92px] md:h-[92px] object-contain"/></a>
                <nav className="flex flex-row items-center pt-[12px] pb-[13px] // md:pt-0 pb-0">
                        <div className="flex">
                          <button className="md: ml-[650px] md: pt-[8px] md: pb-[8px] md: pl-[29px] md: pr-[29px] // border-1 rounded-[15px] border-white hover:bg-[#7E7F97] cursor-pointer">Kursus</button>
                          <button className="md: ml-[77px] md: pt-[8px] md: pb-[8px] md: w-[150px] // border-1 rounded-[15px] border-white hover:bg-[#7E7F97] object-contain cursor-pointer">Tentang Kami</button>
                        </div>

                        <div className=" md: mt-[10px] md: h-[60px] md: w-[60px] md: ml-[650px] // flex bg-[#D9D9D9] rounded-full items-center justify-center cursor-pointer">
                        <p>F</p>
                        </div>
                </nav>
            </header>

            <main className="md: mt-[140px] //">
            <div className="md: ml-[400px]">
                <h1 className="md: text-[38px]">UI/UX</h1>
                <hr className="md: mr-[400px]" />

                <div className="border-1 rounded-[12px] md: mt-[100px] md: mr-[500px] md: ml-[100px] ">
                    <details className="">
                        <summary className="list-none outline-none flex border-b-[1px] md: pt-[30px] md: pb-[30px] md: pl-[10px]">
                            <img src="/arrow.png" alt="arrow" className=" md: h-[40px] md: w-[40px] rotate-y-180" />
                            <span className="md: text-[28px]">Materi</span>
                        </summary>
                        <div>
                            <div className="md: pl-[40px] md: pt-[30px] md: pr-[30px] md: pb-[30px]">
                                <span className="">Roadmap</span>
                                <span className="">Tahap,langkah-langkah ...</span>
                            </div>
                        </div>
                    </details>

                    <details className="">
                        <summary className="list-none outline-none flex border-t-1 md: pt-[30px] md: pb-[30px] pl-[10px]">
                            <img src="/arrow.png" alt="" className="md: h-[40px] md: w-[40px] rotate-y-180" />
                            <span className="md: text-[28px]">Soal</span>
                        </summary>
                        <div>
                            <div className="md: pl-[40px] md: pt-[30px] md: pr-[30px] md: pb-[30px] ">
                                <span className="">Soal 1</span>
                                <span className="">Soal latihan ...</span>
                            </div>
                        </div>
                    </details>  
                </div>
            </div>
            </main>

            <footer className="w-full h-[400px] border-t-[4px] border-[#7E7F97] mt-[56px] flex flex-col md:flex-row">
                <div className="pl-[40px] pt-[30px] md:pl-[70px] md:pt-[20px]">
                    <img src="/logo.png" alt="logo" className="w-[66px] h-[66px] md:w-[78px] md:h-[78px]"/>
                    <p className="text-[#5C5858] text-[19px] md:text-[17px] pt-[20px] md:pt-[20px]">Belajar bersama di kursku</p>
                </div>

                <div className="pl-[40px] pt-[50px] md:pt-[39px] md:pl-[103px]">
                    <h3 className="font-bold text-[21px] md:text-[20px]">Tentang kami</h3>
                    <a href=""><p className="text-[19px] md:text-[18px] pt-[40px] md:pt-[30px]">tentang kursku</p></a>
                </div>
            </footer>
        </div>
    )
}