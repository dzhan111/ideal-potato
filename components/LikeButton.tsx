'use client'

import { useState, useTransition } from 'react'
import { FaRegHeart, FaHeart } from 'react-icons/fa'
import { createClient } from '@/utils/supabase/client'

interface LikeButtonProps {
    postId: string
    initialLikesCount: number
    initialIsLiked?: boolean
    userId?: string
}

export default function LikeButton({
    postId,
    initialLikesCount,
    initialIsLiked = false,
    userId
}: LikeButtonProps) {
    const [likesCount, setLikesCount] = useState(initialLikesCount)
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [isPending, startTransition] = useTransition()

    const supabase = createClient()

    const handleLike = async () => {
        if (!userId) {
            // Redirect to login if not authenticated
            window.location.href = '/auth/login'
            return
        }

        // Optimistic update
        const newIsLiked = !isLiked
        const newCount = newIsLiked ? likesCount + 1 : likesCount - 1

        setIsLiked(newIsLiked)
        setLikesCount(newCount)

        startTransition(async () => {
            try {
                if (newIsLiked) {
                    // Add like
                    const { error } = await supabase
                        .from('likes')
                        .insert({ post_id: postId, user_id: userId })
                        console.log(error)
                } else {
                    // Remove like
                    const { error } = await supabase
                        .from('likes')
                        .delete()
                        .eq('post_id', postId)
                        .eq('user_id', userId)
                    console.log(error)
                }
                
            } catch (error) {
                // Revert optimistic update on error
                setIsLiked(!newIsLiked)
                setLikesCount(likesCount)
                console.error('Error toggling like:', error)
            }
        })
    }

    return (
        <button
            onClick={handleLike}
            disabled={isPending}
            className='flex items-center space-x-1 text-md text-gray-600 hover:cursor-pointer transition-colors disabled:opacity-50'
        >
            <span className={`transition-colors ${isLiked ? 'text-red-500' : 'text-gray-600'}`}>
                {isLiked ? <FaHeart /> : <FaRegHeart />}
            </span>
            <span> {likesCount}</span>
        </button>
    )
} 