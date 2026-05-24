"use client"

import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"

export default function DetailKelas() {
    const params = useParams()
    const idKelas = params.id
    const [kelas, setKelas] = useState<any>(null)
    const [tabDetail, setTabDetail] = useState<"forum" | "tugas" | "orang" | "nilai">("forum");
    const [tipeDipilih, setTipeDipilih] = useState<"materi" | "tugas">("materi")
    const [daftarKonten, setDaftarKonten] = useState<any[]>([])
    const [judulInput, setJudulInput] = useState("")
    const [deadline, setDeadline] = useState("")
    
    useEffect(() => {
    const saved = localStorage.getItem(`konten_${idKelas}`);
    
    if (!saved) {
        // Data dummy awal
        const dataDummy = [
            { 
                id: 1, 
                tipe: "materi", 
                judul: "Pengenalan Dasar Pemrograman", 
                deadline: null 
            },
            { 
                id: 2, 
                tipe: "tugas", 
                judul: "Tugas Membuat Website Sederhana", 
                deadline: "2026-06-01" 
            }
        ];
        setDaftarKonten(dataDummy);
        localStorage.setItem(`konten_${idKelas}`, JSON.stringify(dataDummy));
    } else {
        setDaftarKonten(JSON.parse(saved));
    }
}, [idKelas]);  
    

    useEffect(() => {
        const save = localStorage.getItem(`konten_${idKelas}`)
        if (save) setDaftarKonten(JSON.parse(save))
    }, [idKelas])

    const handleBuatTugas = (e: React.FormEvent) => {
        e.preventDefault()
        if(!judulInput.trim()) return
        
        const kontenBaru = {
            id: Date.now(),
            tipe: tipeDipilih,
            judul: judulInput,
            deadline: tipeDipilih === "tugas" ? deadline : null
        }

        const dataTerbaru = [...daftarKonten, kontenBaru]
           setDaftarKonten(dataTerbaru)
           localStorage.setItem(`konten_${idKelas}`, JSON.stringify(dataTerbaru))

           // Reset Form
           setJudulInput("")
           setDeadline("")
        }

    useEffect(() => {
        const data = localStorage.getItem("daftarKelas")
        if (data) {
            const parsedData = JSON.parse(data)
            // Pastikan perbandingan ID sesuai (string vs string)
            const found = parsedData.find((k: any) => k.id.toString() === idKelas)
            setKelas(found)
        }
    }, [idKelas])

    // Jika kelas tidak ditemukan setelah proses memuat
    if (!kelas) return <div className="p-10">Kelas tidak ditemukan atau sedang memuat...</div>

    return (
        <div>
        <Navbar />
        <div className="md:mt-[100px]">
            
            {/* Tampilan Khusus Guru */}
            {kelas.role === "guru" && (
                <div className="flex">
                    <div className="md:h-[100vh] fixed border-r-4 border-[#7E7F97] bg-[#F6F6FF]">
                        <div className="flex flex-col p-4 gap-5">
                            <button 
                                onClick={() => setTabDetail("forum")}
                                className={`cursor-pointer md:h-[50px] md:w-[245px] rounded-[29px] ${tabDetail === "forum" ? "bg-blue-200" : "bg-white"}`}
                            >
                                Forum
                            </button>
                            <button 
                                onClick={() => setTabDetail("tugas")}
                                className={`cursor-pointer md:h-[50px] md:w-[245px] rounded-[29px] ${tabDetail === "tugas" ? "bg-blue-200" : "bg-white"}`}
                            >
                                Tugas Kelas
                            </button>
                            <button 
                                onClick={() => setTabDetail("orang")}
                                className={`cursor-pointer md:h-[50px] md:w-[245px] rounded-[29px] ${tabDetail === "orang" ? "bg-blue-200" : "bg-white"}`}
                            >
                                Orang
                            </button>
                            <button 
                                onClick={() => setTabDetail("nilai")}
                                className={`cursor-pointer md:h-[50px] md:w-[245px] rounded-[29px] ${tabDetail === "nilai" ? "bg-blue-200" : "bg-white"}`}
                            >
                                Nilai
                            </button>
                        </div>
                    </div>
                    <div className="w-full h-[100vh] flex flex-col items-center">
                        
                        {tabDetail === "forum" && 
                        <div className="flex gap-30">
                            <div className="md:w-[390px] md:h-[180px] border-1 border-black rounded-[19px] md:mt-[85px]">
                                <p className="text-[30px] md:mt-[37px] md:ml-[40px]">Kode Kelas:</p>
                                <p className="text-[34px] md:ml-[40px]">{kelas.code}</p>
                            </div>
                            <div className="border-1 border-black rounded-[15px] md:w-[400px] md:h-[400px] flex flex-col justify-center items-center bg-[#D9D9D9] md:mt-[85px]">
                                <img src="/openBook.png" alt="openBook" className="md:w-[309px] md:h-[309px]" />
                                <div className="text-4xl font-bold bg-[#A5C8FF] md:w-[400px] md:h-[90px] rounded-b-[15px] border-l-1 border-r-1 border-b-1 border-black">
                                    <h1 className="md:ml-[26px] md:mt-[20px]">{kelas.nama}</h1>
                                </div>
                            </div>
                        </div>}
                        {tabDetail === "tugas" && 
                        <div>
                            <button className="flex">
                                <img src="/plus.png" alt="plus" />
                                <p>Buat Tugas</p>
                            </button>
                            <div className="flex flex-col border-1 border-black mt-6 md:w-[785px] rounded-[15px] pb-6">
                                {daftarKonten.map((item) => (
                                    <div key={item.id} className="p-4 border-b-1 border-black w-[630px] rounded-[1px] md:ml-[80px] flex">
                                        {/* Label Tipe */}
                                        <img src="/tugas.png" alt="task" className="md:w-[31px] md:h-[31px] md:mt-[2px]" />
                                        <span className={`px-2 py-1 text-xs font-bold rounded flex items-center md:ml-[10px] ${item.tipe === "tugas" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                                            {item.tipe.toUpperCase()}
                                        </span>

                                        <h3 className="font-bold text-lg mt-2 md:ml-[20px] -translate-y-1">{item.judul}</h3>

                                        {/* Tampilkan deadline jika tugas */}
                                        {item.tipe === "tugas" && (
                                            <p className="text-sm text-red-500 md:ml-[46px]">Tenggat Waktu: {item.deadline}</p>
                                        )}

                                        {/* Input file hanya muncul jika tipe tugas dan role siswa */}
                                        {item.tipe === "tugas" && kelas.role === "siswa" && (
                                            <input type="file" className="mt-2 block border p-1" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>}
                        {tabDetail === "orang" && <div>Daftar Anggota Kelas</div>}
                        {tabDetail === "nilai" && <div>Halaman Nilai</div>}
                    </div>
                </div>
            )}

            {/* Tampilan Khusus Siswa */}
            {kelas.role === "siswa" && (
                <div className="bg-green-100 p-6 rounded-lg border-2 border-green-300">
                    <h2 className="text-xl font-bold text-green-800">Panel Siswa</h2>
                    <p>Selamat belajar! Silakan akses materi yang disediakan guru.</p>
                    <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">Lihat Tugas</button>
                </div>
            )}
        </div>

    </div>
    )
}