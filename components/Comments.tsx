import { getComments } from '@/utils/interactions'
import { createClient } from '@/utils/supabase/server'
import { handleAddComment, handleDeleteComment } from '@/utils/actions'
import CommentForm from './CommentForm'

export default async function Comments({ postId }: { postId: string }) {
    const supabase = createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    // Use existing getComments function
    const { data: comments, error: commentsError } = await getComments(postId)

    if (commentsError) {
        console.error('Error loading comments:', commentsError)
        return <div className="text-red-500">Error loading comments</div>
    }

    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No comments yet. Be the first to comment!</p>
            </div>
        )
    }

    return (
        <div>
            <h2>Comments ({comments?.length || 0})</h2>

            {comments && comments.length > 0 ? (
                <div>
                    {comments.map((comment: any) => (
                        <div key={comment.id}>
                            <div>
                                <span>User {comment.user_id.slice(0, 8)}...</span>
                                <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p>{comment.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <p>No comments yet.</p>
                </div>
            )}

            <CommentForm postId={postId} onSubmit={handleAddComment} isAuthenticated={!!user} />
        </div>
    )
}