import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Navbar() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    async function handleSignOut() {
        'use server'
        const supabase = createClient()
        await supabase.auth.signOut()
        redirect('/auth/login')
    }




    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-indigo-600">
                            My Blog
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Home
                            </Link>
                            <Link href="/posts/public" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Public Posts
                            </Link>
                            <Link href="/posts/create" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Create Post
                            </Link>
                            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Auth Links */}
                    {!user && <div className="hidden md:block">
                        <div className="ml-4 flex items-center space-x-4">
                            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Login
                            </Link>
                            <Link href="/auth/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    </div>}

                    {user && <div className="hidden md:block">
                        <div className="ml-4 flex items-center space-x-4 hover:cursor-pointer">
                            <form action={handleSignOut}>
                                <button type='submit'>Sign out</button>
                            </form>
                        </div>
                    </div>}

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button className="text-gray-600 hover:text-gray-900 hover:cursor-pointer p-2">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}