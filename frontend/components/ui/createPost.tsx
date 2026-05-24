// components/ui/CreatePostDrawer.tsx
import React, { useState } from "react";

interface CreatePostDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onPost: (description: string, image: File | null) => void; // Tambahkan ini
}

export default function CreatePostDrawer({ isOpen, onClose, onPost }: CreatePostDrawerProps) {
    const [image, setImage] = useState<File | null>(null);
    const [description, setDescription] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />
            
            {/* Side Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-white z-[70] shadow-2xl transition-transform duration-300 transform p-8 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">buat postingan</h2>
                    <button onClick={onClose} className="text-3xl text-slate-500 hover:text-red-500">×</button>
                </div>

                {/* Kotak Input Gambar */}
                <div className="mb-8">
                    <label className="block w-full h-[220px] border border-gray-300 rounded-[20px] shadow-[0px_4px_15px_rgba(0,0,0,0.1)] cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden">
                        {image ? (
                            <img src={URL.createObjectURL(image)} alt="preview" className="w-full h-full object-contain p-2" />
                        ) : (
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                {/* Ikon Folder Custom */}
                                <div className="mt-4 ml-4">
                                    <div className="relative inline-block text-black">
                                        <svg width="60" height="50" viewBox="0 0 24 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 2H4C2.9 2 2.01 2.9 2.01 4L2 16C2 17.1 2.9 18 4 18H20C21.1 18 22 17.1 22 16V6C22 4.9 21.1 4 20 4H12L10 2Z" />
                                        </svg>
                                        <div className="absolute -bottom-1 -right-2 bg-black text-white rounded-full border-[3px] border-white w-7 h-7 flex items-center justify-center">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-gray-500 font-medium">Masukkan Postingan</span>
                            </div>
                        )}
                        {/* Input file asli disembunyikan */}
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                </div>

                {/* Input Deskripsi */}
                <div className="mb-8">
                    <label className="block text-xl font-bold text-slate-900 mb-4">Deskripsi Postingan</label>
                    <input 
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-2xl py-4 px-5 text-slate-700 shadow-[0px_4px_15px_rgba(0,0,0,0.1)] outline-none focus:ring-2 focus:ring-[#1a65a7]" 
                        placeholder="Masukkan Deskripsi Postingan"
                    />
                </div>

                {/* Tombol Posting */}
                <button 
                    onClick={() => {
                        // 1. Validasi gambar (Wajib diisi)
                        if (!image) {
                            alert("unggah gambar kamu dulu ya!");
                            return; // Hentikan proses jika tidak ada gambar
                        }

                        // 2. Validasi deskripsi (Opsional, tapi sangat disarankan agar teks tidak kosong)
                        if (!description.trim()) {
                            alert("Deskripsi postingan tidak boleh kosong!");
                            return;
                        }

                        // Jika kedua syarat terpenuhi, jalankan fungsi posting
                        onPost(description, image);
                        onClose();
                        setDescription("");
                        setImage(null);
                    }} 
                    className="bg-[#165a9e] px-10 py-3 rounded-full font-medium text-white hover:bg-[#124a82] shadow-[0px_4px_10px_rgba(0,0,0,0.25)] transition-colors tracking-wide"
                >
                    Posting
                </button>
            </div>
        </>
    );
}