
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"


async function handleCreatePost(formData: FormData) {
    'use server'
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    if (!session) redirect('/auth/login')

    const title = formData.get('title')
    const excerpt = formData.get('excerpt')
    const content = formData.get('content')

    const { data, error: insertError } = await supabase.from('posts').insert({
        title: title,
        excerpt: excerpt,
        content: content,
        author_id: session.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published: true,
    })

    if (insertError) {
        console.error(insertError)
    } else {
        redirect('/dashboard')
    }
}

export default async function CreatePost() {

    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    if (!session) redirect('/auth/login')



    return (<>

        <form action={handleCreatePost}>
            <input name="title" placeholder="Title" ></input >
            <input name="excerpt" placeholder="Excerpt"></input >
            <input name="content" placeholder="Content"></input>

            <button type='submit'>Create Post</button>
        </form>

    </>
    )
}