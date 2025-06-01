'use client'
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {

    const [state, setState] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setError(null);
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                throw error;
            }

            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    }


    return (
        <div>
            <p>Test users: gurt@gmail.com, gggggg</p>
            <p>Test users: d@gmail.com, 123456</p>
            <h1>Login</h1>
            <input placeholder='Email' onChange={(e) => setEmail(e.target.value)}></input>
            <input placeholder='Password' onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={handleLogin}>Login</button>

            {error && <p>{error}</p>}
            {loading && <p>Loading...</p>}
        </div>
    );
}