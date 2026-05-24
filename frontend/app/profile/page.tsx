"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ChevronLeft, User } from "lucide-react"

type MenuItem = {
    label: string
    onClick: () => void
}

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<{ nama?: string; email?: string } | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem("user")
        if (saved) setUser(JSON.parse(saved))
    }, [])

    const menuItems: MenuItem[] = [
        { label: "Nama", onClick: () => {} },
        { label: "Profil", onClick: () => {} },
        { label: "Border", onClick: () => {} },
        { label: "Email", onClick: () => {} },
        { label: "Password", onClick: () => {} },
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-[#125E9C] border-b-4">
                <button
                    onClick={() => router.back()}
                    className="cursor-pointer text-black"
                >
                    <ChevronLeft size={28} />
                </button>
                <h1 className="text-[20px] font-semibold">Profil</h1>
            </div>

            {/* Avatar */}
            <div className="flex justify-center mt-10 mb-8">
                <div className="w-[90px] h-[90px] rounded-full bg-black flex items-center justify-center">
                    <User size={60} color="white" />
                </div>
            </div>

            {/* Menu List */}
            <div className="mx-auto max-w-[380px] border border-gray-300 rounded-[12px] overflow-hidden">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={item.onClick}
                        className={`w-full text-left px-5 py-4 text-[16px] bg-white hover:bg-gray-50 cursor-pointer transition-colors ${
                            index !== menuItems.length - 1 ? "border-b border-gray-200" : ""
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    )
}