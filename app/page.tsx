
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
    // const cookieStore = cookies()
    // const supabase = createClient(cookieStore)

    // const { data: todos } = await supabase.from('todos').select()

    return (
        <>
            <p>Ideal Potatoes</p>

            <pre className="font-mono text-green-500 text-xs">
                {`       .---.
        /     \\
        | () () |
        \\  ^  /
        |||||
        |||||`}
            </pre>
            <a href="/auth/login">Login</a> <br></br>
            <a href="/auth/signup">Signup</a>
            <a href="/posts/create">Create Post</a>
        </>
    )
}
