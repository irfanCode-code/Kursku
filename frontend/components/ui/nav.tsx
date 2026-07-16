'use client';

import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";


export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false)
    const navRef = useRef<HTMLDivElement>(null)
    const route = useRouter()


    useEffect(() => {
        const handleClose = (event: MouseEvent) => {
            if(isOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClose)
        return () => {  
            document.addEventListener("mousedown", handleClose)
        }
    }, [isOpen])


    return (
        <div className="border-b-4 border-[#7E7F97] w-full fixed bg-white">
            <div className="flex w-full justify-between relative">
                <img src="/logo.png" alt="logo" className="h-20 pl-7 cursor-pointer lg:h-25 lg:z-70" onClick={() => {route.push("/")}} />
                
                <div className="flex  w-full max-lg:hidden justify-between justify-center absolute">
                    <div className="flex items-center gap-10 w-full justify-center items-center h-25">
                         <button className="text-[20px] h-15 w-25 hover:bg-[#7E7F97] rounded-[15] cursor-pointer">Kursus</button>
                        <button className="text-[20px] h-15 w-30 hover:bg-[#7E7F97] rounded-[15px] cursor-pointer">Tentang kami</button>
                    </div>
                    <div className="flex gap-5 mr-3 mt-5 absolute right-0">
                        <button className="text-[20px] h-15 w-25 rounded-[15px] bg-[#112F58] text-white hover:bg-[#486894] cursor-pointer" onClick={() => {route.push("/auth/login")}}>Masuk</button>
                        <button className="text-[20px] h-15 w-25 rounded-[15px] bg-[#A2BEE2] hover:bg-[#486894] cursor-pointer" onClick={() => {route.push("/auth/register")}}>Daftar</button>
                    </div>
                </div>

                <div> 
                    {isOpen ? (
                    <>
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity" />
                        <div ref={navRef} className="flex absolute bg-white flex-col h-lvh right-0 w-3/5 group border-l-2 z-50">
                            <div className="flex relative">
                                <div className="flex absolute mt-40 flex-col gap-5 h-200 w-full">
                                    <button className="h-15 w-25 hover:bg-[#7E7F97] cursor-pointer border-t-1 border-b-1 border-black w-full lg:">Kursus</button>
                                    <button className="h-15 w-30 hover:bg-[#7E7F97] cursor-pointer border-t-1 border-b-1 border-black w-full">Tentang kami</button>
                                </div>

                                <div className="flex absolute gap-5 right-0 mr-3 mt-5">
                                    <button className="h-13 w-18 rounded-[15px] bg-[#112F58] text-white hover:bg-[#486894] cursor-pointer" onClick={() => {route.push("/auth/login"), setIsOpen(false)}}>Masuk</button>
                                    <button className="h-13 w-18 rounded-[15px] bg-[#A2BEE2] hover:bg-[#486894] cursor-pointer" onClick={() => {route.push("/auth/register"), setIsOpen(false)}}>Daftar</button>
                                </div>
                            </div>
                        </div>
                    </>
                    ) : (
                        <div className="flex flex-col gap-1 pr-10 pt-7 cursor-pointer lg:hidden">
                        <Menu onClick={() => setIsOpen(true)}/>
                    </div>
                        )}
                </div>

            </div>
        </div>
    )
}

