"use client"

import { useParams } from "next/navigation"
import React, { useEffect, useState, useRef } from "react"
import Navbar from "@/components/ui/navbar"

export default function DetailKelas() {
    const params = useParams()
    const idKelas = params.id
    const [kelas, setKelas] = useState<any>(null)
    const [tabDetail, setTabDetail] = useState<"forum" | "tugas" | "nilai">("forum")
    const [tipeDipilih, setTipeDipilih] = useState<"materi" | "tugas">("materi")
    const [daftarKonten, setDaftarKonten] = useState<any[]>([])
    const [judulInput, setJudulInput] = useState("")
    const [deadline, setDeadline] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [showDropDown, setShowDropDown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [deskripsi, setDeskripsi] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [sortNilai, setSortNilai] = useState<"nama" | "nilai">("nilai")
    const [dataNilai, setDataNilai] = useState<Record<string, Record<number, number>>>({})

    const getTodayDate = () => {
        const today = new Date()
        return today.toISOString().split('T')[0]
    }

    // Tutup dropdown saat klik luar
    useEffect(() => {
        function handleClickOut(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropDown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOut)
        return () => document.removeEventListener("mousedown", handleClickOut)
    }, [])

    // Load konten kelas
    useEffect(() => {
        const saved = localStorage.getItem(`konten_${idKelas}`)
        if (!saved) {
            const dataDummy = [
                { id: 1, tipe: "materi", judul: "Pengenalan Dasar Pemrograman", deadline: null },
                { id: 2, tipe: "tugas", judul: "Tugas Membuat Website Sederhana", deadline: "2026-06-01" }
            ]
            setDaftarKonten(dataDummy)
            localStorage.setItem(`konten_${idKelas}`, JSON.stringify(dataDummy))
        } else {
            setDaftarKonten(JSON.parse(saved))
        }
    }, [idKelas])

    // Load data nilai
    useEffect(() => {
        const saved = localStorage.getItem(`nilai_${idKelas}`)
        if (saved) setDataNilai(JSON.parse(saved))
    }, [idKelas])

    // Load data kelas
    useEffect(() => {
        const data = localStorage.getItem("daftarKelas")
        if (data) {
            const parsedData = JSON.parse(data)
            const found = parsedData.find((k: any) => k.id.toString() === idKelas)
            setKelas(found)
        }
    }, [idKelas])

    const handleBuatTugas = (e: React.FormEvent) => {
        e.preventDefault()
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
        setDeskripsi("")
        setFile(null)
    }

    const hitungRataRata = (namaSiswa: string) => {
        const nilaiSiswa = dataNilai[namaSiswa]
        if (!nilaiSiswa) return null
        const vals = Object.values(nilaiSiswa)
        if (vals.length === 0) return null
        return Math.round(vals.reduce((a: number, b: number) => a + b, 0) / vals.length)
    }

    const hitungRataRataTugas = (tugasId: number) => {
        const siswaList: any[] = kelas?.anggota?.filter((a: any) => a.role === "siswa") ?? []
        const vals: number[] = []
        siswaList.forEach((s: any) => {
            const v = dataNilai[s.nama]?.[tugasId]
            if (typeof v === "number") vals.push(v)
        })
        if (vals.length === 0) return null
        return Math.round(vals.reduce((a: number, b: number) => a + b, 0) / vals.length)
    }

    if (!kelas) return <div className="p-10">Kelas tidak ditemukan atau sedang memuat...</div>

    return (
        <div>
            <Navbar />
            <div className="md:mt-[100px]">

                {/* Tampilan Guru */}
                {kelas.role === "guru" && (
                    <div className="flex">
                        {/* Sidebar */}
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
                                    onClick={() => setTabDetail("nilai")}
                                    className={`cursor-pointer md:h-[50px] md:w-[245px] rounded-[29px] ${tabDetail === "nilai" ? "bg-blue-200" : "bg-white"}`}
                                >
                                    Nilai
                                </button>
                            </div>
                        </div>

                        {/* Konten */}
                        <div className="w-full h-[100vh] flex flex-col items-center">

                            {/* Tab Forum */}
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
                                </div>
                            }

                            {/* Tab Tugas */}
                            {tabDetail === "tugas" &&
                                <div ref={dropdownRef}>
                                    <button
                                        className="flex bg-[#A5C8FF] md:mt-[72px] md:w-[200px] md:h-[50px] justify-center items-center gap-3 rounded-[40px] cursor-pointer"
                                        onClick={() => setShowDropDown(!showDropDown)}
                                    >
                                        <img src="/plus.png" alt="plus" className="md:h-[30px] md:w-[30px]" />
                                        <p>Buat Tugas</p>
                                    </button>

                                    {showDropDown && (
                                        <div className="absolute mt-2 w-[200px] bg-[#E9E9F7] rounded-xl shadow-lg border border-black p-2 z-10 left-185 bottom-165">
                                            <button
                                                onClick={() => { setShowModal(true); setTipeDipilih("tugas"); setShowDropDown(false) }}
                                                className="w-full text-left p-2 font-bold hover:bg-white rounded"
                                            >
                                                Tugas
                                            </button>
                                            <button
                                                onClick={() => { setShowModal(true); setTipeDipilih("materi"); setShowDropDown(false) }}
                                                className="w-full text-left p-2 font-bold hover:bg-white rounded"
                                            >
                                                Materi
                                            </button>
                                        </div>
                                    )}

                                    {/* Overlay modal */}
                                    {showModal && (
                                        <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowModal(false)} />
                                    )}

                                    {/* Panel modal */}
                                    <div className={`fixed top-0 right-0 h-full w-[400px] bg-[#F1F3FF] z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${showModal ? "translate-x-0" : "translate-x-full"}`}>
                                        <div className="p-8">
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
                                                        required={tipeDipilih === "tugas"}
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
                                                <img src="/tugas.png" alt="task" className="md:w-[31px] md:h-[31px] md:mt-[2px]" />
                                                <span className={`px-2 py-1 text-xs font-bold rounded flex items-center md:ml-[10px] ${item.tipe === "tugas" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                                                    {item.tipe.toUpperCase()}
                                                </span>
                                                <h3 className="font-bold text-lg mt-2 md:ml-[20px] -translate-y-1">{item.judul}</h3>
                                                {item.tipe === "tugas" && (
                                                    <p className="text-sm text-red-500 md:ml-[46px] translate-y-2">Tenggat Waktu: {item.deadline}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }

                            {/* Tab Nilai */}
                            {tabDetail === "nilai" && (
                                <div className="md:w-[785px] mt-10 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <select
                                            value={sortNilai}
                                            onChange={(e) => setSortNilai(e.target.value as "nama" | "nilai")}
                                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white cursor-pointer"
                                        >
                                            <option value="nama">Urutkan Berdasarkan Nama</option>
                                            <option value="nilai">Urutkan Berdasarkan Nilai Tertinggi</option>
                                        </select>
                                    </div>
                                    <div className="overflow-x-auto border border-gray-200 rounded-[15px]">
                                        <table className="w-full border-collapse text-sm">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="text-left p-3 border-b border-r border-gray-200 w-[180px]"></th>
                                                    {daftarKonten.filter(k => k.tipe === "tugas").map((t, i) => (
                                                        <th key={i} className="p-3 border-b border-r border-gray-200 text-center text-gray-500 font-medium">
                                                            {t.judul}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="bg-gray-50">
                                                    <td className="p-3 border-b border-r border-gray-200 text-gray-500">Rata-rata Nilai</td>
                                                    {daftarKonten.filter(k => k.tipe === "tugas").map((t, i) => (
                                                        <td key={i} className="p-3 border-b border-r border-gray-200 text-center text-gray-500">
                                                            {hitungRataRataTugas(t.id) !== null ? `${hitungRataRataTugas(t.id)}/100` : ""}
                                                        </td>
                                                    ))}
                                                </tr>
                                                {(kelas?.anggota?.filter((a: any) => a.role === "siswa") ?? [])
                                                    .sort((a: any, b: any) => {
                                                        if (sortNilai === "nilai") {
                                                            return (hitungRataRata(b.nama) ?? -1) - (hitungRataRata(a.nama) ?? -1)
                                                        }
                                                        return a.nama.localeCompare(b.nama)
                                                    })
                                                    .map((s: any, i: number) => (
                                                        <tr key={i}>
                                                            <td className="p-3 border-b border-r border-gray-200">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-7 h-7 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-xs font-medium">
                                                                        {s.nama.charAt(0)}
                                                                    </div>
                                                                    <span>{s.nama}</span>
                                                                </div>
                                                            </td>
                                                            {daftarKonten.filter(k => k.tipe === "tugas").map((t, j) => (
                                                                <td key={j} className="p-3 border-b border-r border-gray-200 text-center">
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        max={100}
                                                                        placeholder="—"
                                                                        value={dataNilai[s.nama]?.[t.id] ?? ""}
                                                                        onChange={(e) => {
                                                                            const val = Number(e.target.value)
                                                                            const updated = {
                                                                                ...dataNilai,
                                                                                [s.nama]: {
                                                                                    ...dataNilai[s.nama],
                                                                                    [t.id]: val
                                                                                }
                                                                            }
                                                                            setDataNilai(updated)
                                                                            localStorage.setItem(`nilai_${idKelas}`, JSON.stringify(updated))
                                                                        }}
                                                                        className="w-[70px] text-center border border-gray-200 rounded-lg p-1 text-sm"
                                                                    />
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tampilan Siswa */}
                {kelas.role === "siswa" && (
                    <div className="flex flex-col items-center md:mt-[50px] gap-6 md:px-[200px]">
                        <div className="w-full border-1 border-black rounded-[15px] pb-6">
                            {daftarKonten.length === 0 && (
                                <p className="text-center text-gray-400 py-12">Belum ada materi atau tugas</p>
                            )}
                            {daftarKonten.map((item) => (
                                <div key={item.id} className="p-4 border-b-1 border-black flex gap-4 items-start">
                                    <span className={`px-2 py-1 text-xs font-bold rounded ${item.tipe === "tugas" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                                        {item.tipe.toUpperCase()}
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">{item.judul}</h3>
                                        {item.tipe === "tugas" && (
                                            <p className="text-sm text-red-500">Tenggat Waktu: {item.deadline}</p>
                                        )}
                                        {item.tipe === "tugas" && (
                                            <input type="file" className="mt-2 block border p-1 rounded" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}