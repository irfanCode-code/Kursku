'use client'

import "@/app/globals.css"

export default function Dashboard() {


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

            <main className="md: mt-[92px] //">
              <div className="bg-[#D9D9D9] md: h-[546px]">
                <p className="md: text-[32px] md: w-[320px] md: ml-[128px] md: pt-[150px] //">Selamat Datang di Kursku!</p>
                <p className="md: text-[18px] md: ml-[128px] md: mt-[30px]">Ayo mulai belajar!</p>
              </div>

              <div className="bg-[#D9D9D9] md: h-[550px] md: ml-[128px] md: mr-[128px] md: mt-[75px] md: gap-39 // rounded-[15px] flex items-center ">
                <div className="border-1 md: ml-[90px] md: h-[450px] md: w-[385px] // rounded-[15px] bg-[#112F58] flex items-center flex-col border-[#112F58]">
                  <img src="/course.png" alt="buku" className="md: h-[120px] md: w-[120px]" />
                  <p className="md: text-[24px] text-white">Modul Pelajaran</p>
                  <p className="md: text-[15px] md: w-[200px] md: mt-[25px] text-white text-center">Akses beberapa modul pelajaran untuk belajar</p>
                  <button className="md: pt-[13px] md: pb-[12px] md: pl-[27px] md: pr-[28px] md: mt-[100px] border-1 border-[#D9D9D9] bg-[#D9D9D9] rounded-[10px] cursor-pointer hover:bg-[#969FB0] hover:border-[#969FB0]">Mulai Sekarang →</button>
                </div>

                <div className="border-1 md: h-[450px] md: w-[385px] // rounded-[15px] bg-[#112F58] border-[#112F58] flex flex-col items-center">
                  <img src="/lesson.png" alt="lesson" className="md: w-[120px] md: h-[120px]"/>
                  <p className="md: text-[24px] // text-white">Absen Kehadiran</p>
                  <p className="md: text-[15px] md: mt-[25px] md: w-[150px] // text-white text-center">Absen kehadiran setiap hari</p>
                  <button className="md: pt-[13px] md: pb-[12px] md: pl-[44px] md: pr-[46px] md: mt-[100px] border-1 border-[#D9D9D9] bg-[#D9D9D9] rounded-[10px] cursor-pointer hover:bg-[#969FB0] hover:border-[#969FB0]">Coming Soon</button>
                </div>

                <div className="border-1 md: h-[450px] md: w-[385px] // rounded-[15px] bg-[#112F58] border-[#112F58] flex flex-col items-center">
                  <img src="/note.png" alt="note" className="md: w-[120px] md: h-[120px]" />
                  <p className="md: text-[24px] // text-white">Catatan</p>
                  <p className="md: text-[15px] md: w-[150px] md: mt-[25px] // text-white text-center">Buat catatan supaya mudah mengingat</p>
                  <button className="md: pt-[13px] md: pb-[12px] md: pl-[44px] md: pr-[46px] md: mt-[100px] border-1 border-[#D9D9D9] bg-[#D9D9D9] rounded-[10px] cursor-pointer hover:bg-[#969FB0] hover:border-[#969FB0]">Coming Soon</button>
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