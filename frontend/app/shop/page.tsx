"use client"

import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"
import { useEffect, useState } from "react"
import axios from "axios"

type ShopItem = {
    id: number
    nama_item: string
    deskripsi: string
    harga_poin: number
    tipe: string
}

type OwnedItem = {
    shop_item_id: number
}

const getBorderColor = (namaItem: string) => {
    if (namaItem.toLowerCase().includes("emas") || namaItem.toLowerCase().includes("gold")) return "#FFD700"
    if (namaItem.toLowerCase().includes("perak") || namaItem.toLowerCase().includes("silver")) return "#C0C0C0"
    if (namaItem.toLowerCase().includes("perunggu") || namaItem.toLowerCase().includes("bronze")) return "#CD7F32"
    return "#A5C8FF"
}

export default function ShopPage() {
    const [items, setItems] = useState<ShopItem[]>([])
    const [ownedItems, setOwnedItems] = useState<number[]>([])
    const [poin, setPoin] = useState(0)
    const [loading, setLoading] = useState(true)
    const [beliLoading, setBeliLoading] = useState<number | null>(null)

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemsRes, ownedRes] = await Promise.all([
                    axios.get("http://localhost:8080/api/shop/items", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://localhost:8080/api/shop/owned", {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ])
                setItems(itemsRes.data.data ?? [])
                setOwnedItems((ownedRes.data.data ?? []).map((o: OwnedItem) => o.shop_item_id))
            } catch {
                // fallback dummy jika API belum siap
                setItems([
                    { id: 1, nama_item: "Border Perunggu", deskripsi: "Profil sederhana", harga_poin: 100, tipe: "avatar_frame" },
                    { id: 2, nama_item: "Border Perak", deskripsi: "Profil nuansa perak", harga_poin: 150, tipe: "avatar_frame" },
                    { id: 3, nama_item: "Border Emas", deskripsi: "Profil premium", harga_poin: 200, tipe: "avatar_frame" },
                ])
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [token])

    const handleBeli = async (itemId: number) => {
        setBeliLoading(itemId)
        try {
            const res = await axios.post("http://localhost:8080/api/shop/buy",
                { shop_item_id: itemId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            alert(res.data.message)
            setOwnedItems(prev => [...prev, itemId])
            if (res.data.sisa_poin !== undefined) setPoin(res.data.sisa_poin)
        } catch (err: any) {
            alert(err.response?.data?.message || "Gagal membeli item")
        } finally {
            setBeliLoading(null)
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 md:mt-[80px] px-[200px] py-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-[32px] font-bold">Toko Penukaran</h1>
                </div>

                {/* Grid Item */}
                {loading ? (
                    <div className="text-center text-gray-400 py-20">Memuat...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {items.map((item) => {
                            const borderColor = getBorderColor(item.nama_item)
                            const sudahDimiliki = ownedItems.includes(item.id)
                            return (
                                <div
                                    key={item.id}
                                    className="border border-gray-200 rounded-[12px] p-6 flex flex-col items-center gap-4 hover:shadow-md transition-shadow"
                                >
                                    {/* Preview Border */}
                                    <div
                                        className="w-[80px] h-[80px] rounded-full border-[5px] bg-transparent"
                                        style={{ borderColor }}
                                    ></div>

                                    {/* Nama */}
                                    <p className="text-[18px] font-semibold text-center">{item.nama_item}</p>

                                    {/* Harga */}
                                    <div className="flex items-center gap-1">
                                        <img src="/coin.png" alt="coin" className="md:h-[30px]" />
                                        <span className="text-[15px] font-medium">{item.harga_poin}</span>
                                    </div>

                                    {/* Tombol */}
                                    <button
                                        onClick={() => !sudahDimiliki && handleBeli(item.id)}
                                        disabled={sudahDimiliki || beliLoading === item.id}
                                        className={`w-full py-2 rounded-[8px] text-[15px] font-medium transition-colors ${
                                            sudahDimiliki
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                : "bg-gray-100 hover:bg-[#125E9C] hover:text-white cursor-pointer"
                                        }`}
                                    >
                                        {sudahDimiliki ? "Dimiliki" : beliLoading === item.id ? "Memproses..." : "Beli"}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    )
}