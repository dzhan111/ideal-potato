export default function Post({ post }: { post: any }) {

    return (
        <div className='border-2 border-gray-300 p-4 rounded-md'>
            <h2>{post.title}</h2>
            <p>Author: {post.username}</p>
            <p>Date: {post.created_at}</p>
            <p>{post.excerpt}</p>
            <p>{post.content}</p>
            <p>Comments: {post.comments}</p>
            <a> Comments </a>
            <p>Likes: {post.likes}</p>
            
        </div>
    )
}