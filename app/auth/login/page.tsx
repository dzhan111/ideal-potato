'use client'
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
                    <p className="mt-2 text-gray-600">Welcome back to your blog</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>

                {/* Test credentials */}
                <div className="text-center text-xs text-gray-500 bg-gray-100 p-3 rounded-lg">
                    <p className="font-medium mb-1">Test accounts:</p>
                    <p>gurt@gmail.com / gggggg</p>
                    <p>d@gmail.com / 123456</p>
                </div>
            </div>
        </div>
    );
}