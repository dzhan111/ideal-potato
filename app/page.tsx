
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
    // const cookieStore = cookies()
    // const supabase = createClient(cookieStore)

    // const { data: todos } = await supabase.from('todos').select()

    return (
        <ul>
            <p>big dawg</p>
            <a href="/auth/login">Login</a> <br></br>
            <a href="/auth/signup">Signup</a>
            <a href="/posts/create">Create Post</a>
        </ul>
    )
}
