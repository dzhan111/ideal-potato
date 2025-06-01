import { createClient } from '@/utils/supabase/server'

// Like functions
export async function toggleLike(postId: string, userId: string) {
    const supabase = createClient()

    // Check if user already liked the post
    const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single()

    if (existingLike) {
        // Unlike the post
        const { error } = await supabase
            .from('likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', userId)

        return { success: !error, liked: false, error }
    } else {
        // Like the post
        const { error } = await supabase
            .from('likes')
            .insert({ post_id: postId, user_id: userId })

        return { success: !error, liked: true, error }
    }
}

export async function getLikesCount(postId: string) {
    const supabase = createClient()

    const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)

    return { count: count || 0, error }
}

export async function isPostLikedByUser(postId: string, userId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single()

    return { isLiked: !!data, error }
}

// Comment functions
export async function addComment(postId: string, userId: string, content: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('comments')
        .insert({
            post_id: postId,
            user_id: userId,
            content: content,
            created_at: new Date().toISOString()
        })
        .select()

    return { data, error }
}

export async function getComments(postId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('comments')
        .select(`
            id,
            content,
            created_at,
            user_id,
            profiles(username)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false })

    return { data, error }
}

export async function getCommentsCount(postId: string) {
    const supabase = createClient()

    const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)

    return { count: count || 0, error }
}

export async function deleteComment(commentId: string, userId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', userId) // Only allow users to delete their own comments

    return { success: !error, error }
}

// Combined function to get post with likes and comments data
export async function getPostWithInteractions(postId: string, userId?: string) {
    const supabase = createClient()

    // Get post data
    const { data: post, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

    if (postError || !post) {
        return { post: null, error: postError }
    }

    // Get likes count
    const { count: likesCount } = await getLikesCount(postId)

    // Get comments count
    const { count: commentsCount } = await getCommentsCount(postId)

    // Check if user liked the post (if userId provided)
    let isLiked = false
    if (userId) {
        const { isLiked: userLiked } = await isPostLikedByUser(postId, userId)
        isLiked = userLiked
    }

    return {
        post: {
            ...post,
            likes: likesCount,
            comments: commentsCount,
            isLiked
        },
        error: null
    }
} 