import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

async function handleCreatePost(formData: FormData) {
    'use server'
    const supabase = createClient()
    // eslint-disable-next-line no-console
    const { data: { user }, error } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const title = formData.get('title')
    const excerpt = formData.get('excerpt')
    const content = formData.get('content')

    const { data, error: insertError } = await supabase.from('posts').insert({
        title: title,
        excerpt: excerpt,
        content: content,
        author_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        username: user.user_metadata.username,
        published: true,
    })

    if (insertError) {
        console.error(insertError)
    } else {
        redirect('/dashboard')
    }
}

export default async function CreatePost() {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    if (!session) redirect('/auth/login')

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
                    <p className="text-gray-600">Share your thoughts with the world</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <form action={handleCreatePost} className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title *
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Enter your post title..."
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-lg placeholder-gray-400"
                            />
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                                Excerpt
                            </label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                rows={2}
                                placeholder="Brief description of your post (optional)..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none placeholder-gray-400"
                            />
                            <p className="mt-1 text-sm text-gray-500">This will appear as a preview on your post cards</p>
                        </div>

                        {/* Content */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Content *
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                rows={12}
                                placeholder="Write your post content here..."
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y placeholder-gray-400"
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                    Publishing as <span className="font-medium">{session?.user.user_metadata.username}</span>
                                </span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Publish Post
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Tips */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">✨ Writing Tips</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Use a compelling title that captures attention</li>
                        <li>• Write a concise excerpt to give readers a preview</li>
                        <li>• Break up long content with paragraphs for better readability</li>
                        <li>• Your post will be published immediately after submission</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}