"use client"

import { useParams } from "next/navigation"
import React, { useEffect, useState, useRef } from "react"
import Navbar from "@/components/ui/navbar"


export default function DetailKelas() {
    const params = useParams()
    const idKelas = params.id
    const [kelas, setKelas] = useState<any>(null)
    const [tabDetail, setTabDetail] = useState<"forum" | "tugas" | "orang" | "nilai">("forum")
    const [tipeDipilih, setTipeDipilih] = useState<"materi" | "tugas">("materi")
    const [daftarKonten, setDaftarKonten] = useState<any[]>([])
    const [judulInput, setJudulInput] = useState("")
    const [deadline, setDeadline] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [showDropDown, setShowDropDown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [deskripsi, setDeskripsi] = useState("")
    const [file, setFile] = useState<File | null>(null)

    const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]
}

    useEffect(() => {
    function handleClickOut(e: MouseEvent) {
        if(dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setShowDropDown(false)
        }
    }
    document.addEventListener("mousedown", handleClickOut)
    return () => {
        document.removeEventListener("mousedown", handleClickOut)
    }
}, [])
    
    useEffect(() => {
    const saved = localStorage.getItem(`konten_${idKelas}`);
    
    if (!saved) {
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
    e.preventDefault();
    const kontenBaru = {
        id: Date.now(),
        tipe: tipeDipilih,
        judul: judulInput,
        deskripsi: deskripsi,
        deadline: tipeDipilih === "tugas" ? deadline : null,
        file: file ? file.name : null
    }
        const dataTerbaru = [...daftarKonten, kontenBaru]
           setDaftarKonten(dataTerbaru)
           localStorage.setItem(`konten_${idKelas}`, JSON.stringify(dataTerbaru))
           setShowModal(false)
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
                        <div ref={dropdownRef}>
                            <button className="flex bg-[#A5C8FF] md:mt-[72px] md:w-[200px] md:h-[50px] justify-center items-center gap-3 rounded-[40px] cursor-pointer" onClick={() => setShowDropDown(!showDropDown)}>
                                <img src="/plus.png" alt="plus" className="md:h-[30px] md:w-[30px]" />
                                <p>Buat Tugas</p>
                            </button>
                            {showDropDown && (
                               <div className="absolute mt-2 w-[200px] bg-[#E9E9F7] rounded-xl shadow-lg border border-black p-2 z-10 left-185 bottom-165">
                                   <button 
                                       onClick={() => { setShowModal(true); setTipeDipilih("tugas"); setShowDropDown(false); }} 
                                       className="w-full text-left p-2 font-bold hover:bg-white rounded"
                                   >
                                       Tugas
                                   </button>
                                   <hr className="border-black my-1" />
                                   <button 
                                       onClick={() => { setShowModal(true); setTipeDipilih("materi"); setShowDropDown(false); }} 
                                       className="w-full text-left p-2 font-bold hover:bg-white rounded">
                                       Materi
                                   </button>
                               </div>
                           )}
                           
                           {showModal && (
                                <div 
                                    className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 " 
                                    onClick={() => setShowModal(false)}></div>
                            )}

                            <div className={`fixed top-0 right-0 h-full w-[400px] bg-[#F1F3FF] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${showModal ? "translate-x-0" : "translate-x-full"}`}>
                                <div className="p-8 bg-[#F1F3FF]">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Buat {tipeDipilih === "tugas" ? "Tugas" : "Materi"}</h2>
                                        <button onClick={() => setShowModal(false)} className="text-2xl">&times;</button>
                                    </div>
                            
                                    <form onSubmit={handleBuatTugas} className="flex flex-col gap-4">
                                        <input 
                                            placeholder="Judul" 
                                            className="w-full border p-3 rounded-lg"
                                            value={judulInput}
                                            onChange={(e) => setJudulInput(e.target.value)}
                                            required
                                        />

                                        <textarea 
                                            placeholder="Deskripsi" 
                                            className="w-full border p-3 rounded-lg h-32"
                                            value={deskripsi}
                                            onChange={(e) => setDeskripsi(e.target.value)}
                                        />

                                        {tipeDipilih === "tugas" && (
                                            <div className="flex flex-col gap-1">
                                                <label className="text-sm font-semibold">Tenggat Waktu</label>
                                                <input 
                                                    type="date" 
                                                    className="w-full border p-3 rounded-lg"
                                                    value={deadline}
                                                    min={getTodayDate()}
                                                    onChange={(e) => setDeadline(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-semibold">Lampiran File</label>
                                            <input 
                                                type="file" 
                                                className="w-full border p-3 rounded-lg"
                                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                                required
                                            />
                                            <p className="text-gray-500">kirim file berupa pdf. jpg.</p>
                                        </div>
                                    
                                        <button type="submit" className="bg-[#125E9C] text-white p-3 rounded-lg font-bold mt-4">
                                            Simpan
                                        </button>
                                    </form>
                                </div>
                            </div>

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
                                            <p className="text-sm text-red-500 md:ml-[46px] translate-y-2">Tenggat Waktu: {item.deadline}</p>
                                        )}

                                        {/* Input file hanya muncul jika tipe tugas dan role siswa */}
                                        {item.tipe === "tugas" && kelas.role === "siswa" && (
                                            <input type="file" className="mt-2 block border p-1" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>}

                        {tabDetail === "orang" && (
                            <div className="md:w-[785px] border-1 border-black rounded-[15px] p-8 mt-50 bg-white shadow-sm">
                                {/* Bagian Guru */}
                                <div className="mb-8">
                                    <div className="flex justify-between items-center border-b border-black pb-2 mb-4">
                                        <h2 className="text-2xl font-bold">Guru</h2>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {kelas?.anggota?.guru?.map((g: any, index: number) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-gray-100"></div>
                                                <p className="font-semibold">{g.nama}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                    
                                {/* Bagian Siswa */}
                                <div>
                                    <div className="flex justify-between items-center border-b border-black pb-2 mb-4">
                                        <h2 className="text-2xl font-bold">Siswa</h2>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {kelas?.anggota?.siswa?.map((s: any, index: number) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-gray-100"></div>
                                                <p className="font-semibold">{s.nama}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

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