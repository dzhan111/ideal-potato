import { getCommentsCount, getLikesCount, isPostLikedByUser } from "@/utils/interactions";
import { FaRegComment } from "react-icons/fa";
import { createClient } from "@/utils/supabase/server";
import LikeButton from "./LikeButton";
import Link from "next/link";
interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string; // or Date if already parsed
  username: string;
  excerpt?: string;
}

export default async function Post({ post }: { post: Post }) {
    const supabase = createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    const { count: likesCount, error: likesError } = await getLikesCount(post.id)

    if (likesError) {
        console.error('Error fetching likes count:', likesError)
    }

    const { count: commentsCount, error: commentsError } = await getCommentsCount(post.id)

    if (commentsError) {
        console.error('Error fetching comments count:', commentsError)
    }

    // Check if current user liked this post
    let userLiked = false
    if (user) {
        const { isLiked } = await isPostLikedByUser(post.id, user.id)
        userLiked = isLiked
    }

    return (
        <article className='bg-white border border-gray-200 mx-auto max-w-2xl mt-5 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
            <Link href={`/posts/${post.id}`}>
                <h2 className='text-xl font-semibold text-gray-900 mb-2'>{post.title}</h2>
            </Link>

            <div className='flex items-center justify-between text-sm text-gray-600 mb-3'>
                <span>{post.username}</span>
                <span className='text-gray-500'>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            {post.excerpt && (
                <p className='text-gray-700 mb-3 italic'>{post.excerpt}</p>
            )}

            <div className='text-gray-800 mb-4 leading-relaxed'>
                {post.content}
            </div>

            <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                <div className='flex items-center space-x-6 text-sm text-gray-600'>
                    <LikeButton
                        postId={post.id}
                        initialLikesCount={likesCount || 0}
                        initialIsLiked={userLiked}
                        userId={user?.id}
                    />

                    <span className='flex items-center'>
                        <span className='mr-1'><FaRegComment /></span>
                        {commentsCount}
                    </span>
                </div>

                <Link href={`/posts/${post.id}`}>
                    <button className='text-indigo-600 hover:cursor-pointer text-sm font-medium'>
                        View Comments
                    </button>
                </Link>
            </div>
        </article>
    )
}