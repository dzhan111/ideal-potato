import { createClient } from "@/utils/supabase/client"

interface CommentProps {
    comment: {
        id: string
        content: string
        created_at: string
        user_id: string
        username?: string
    }
}

export default function Comment({ comment }: CommentProps) {
    return (
        <div>
            <div>
                <span>{comment.username || 'Anonymous'}</span>
                <span> {comment.user_id} </span>
                <span>{new Date(comment.created_at).toLocaleDateString()}</span>
            </div>
            <p>{comment.content}</p>
        </div>
    )
} 