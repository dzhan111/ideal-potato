import Link from "next/link";

export default function Post({ post }: { post: any }) {
    return (
        <article className='bg-white border border-gray-200 mx-auto max-w-2xl mt-5 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
            <Link href={`/posts/${post.id}`}>
                <h2 className='text-xl font-semibold text-gray-900 mb-2'>{post.title}</h2>
            </Link>


            <div className='flex items-center text-sm text-gray-600 mb-3 space-x-4'>
                <span>{post.username}</span>
                <span></span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            {post.excerpt && (
                <p className='text-gray-700 mb-3 italic'>{post.excerpt}</p>
            )}

            <div className='text-gray-800 mb-4 leading-relaxed'>
                {post.content}
            </div>

            <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                <div className='flex items-center space-x-6 text-sm text-gray-600'>
                    <span className='flex items-center'>
                        <span className='mr-1'>💬</span>
                        {post.comments} comments
                    </span>
                    <span className='flex items-center'>
                        <span className='mr-1'>❤️</span>
                        {post.likes} likes
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