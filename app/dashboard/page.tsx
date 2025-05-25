// app/dashboard/page.tsx
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

    if (!session) {
        redirect('/auth/login')
    }

    // Get user data
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <>
            <div>
                Welcome {user?.user_metadata.username}
            </div>
            <p>Email: {user?.email}</p>
            <form action={handleSignOut}>
                <button type='submit'>Sign out</button>
            </form>
        </>
    )
}