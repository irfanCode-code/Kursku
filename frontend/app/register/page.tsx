'use client'

import React, { useState } from "react"
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { error } from "console";

export default function RegisPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const mutation = useMutation({
        mutationFn: (newUserData: typeof formData) => {
            return axios.post('http://localhost:8080/api/register', newUserData);
        },
        onSuccess: () => {
            alert("berhasil daftar");
        },
        onError: (error) => {
            alert("gagal daftar: " + error.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return(
        <div>
            <header>
                <div>
                    <a href=""><img src="" alt="" /></a>
                </div>
            </header>

            <main>

            </main>

            <footer>
                
            </footer>
        </div>
    )
}