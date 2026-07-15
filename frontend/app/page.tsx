import axios from "axios"
import Link from "next/link"


export default function mainPage() {
  return (
    <div className="mt-20  h-100 border-b-2 border-[#7E7F97]">
      <div className="flex flex-col justify-start items-start mt-25 ml-5 gap-25">
        <p className="font-semibold text-[20px] w-50">Mari Belajar Bersama di Kursku!</p>
        <button className=" h-10 w-35 text-[12px] rounded-[12] bg-[#112F58] text-white font-semibold">Bergabung sekarang</button>
      </div>

      <div className="mt-25 h-200 flex flex-col items-center">
        <p className="text-[20px] mt-20">FItur yang ada </p>
        <div className="grid grid-row-2 gap-4 mt-20">
          <div className="border-2 border-black h-50 w-75 rounded-[15] hover:-translate-y-2">
            <p className="mt-5 ml-5">Diskusi Tugas & Catatan</p>
          </div>
          <div className="border-2 border-black h-50 w-75 rounded-[15] flex mt-10 hover:-translate-2">
            <p className="mt-5 ml-5">Kelas Belajar</p>
          </div>
        </div>
      </div>

      <div className="h-150">
      </div>
    </div>
  )
}