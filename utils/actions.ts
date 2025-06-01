'use server'

import { addComment, deleteComment } from '@/utils/interactions'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function handleAddComment(postId: string, formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const content = formData.get('content') as string

    if (!content?.trim()) {
        return { error: 'Comment cannot be empty' }
    }

    const { error } = await addComment(postId, user.id, content.trim())

    if (error) {
        return { error: 'Failed to add comment' }
    }

    revalidatePath(`/posts/${postId}`)
    return { success: true }
}

export async function handleDeleteComment(commentId: string, postId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { error } = await deleteComment(commentId, user.id)

    if (error) {
        return { error: 'Failed to delete comment' }
    }

    revalidatePath(`/posts/${postId}`)
    return { success: true }
}