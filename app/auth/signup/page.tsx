'use client'
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const supabase = createClient();
    const router = useRouter();


    const handleSignUp = async () => {
        const { error } = await supabase.auth.signUp({

            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        })

        if (error) {
            setError(error.message);
        } else {
            setError(null);
            router.push('/dashboard');
        }
    }
    return (<div>
        <h1>Signup</h1>
        <input placeholder='Username' onChange={(e) => setUsername(e.target.value)}></input>
        <input placeholder='Email' onChange={(e) => setEmail(e.target.value)}></input>
        <input placeholder='Password' onChange={(e) => setPassword(e.target.value)}></input>

        <button onClick={handleSignUp}>Sign up</button>

        {error && <p>{error}</p>}
    </div>
    );


}