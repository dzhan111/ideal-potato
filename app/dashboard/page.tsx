// app/dashboard/page.tsx
import Post from '@/components/post'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

async function handleSignOut() {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
}

export default async function Dashboard() {
    const supabase = createClient()

    // Get the current session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (!session) redirect('/auth/login')


    // Get user data
    const { data: { user } } = await supabase.auth.getUser()
    const { data: posts } = await supabase.from('posts').select("*").eq('author_id', user?.id)

    return (
        <>
            <div>
                Welcome {user?.user_metadata.username}
            </div>
            <p>Email: {user?.email}</p>
            <a href="/posts/public">See Public posts</a>
            <div> Your postsL
                {posts?.map((post) => (
                    <div key={post.id} className='border-2 border-gray-300 p-4 rounded-md'>
                        <Post post={post} />
                    </div>
                ))}
            </div>
            <form action={handleSignOut}>
                <button type='submit'>Sign out</button>
            </form>
        </>
    )
}