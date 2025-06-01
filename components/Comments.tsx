import { getComments } from '@/utils/interactions'
import { createClient } from '@/utils/supabase/server'
import { handleDeleteComment } from '@/utils/actions'

export default async function Comments({ postId }: { postId: string }) {
    const supabase = createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    // Use existing getComments function
    const { data: comments, error } = await getComments(postId)

    if (error) {
        console.error('Error loading comments:', error)
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
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Comments ({comments.length})
            </h3>

            {comments.map((comment: any) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                                {comment.profiles?.username || 'Anonymous'}
                            </span>
                            <span className="text-sm text-gray-500">
                                {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Delete button - only show for comment author */}
                        {user && user.id === comment.user_id && (
                            <form action={async (formData) => {
                                await handleDeleteComment(comment.id, postId)
                            }}>
                                <button
                                    type="submit"
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Delete
                                </button>
                            </form>
                        )}
                    </div>

                    <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
                </div>
            ))}
        </div>
    )
}