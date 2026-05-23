"use client"

import { useParams } from "next/navigation"
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"

export default function DetailKelas() {
    const params = useParams()
    const idKelas = params.id

    return (
        <div>
            <Navbar />
            <div className="md:mt-[100px]">
                <div>
                    <span>ID Kelas: {idKelas}</span>
                    <h1>Selamat datang</h1>
                    <p>Halaman ini memuat materi</p>
                </div>

                <div>
                    <h2>daftar materi</h2>
                    <p>belum ada materi</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}