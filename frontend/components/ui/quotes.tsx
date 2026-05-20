"use client"

import { Card } from "@/components/ui/card"

const quotesData = [
    {
        quotes: "Dulu kalau mentok ngerjain tugas cuma bisa pasrah. Sejak pakai platform ini, tinggal lempar pertanyaan ke forum diskusi, langsung dibantu anak kelas sebelah. Bonusnya, sekarang avatar saya sudah pakai Gold Border dari hasil ngumpulin poin jawab soal!",
        author: "James Clear",
        role: "siswa",
        avatar: "J",
        border: "border-gold"
    },
    {
        quotes: "Belajar paling seru itu kalau kita bisa ngejelasin materi ke orang lain. Di sini, tiap kali saya bantu jawab soal matematika temen-temen minimal 20 karakter, langsung dapet +5 poin. Berasa kayak main RPG tapi versinya dapet ilmu!",
        author: "Charles Duhigg",
        role: "siswa",
        avatar: "C",
        border: "border-silver"
    },
    {
        quotes: "Biasanya di platform lain siswa cenderung pasif kalau dikasih materi kelas formal. Tapi di sini, sistem integrasi poinnya bikin anak-anak saling berpacu buat diskusi dan bantu temannya yang kesulitan. Manajemen kelas jadi jauh lebih hidup.",
        author: "Arthur Conan",
        role: "guru",
        avatar: "A",
        border: "border-bronze"
    }
]

export default function quotes() {
    return(
        <section className="w-full py-16 border-t border-b overflow-hidden md:my-60">
            <div className="max-w-5xl px-4 mb-10 text-center space-y-2 mx-auto">
                <h2 className="text-2xl">Kata beberapa pengguna</h2>
            </div>

            <div className="relative w-full flex overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,transparent_5%,white_20%,white_80%,transparent_95%,transparent)]">
                <div className="flex gap-6 shrink-0 w-max animate-marquee py-4">

                    {[...quotesData, ...quotesData].map((item, idx) => (
                        <Card key={`orig-${idx}`} className="w-[350px] p-6 rounded-2xl flex flex-col justify-between space-y-4">
                            <p>"{item.quotes}"</p>
                            <div className="flex items-center gap-3 pt-2 border-t">
                                <div className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${item.border}`}>
                                    {item.avatar}
                                </div>
                                <div>
                                    <h4 className="">{item.author}</h4>
                                    <p>{item.role}</p>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {[...quotesData, ...quotesData].map((item, idx) => (
                        <Card key={`orig-${idx}`} className="w-[350px] p-6 rounded-2xl flex flex-col justify-between space-y-4">
                            <p>"{item.quotes}"</p>
                            <div className="flex items-center gap-3 pt-2 border-t">
                                <div className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${item.border}`}>
                                    {item.avatar}
                                </div>
                                <div>
                                    <h4>{item.author}</h4>
                                    <p>{item.role}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}