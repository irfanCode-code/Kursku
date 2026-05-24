"use client"

import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"
import React, { useState } from "react"
import Link from "next/link"
import { useEffect } from "react"

export default function kursus() {
    const [daftarKelas, setDaftarKelas] = useState([
    // Data untuk Tab "Diikuti" (Role Siswa)
    { id: 1, nama: "Matematika", status: "diikuti", author: "James Clear", role: "siswa" },
    { id: 2, nama: "Bahasa Inggris", status: "diikuti", author: "Charles Duhigg", role: "siswa" },
    
    // Data untuk Tab "Kelasku" (Role Guru)
    { id: 3, nama: "Pemrograman Web", status: "dibuat", author: "Guru (kamu)", role: "guru", code: "WEB123" },
    { id: 4, nama: "Desain Grafis", status: "dibuat", author: "Guru (kamu)", role: "guru", code: "DSN456" },
])
    useEffect(() => {
    const saved = localStorage.getItem("daftarKelas");
    if (saved) {
        setDaftarKelas(JSON.parse(saved));
    }
}, []);

    const [tabAktif, setTabAktif] = useState<"diikuti" | "kelasku">("diikuti")
    const [activeModal, setActiveModal] = useState<"join" | "buat" | null>(null)
    const [inputValue, setInputValue] = useState("")
    const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()}

    const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Cari apakah ada kelas dengan kode yang cocok
    const kelasDitemukan = daftarKelas.find((k) => k.code === inputValue.trim().toUpperCase());

    if (kelasDitemukan) {
        // Jika ditemukan, join kelas
        const kelasBaru = {
            id: Date.now(),
            nama: `Ikut: ${kelasDitemukan.nama}`,
            status: "diikuti",
            author: kelasDitemukan.author,
            role: "siswa"
        };
        setDaftarKelas([...daftarKelas, kelasBaru]);
        setInputValue("");
        setActiveModal(null);
        setTabAktif("diikuti");
    } else {
        // Jika tidak ditemukan, tampilkan error
        alert("Kode kelas tidak ditemukan! Silakan periksa kembali kode Anda.");
    }
};

    const handleBuatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const kelasBaru = {
        id: Date.now(),
        nama: inputValue,
        status: "dibuat",
        author: "Guru (kamu)",
        role: "guru",
        code: newCode 
    };

    const dataBaru = [...daftarKelas, kelasBaru];
    setDaftarKelas(dataBaru);
    localStorage.setItem("daftarKelas", JSON.stringify(dataBaru)); // Simpan
    
    setInputValue("");
    setActiveModal(null);
    setTabAktif("kelasku");
}

    const kelasTampil = daftarKelas.filter((kelas) => {
        if (tabAktif === "diikuti") {
            return kelas.status === "diikuti"
        } else {
            return kelas.status === "dibuat"
        }
    })
    return(
        <div>
            <Navbar />
            <div className="md:mt-[100px]  flex md:h-[200px] justify-between">
                <div className="flex md:ml-[230px] gap-7 md:mt-[150px]">
                    <button onClick={() => {
                        setTabAktif("diikuti")
                    }} className={`cursor-pointer pb-2 px-2 relative ${tabAktif === "diikuti" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-800"}`}>Diikuti</button>
                                        <button onClick={() => {
                        setTabAktif("kelasku")
                    }} className={`cursor-pointer pb-2 px-2 relative ${tabAktif === "kelasku" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-800"}`}>Kelasku</button>
                </div>

                <div className="flex md:mr-[250px] md:mt-[140px] gap-10">
                    <div onClick={() => setActiveModal("join")} className="flex bg-[#A5C8FF] md:pt-[10px] md:mb-[5px] md:pl-[10px] md:pr-[10px] rounded-[40px] cursor-pointer">
                        <img src="/join.png" alt="join" className="md:h-[40px] md:w-[40px]" />
                        <p className="text-[26px] md:ml-[5px]">Join Kelas</p>
                    </div>
                    <div onClick={() => setActiveModal("buat")} className="flex bg-[#A5C8FF] md:mb-[5px] md:pt-[12px] md:pl-[10px] md:pr-[10px] rounded-[40px] cursor-pointer  ">
                        <img src="/plus.png" alt="Buat Kelas" className="md:h-[29px] md:w-[29px] md:mt-[3px]" />
                        <p className="text-[24px] md:ml-[5px]">Buat Kelas</p>
                    </div>
                </div>
            </div>
                    <hr className="border-1 border-black md:w-[1500px] md:ml-[200px]" />

            <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12 ">
                {kelasTampil.map((kelas) => (
        <Link href={`/kelas/${kelas.id}`} key={kelas.id} className="border border-gray-200 shadow-sm flex flex-col h-64 rounded-[15px] md:mb-[100px]">
            <div className="w-full bg-[#D9D9D9] flex items-center justify-center rounded-t-[15px]">
                <img src="/openBook.png" alt="kelas" />
            </div>

            <div className="bg-[#A5C8FF] p-4 rounded-b-[15px] flex flex-col justify-between h-full">
                <div>
                    <div className="text-[30px] font-bold">{kelas.nama}</div>
                    <div className="text-[15px]">{kelas.author}</div>
                </div>
                {/* Bagian badge role sudah dihapus agar kartu tetap bersih */}
            </div>
        </Link>
    ))}
              {kelasTampil.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400">
                  Belum ada kelas
                </div>
              )}
            </div>

            {activeModal === "join" && (
                <div className="bg-white/30 flex justify-center items-center fixed inset-0 backdrop-blur-xs">
                    <div className="bg-white md:w-[701px] md:h-[357px] shadow-xl/20 rounded-[15px] overflow-hidden relative">
                        <h3 className="md:text-[28px] md:mt-[80px] md:ml-[124px]">Join Kelas</h3>
                        <form onSubmit={handleJoinSubmit} className=" md:ml-[124px]">
                            <input type="text" autoFocus value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Masukan Kode Kelas" className="border-1 border-black md:w-[487px] md:h-[60px] rounded-[20px] md:mt-[15px] md:placeholder:text-[24px] text-[24px] pl-6" />
                            <div className="gap-10 flex">
                                <button type="button" onClick={() => {
                                    setActiveModal(null)
                                    setInputValue("")
                                }} className="text-[26px] md:mt-[30px] bg-[#125E9C] md:w-[144px] md:h-[51px] rounded-[31px] text-white cursor-pointer">Batal</button>
                                <button type="submit" className="text-[26px] md:mt-[30px] bg-[#125E9C] md:w-[144px] md:h-[51px] rounded-[31px] text-white cursor-pointer">Join</button>
                            </div>
                        </form>

                        <hr className="md:border-[5px] md:w-[250px] border-black absolute md:ml-[500px] -rotate-45" />
                        <hr className="md:border-[5px] md:w-[250px] border-black absolute md:ml-[530px] -rotate-45" />
                        <hr className="md:border-[5px] md:w-[250px] border-black absolute md:ml-[560px] -rotate-45" />
                        <hr className="md:border-[5px] md:w-[250px] border-black absolute md:ml-[590px] -rotate-45" />
                    </div>
                </div>
            )}

            {activeModal === "buat" && (
                <div className="bg-white/30 flex justify-center items-center fixed inset-0 backdrop-blur-xs">
                    <div className="bg-white md:w-[701px] md:h-[357px] shadow-xl/20 rounded-[15px] overflow-hidden relative">
                        <h3 className="md:text-[28px] md:mt-[80px] md:ml-[124px]">Buat Kelas</h3>
                        <form onSubmit={handleBuatSubmit} className="md:ml-[124px]">
                            <input type="text" autoFocus value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Masukan Judul Kelas" className="border-1 border-black md:w-[487px] md:h-[60px] rounded-[20px] md:mt-[15px] md:placeholder:text-[24px] text-[24px] pl-6" />
                            <div className="gap-10 flex">
                                <button type="button" onClick={() => {
                                    setActiveModal(null)
                                    setInputValue("")
                                }} className="text-[26px] md:mt-[30px] bg-[#125E9C] md:w-[144px] md:h-[51px] rounded-[31px] text-white cursor-pointer">Batal</button>
                                <button type="submit" className="text-[26px] md:mt-[30px] bg-[#125E9C] md:w-[144px] md:h-[51px] rounded-[31px] text-white cursor-pointer">Buat</button>
                            </div>
                        </form>

                        <hr className="md:border-[5px] md:w-[250px] border-black absolute md:ml-[500px] -rotate-45" />
                        <hr className="md:border-[5px] md:w-[250px] border-black absolute md:ml-[530px] -rotate-45" />
                        <hr className="md:border-[5px] md:w-[250px] border-black absolute md:ml-[560px] -rotate-45" />
                        <hr className="md:border-[5px] md:w-[250px] border-black absolute md:ml-[590px] -rotate-45" />
                    </div>
                </div>
            )}
            <Footer />
        </div>
    )
}