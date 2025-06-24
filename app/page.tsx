import Link from 'next/link'

export default async function Page() {
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

            <Link href="/auth/login" className="block">Login</Link>
            <Link href="/auth/signup" className="block">Signup</Link>
            <Link href="/posts/create" className="block">Create Post</Link>
        </>
    )
}
