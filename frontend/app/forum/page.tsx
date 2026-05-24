"use client"

import Navbar from "@/components/ui/navbar"
import Footer from "@/components/ui/footer"
import React, { useState } from "react"
import Link from "next/link"
import CreatePostDrawer from "@/components/ui/createPost"

interface PostinganType {
    id: number;
    isi: string;
    comment: number;
    suka: number;
    notif: boolean;
    isLiked: boolean;
    gambar: string | null;
}

export default function Forum() {
    const [daftarPosting, setDaftarPosting] = useState<PostinganType[]>([
        {
            id: 1, 
            isi: "ini bagaimana cara menyelesaikannya?", 
            comment: 1, 
            suka: 5, 
            notif: true, 
            isLiked: false, 
            gambar: "/post1dum.png"
        },
    ]);

    const [isCommentOpen, setIsCommentOpen] = useState(false)
    const [activePostId, setActivePostId] = useState<number | null>(null)
    const [inputComment, setInputComment] = useState("")
    const [selectImage, setSelectImage] = useState<string | null>(null)
    const [reportPostId, setReportPostId] = useState<number | null>(null)
    const [reportReason, setReportReason] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [activeCommentMenu, setActiveCommentMenu] = useState<number | null>(null)
    const [reportCommentId, setReportCommentId] = useState<number | null>(null)

    const [listComment, setListComment] = useState([
        {id: 1, postId: 1, user: "jamesClear", text: "coba kamu tambahkan tanda koma di belakangnya nanti akan ketemu jawabannya."}
    ])

const handleLikeClick = (id: number) => {
        setDaftarPosting(daftarPosting.map((post) => {
            if (post.id === id) {
                return {
                    ...post,
                    suka: post.isLiked ? post.suka - 1 : post.suka + 1,
                    isLiked: !post.isLiked
                }
            }
            return post
        }))
    }

    const handleCommentOpen = (id: number) => {
        setActivePostId(id)
        setIsCommentOpen(true)
    }

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault()
        if(!inputComment.trim() || activePostId === null) return
        setListComment([...listComment, {
            id: Date.now(), 
            postId: activePostId,
            user: "kamu",
            text: inputComment
        }])

        setDaftarPosting(daftarPosting.map((p) => p.id === activePostId ? { ...p, comment: p.comment + 1} : p))
        setInputComment("")
    }

    const handleDeleteComment = (commentId: number, postId: number) => {
        // Hapus komentar dari listComment
        setListComment(listComment.filter((c) => c.id !== commentId))
        
        // Kurangi jumlah komentar di postingan utama
        setDaftarPosting(daftarPosting.map((p) => 
            p.id === postId ? { ...p, comment: p.comment - 1 } : p
        ))
        setActiveCommentMenu(null) // Tutup menu
    }

    // Fungsi untuk membalas (menambahkan @username ke input)
    const handleReply = (username: string) => {
        setInputComment(`@${username} `)
        setActiveCommentMenu(null) // Tutup menu
    }

    const handleAddNewPost = (description: string, image: File | null) => {
        const newPost = {
            id: Date.now(), // ID unik berdasarkan waktu
            isi: description,
            comment: 0,
            suka: 0,
            notif: true,
            isLiked: false,
            gambar: image ? URL.createObjectURL(image) : null // Pastikan gambar tampil
        };
    
    setDaftarPosting([newPost, ...daftarPosting]);
};



    return(
        <div className="md:mt-[100px]">
            <Navbar />
            <CreatePostDrawer 
                isOpen={isCreateOpen} 
                onClose={() => setIsCreateOpen(false)} 
                onPost={handleAddNewPost} />
            <div className="md:mt-[100px] flex md:h-[150px] justify-end items-center px-4 md:mr-[250px]">
                <button
                    className="flex bg-[#A5C8FF] py-3 px-6 rounded-[40px] cursor-pointer hover:bg-[#8eb6ff] transition-colors items-center gap-2" onClick={() => setIsCreateOpen(true)}>
                    <img src="/plus.png" alt="Tambah" className="md:h-[24px] md:w-[24px]" />
                    <p className="text-[22px] font-medium text-slate-900">Buat Postingan</p>
                </button>
            </div>

            <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-6 mb-20 px-4">
                {daftarPosting.map((post) => (
                    <div 
                        key={post.id} className="border border-gray-200 shadow-md flex flex-col h-[380px] rounded-[20px] overflow-hidden bg-[#D9D9D9] relative">
                        {post.notif && (
                            <div className="absolute top-4 right-4 bg-white/80 p-1.5 rounded-full backdrop-blur-xs z-20 cursor-pointer hover:bg-red-100 hover:scale-110 transition-all" onClick={(e) => {
                                    e.stopPropagation()
                                    setReportPostId(post.id)
                                }}
                            >
                                <span className="text-red-500 font-bold text-xl block w-6 h-6 text-center leading-5 border-2 border-red-500 rounded-full">!</span>
                            </div>
                        )}

                        <div className="flex-grow">{post.gambar && (
                            <img src={post.gambar} alt="postingan gambar" className="absolute inset-0 w-full h-full object-cover z-0 cursor-pointer" onClick={() => setSelectImage(post.gambar)} />
                        )}</div>

                        <div className="bg-[#A5C8FF] p-5 flex items-center justify-between border-t border-blue-200 z-10">
                            <p className="text-[18px] text-slate-900 font-medium leading-snug truncate max-w-[180px]">
                                {post.isi}
                            </p>
                            
                            <div className="flex items-center gap-4 text-slate-900">
                                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleCommentOpen(post.id)}>
                                    <img src="/comment.png" alt="comment"  className="text-xl" /> 
                                    <span className="text-[18px] font-bold">{post.comment}</span>
                                </div>
                                <div className="flex items-center gap-1 cursor-pointer select-none active:scale-95 transition-transform" onClick={() => handleLikeClick(post.id)}>
                                    <img src={post.isLiked ? "/likered.png" : "/like.png"} alt="like" className="w-[30px] h-[30px] transition-all" />
                                    <span className={`text-[18px] font-bold transition-colors ${post.isLiked ? "text-red-600" : ""}`}>{post.suka}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div onClick={() => setIsCommentOpen(false)} className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isCommentOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} />
            <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-[30px] shadow-xl z-50 h-[70vh] flex flex-col transition-all duration-300 transform ${isCommentOpen ? "translate-y-0" : "translate-y-full"}`}>
                <div className="w-full flex justify-center py-3 cursor-pointer" onClick={() => setIsCommentOpen(false)}>
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>

                <div className="px-6 pb-3 border-b border-gray-100 flex justify-between items-center">
                    <h4 className="text-xl font-bold">Komentar</h4>
                    <button onClick={() => setIsCommentOpen(false)} className="text-lg font-bold">x</button>
                </div>

                {activePostId !== null && (
                    <div className="bg-gray-100 px-20">
                        <p className="text-[18px]">Postingan asli</p>
                        <p className="text-[15px]">"{daftarPosting.find((p) => p.id === activePostId)?.isi}"</p>
                    </div>
                )}

                <div 
                    className="flex-grow p-6 overflow-y-auto space-y-4"
                    onClick={() => setActiveCommentMenu(null)} // Tutup menu jika klik area luar
                >
                    {listComment.filter((c) => c.postId === activePostId).map((komen) => (
                        <div key={komen.id} className="flex gap-3 items-start relative group">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-gray-200 shrink-0">
                                {komen.user[0].toUpperCase()}
                            </div>
                            <div className="bg-gray-100 px-4 py-2 rounded-xl max-w-[75%]">
                                <p className="text-sm font-bold mb-1">{komen.user}</p>
                                <p>{komen.text}</p>
                            </div>

                            {/* Menu Titik Tiga */}
                            <div className="relative flex items-center" onClick={(e) => e.stopPropagation()}>
                                <button 
                                    onClick={() => setActiveCommentMenu(activeCommentMenu === komen.id ? null : komen.id)}
                                    className="text-gray-500 hover:text-gray-800 px-2 py-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-xl font-bold"
                                >
                                    &#8942; {/* Simbol titik tiga vertikal */}
                                </button>

                                {/* Dropdown Menu */}
                                {activeCommentMenu === komen.id && (
                                    <div className="absolute top-8 left-0 bg-white border border-gray-200 shadow-lg rounded-xl py-2 w-32 z-50">
                                        <button 
                                            onClick={() => handleReply(komen.user)}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            Reply
                                        </button>
                                        
                                        {/* Logika: Jika user "kamu", tampilkan Delete. Jika bukan, tampilkan Report */}
                                        {komen.user === "kamu" ? (
                                            <button 
                                                onClick={() => handleDeleteComment(komen.id, komen.postId)}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => {
                                                    // Buka modal laporan komentar dan simpan ID-nya
                                                    setReportCommentId(komen.id);
                                                    setActiveCommentMenu(null);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                Report
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {listComment.filter((c) => c.postId === activePostId).length === 0 && (
                        <p className="text-center text-gray-500">Belum ada komentar</p>
                    )}
                </div>

                <form onSubmit={handleComment} className="p-4 border-t items-center gap-3 flex">
                    <input type="text" value={inputComment} onChange={(e) => setInputComment(e.target.value)} placeholder="tambahkan komentar" className="flex-grow border rounded-full px-5 py-2" />
                    <button className="text-[#112F58]" type="submit">Kirim</button>
                </form>

            </div>
                {selectImage && (
                    <div onClick={() => setSelectImage(null)} className="fixed inset-0 z-[60] bg-black/80 flex justify-center items-center">
                        <div>
                            <img src={selectImage} alt="preview" className="max-w-full max-h-[90vh] object-contain animate-[zoomIn_0.2s_ease-out]" />
                        </div>
                    </div>
                )}

                {reportPostId !== null && (
                    <div 
                    className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setReportPostId(null)}
                >
                    <div className="bg-white rounded-[20px] w-full max-w-md p-8 shadow-2xl animate-[zoomIn_0.2s_ease-out]" onClick={(e) => e.stopPropagation()} >
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Laporkan Postingan</h3>

                        <div className="border-2 border-[#8C93A1] rounded-2xl overflow-hidden mb-6">
                            {[ "informasi palsu", "mengandung makna sara", "aktifitas seksual", "kekerasan atau perilaku ilegal", "Perundungan"
                            ].map((reason, index, array) => (
                                <label key={index} className={`flex items-center gap-5 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${index !== array.length - 1 ? 'border-b-2 border-[#8C93A1]' : ''}`}>
                                    <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                                        <div className={`w-full h-full rounded-full border-[2.5px] ${reportReason === reason ? 'border-[#1a65a7]' : 'border-black'}`}></div>
                                        {reportReason === reason && (
                                            <div className="absolute w-3 h-3 bg-[#1a65a7] rounded-full" />
                                        )}
                                    </div>
                                    
                                    <input 
                                        type="radio" 
                                        name="reportReason" 
                                        value={reason}
                                        checked={reportReason === reason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        className="hidden"
                                    />
                                    <span className="text-[17px] text-slate-900 font-medium">{reason}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <button 
                                className="px-8 py-2.5 rounded-full text-white bg-[#1a65a7] hover:bg-[#15548c] shadow-lg font-medium text-lg transition-all cursor-pointer"
                                onClick={() => {
                                    if(!reportReason) return alert("Pilih alasan laporan terlebih dahulu!")
                                    
                                    alert(`Postingan berhasil dilaporkan`)

                                    setReportPostId(null)
                                    setReportReason("")
                                }}>
                                Laporkan
                            </button>
                            
                            <button 
                                className="px-5 py-2.5 rounded-full text-slate-500 hover:bg-gray-100 font-medium transition-colors cursor-pointer"
                                onClick={() => {
                                    setReportPostId(null)
                                    setReportReason("")
                                }}>
                                    Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {reportCommentId && (
                <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Laporkan Komentar</h3>
                        
                        {/* Box Pilihan Alasan (Sama persis seperti desain screenshot-mu) */}
                        <div className="border border-slate-300 rounded-2xl p-4 space-y-4 mb-6">
                            {[
                                "informasi palsu",
                                "mangandung makna sara",
                                "aktifitas seksual",
                                "kekerasan atau perilaku ilegal",
                                "Perundungan"
                            ].map((reason) => (
                                <label key={reason} className="flex items-center gap-4 cursor-pointer group pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                                    <input 
                                        type="radio" 
                                        name="reportCommentReason" 
                                        value={reason}
                                        checked={reportReason === reason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        className="w-5 h-5 text-[#1a65a7] border-gray-300 focus:ring-[#1a65a7] cursor-pointer"
                                    />
                                    <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors text-lg">
                                        {reason}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex items-center gap-4">
                            <button 
                                className="px-8 py-2.5 rounded-full text-white bg-[#1a65a7] hover:bg-[#15548c] shadow-lg font-medium text-lg transition-all cursor-pointer"
                                onClick={() => {
                                    if(!reportReason) return alert("Pilih alasan laporan terlebih dahulu!")
                                    
                                    alert(`Komentar berhasil dilaporkan`)

                                    setReportCommentId(null)
                                    setReportReason("")
                                }}>
                                Laporkan
                            </button>
                            
                            <button 
                                className="px-5 py-2.5 rounded-full text-slate-500 hover:bg-gray-100 font-medium transition-colors cursor-pointer"
                                onClick={() => {
                                    setReportCommentId(null)
                                    setReportReason("")
                                }}>
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />  
        </div>
    )
}
