'use client';

import { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false)
    const navRef = useRef<HTMLDivElement>(null)

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
            <div className="flex w-full justify-between static">
                <img src="/logo.png" alt="logo" className="h-20 pl-7 cursor-pointer lg:h-25" />

                <div> 
                    {isOpen ? (
                    <div ref={navRef} className="flex absolute bg-blue-200 flex-col h-lvh right-0 w-3/5 group">
                        <div className="flex relative">
                            <div className="flex absolute mt-40 flex-col gap-5 -200 w-full">
                                <button className="h-15 w-25 lg:rounded-[15px] hover:bg-[#7E7F97] cursor-pointer border-t-1 border-b-1 border-black w-full">Kursus</button>
                                <button className="h-15 w-30 lg:rounded-[15px] hover:bg-[#7E7F97] cursor-pointer border-t-1 border-b-1 border-black w-full">Tentang kami</button>
                            </div>

                            <div className="flex absolute gap-5 right-0 mr-3 mt-5">
                                <button className="h-13 w-18 rounded-[15px] bg-[#112F58] text-white hover:bg-[#486894] cursor-pointer">Masuk</button>
                                <button className="h-13 w-18 rounded-[15px] bg-[#A2BEE2] hover:bg-[#486894] cursor-pointer">Daftar</button>
                            </div>
                        </div>
                    </div>
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

