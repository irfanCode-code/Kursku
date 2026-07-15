'use client'

import { useEffect, useState } from "react"

export default function login() {
    const [count, setCount] = useState(0);

    useEffect(() => {
  console.log('Runs when count changes');
}, [count]);
    return(
        <div>
            <p>nilai: {count}</p>
            <button onClick={() => {setCount(count + 1)}}>tambah</button>
        </div>
    )
}