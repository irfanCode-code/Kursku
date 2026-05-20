"use client"

import{ Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import React, { useState } from "react" 
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Register() {
    const [showPass, setShowPass] = useState(false)

    return(
        <main>
      <header className="border-b-4 border-[#7E7F97]">
        <img src="/logo.png" alt="logo" className="md:h-[110px] md:w-[110px] md: ml-[110px]" />
      </header>

      <form>
       <FieldGroup className="flex items-center md:mt-[200px]">
         <div className="flex flex-col md:mr-[139px]">
           <p className="text-[32px] font-bold">Daftar</p>
           <p className="text-[15px] md:mt-[10px]"></p>
         </div>

         <Field className="max-w-sm">
            <FieldLabel htmlFor="input-required">Nama<span className="text-destructive">*</span></FieldLabel>
            <InputGroup className="md:h-[45px] md:w-[368px]">
            <InputGroupInput id="nama" type="text" name="nama" placeholder="Masukkan nama" required className="md:placeholder:text-[18px] md:mt-[5px]"/>
            </InputGroup>
         </Field>
         
         <Field className="max-w-sm">
           <FieldLabel htmlFor="input-required">Email<span className="text-destructive">*</span>
           </FieldLabel>
           <InputGroup className="md:h-[45px] md:w-[368px]">
           <InputGroupInput id="email" type="email" name="email" placeholder="Masukan email" required className="md:placeholder:text-[18px] md:mt-[5px]"/>
           </InputGroup>
         </Field>

         <Field className="max-w-sm">
           <FieldLabel htmlFor="input-required">Password<span className="text-destructive">*</span>
           </FieldLabel>
           <InputGroup className="md:h-[45px] md:w-[368px]">
             <InputGroupInput id="password" name="password" type={showPass ? "text": "password"} placeholder="Masukan password" required className="md:placeholder:text-[18px]"/>
             <InputGroupAddon align="inline-end">
               <button type="button" onClick={() => setShowPass(!showPass)} className="md:mr-[10px]">
                 {showPass ? <EyeOffIcon />: <EyeIcon />}
               </button>
             </InputGroupAddon>
           </InputGroup>
         </Field>

         <Field className="max-w-sm">
            <FieldLabel htmlFor="input-required">Confirm Password <span className="text-dectructive">*</span></FieldLabel>
            <InputGroup className="md:h-[45px] md:w-[368px]">
            <InputGroupInput id="confirmPassword" name="confirm password" type={showPass ?"text": "password"} placeholder="Masukkan password" required className="md:placeholder:text-[18px]"></InputGroupInput>
            <InputGroupAddon align="inline-end">
                <button type="button" onClick={() => setShowPass(!showPass)} className="md:mr-[10px]">
                {showPass ? <EyeOffIcon />: <EyeIcon/>}
                    </button>
            </InputGroupAddon>
            </InputGroup>
         </Field>

         <Button type="submit" className="md:w-[368px] md:h-[45px] md:mr-[15px] bg-[#125E9C] md:text-[20px] hover:bg-[#133C5D]">Daftar</Button>      
       </FieldGroup>
      </form>
    </main>
    )
}