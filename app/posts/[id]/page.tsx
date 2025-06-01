export default function PostPage({ params }: { params: { id: string } }) {
    return (
        <div>
            <h1>Post ID: {params.id}</h1>
        </div>
    )
}