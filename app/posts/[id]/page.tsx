import CommentForm from '@/components/CommentForm'
import { handleAddComment } from '@/utils/actions'
import { getComments } from '@/utils/interactions'
import { createClient } from '@/utils/supabase/server'
import Comment from '@/components/Comment'

export default async function PostPage({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: post, error: postError } = await supabase.from('posts').select('*').eq('id', id).single()

    // Get comments
    const { data: comments, error: commentsError } = await getComments(id)

    if (commentsError) {
        console.error('Error loading comments:', commentsError)
    }

    return <div>
        <h1>Post Page</h1>
        <p>Post ID: {id}</p>

        <div>
            <h2>Post</h2>

            <p>{post.title}</p>
            <p>{post.content}</p>
            <p>{post.author_id}</p>
            <p>{post.created_at}</p>
            <p>{post.updated_at}</p>
            <p>Likes {post.likes}</p>
        </div>

        <div>
            <h2>Comments ({comments?.length || 0})</h2>

            {comments && comments.length > 0 ? (
                <div>
                    {comments.map((comment: any) => (
                        <Comment key={comment.id} comment={comment} />
                    ))}
                </div>
            ) : (
                <div>
                    <p>No comments yet. Write your thoughts below!</p>
                </div>
            )}

            <CommentForm postId={id} onSubmit={handleAddComment} isAuthenticated={!!user} />
        </div>
    </div>
}