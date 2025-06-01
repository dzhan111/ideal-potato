import CommentForm from '@/components/CommentForm'
import { handleAddComment } from '@/utils/actions'
import { getComments } from '@/utils/interactions'
import { createClient } from '@/utils/supabase/server'

export default async function PostPage({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Get comments
    const { data: comments, error: commentsError } = await getComments(id)

    if (commentsError) {
        console.error('Error loading comments:', commentsError)
    }

    return <div>
        <h1>Post Page</h1>
        <p>Post ID: {id}</p>

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

            <CommentForm postId={id} onSubmit={handleAddComment} isAuthenticated={!!user} />
        </div>
    </div>
}