import Post from "@/components/post"
import { createClient } from "@/utils/supabase/server"

export default async function PublicPosts() {
    const supabase = createClient()
    const { data: posts } = await supabase.from('posts').select("*").eq('published', true)


    return (
        <div>
            {posts?.map((post) => (
                <div key={post.id}>
                    <Post post={post} />
                </div>
            ))}
        </div>
    )
}