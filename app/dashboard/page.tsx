// app/dashboard/page.tsx
import Post from '@/components/post'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function handleSignOut() {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
}

async function getDashboardStats(userId: string) {
    const supabase = createClient()

    // Get posts count
    const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', userId)

    // Get total likes received on user's posts
    const { count: likesCount } = await supabase
        .from('likes')
        .select('posts!inner(*)', { count: 'exact', head: true })
        .eq('posts.author_id', userId)

    // Get followers count (people following this user)
    const { count: followersCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId)

    // Get following count (people this user follows)
    const { count: followingCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId)

    return {
        posts: postsCount || 0,
        likes: likesCount || 0,
        followers: followersCount || 0,
        following: followingCount || 0
    }
}

export default async function Dashboard() {
    const supabase = createClient()

    // Get the current session
    const { data: { session }, error } = await supabase.auth.getSession()
    console.log(error)
    if (!session) redirect('/auth/login')

    // Get user data
    const { data: { user } } = await supabase.auth.getUser()

    // Get user's posts
    const { data: posts } = await supabase
        .from('posts')
        .select("*")
        .eq('author_id', user?.id)
        .order('created_at', { ascending: false })

    // Get dashboard stats
    const stats = await getDashboardStats(user?.id!)

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {user?.user_metadata.username}!
                        </h1>
                        <p className="text-gray-600 mt-1">{user?.email}</p>
                    </div>
                    <form action={handleSignOut}>
                        <button
                            type='submit'
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border hover:cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Sign Out
                        </button>
                    </form>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Posts</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.posts}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.likes}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Followers</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.followers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Following</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.following}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link
                        href="/posts/create"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-6 text-center transition-colors"
                    >
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="font-semibold">Create New Post</p>
                    </Link>

                    <Link
                        href="/posts/public"
                        className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg p-6 text-center transition-colors"
                    >
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <p className="font-semibold">Browse Posts</p>
                    </Link>

                    <div className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 text-center transition-colors cursor-pointer">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 00-2 2z" />
                        </svg>
                        <p className="font-semibold">Analytics</p>
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">Your Recent Posts</h2>
                            <span className="text-sm text-gray-500">{posts?.length || 0} total posts</span>
                        </div>
                    </div>

                    <div className="p-6">
                        {posts && posts.length > 0 ? (
                            <div className="space-y-6">
                                {posts.slice(0, 3).map((post) => (
                                    <Post key={post.id} post={post} />
                                ))}

                                {posts.length > 3 && (
                                    <div className="text-center pt-4">
                                        <p className="text-gray-500">
                                            And {posts.length - 3} more posts...
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                                <p className="text-gray-500 mb-4">Get started by creating your first blog post</p>
                                <Link
                                    href="/posts/create"
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Create Your First Post
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}