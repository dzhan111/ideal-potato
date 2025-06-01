'use client'

import { useState, useRef } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors"
        >
            {pending ? 'Posting...' : 'Post Comment'}
        </button>
    )
}

interface CommentFormProps {
    postId: string
    onSubmit: (postId: string, formData: FormData) => Promise<{ error?: string; success?: boolean }>
    isAuthenticated: boolean
}

export default function CommentForm({ postId, onSubmit, isAuthenticated }: CommentFormProps) {
    const [error, setError] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    if (!isAuthenticated) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-600 mb-4">Please log in to leave a comment</p>
                <a
                    href="/auth/login"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                    Log In
                </a>
            </div>
        )
    }

    async function handleSubmit(formData: FormData) {
        setError(null)

        const result = await onSubmit(postId, formData)

        if (result.error) {
            setError(result.error)
        } else if (result.success) {
            formRef.current?.reset()
        }
    }

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Comment</h3>

            <form ref={formRef} action={handleSubmit} className="space-y-4">
                <div>
                    <textarea
                        name="content"
                        rows={4}
                        placeholder="Share your thoughts..."
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    />
                </div>

                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
} 