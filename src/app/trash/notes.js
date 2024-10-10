import { usePosts } from "../context/PostContext"; // Adjust the import path

function Notes() {
  const { posts, loading } = usePosts(); // Access posts and loading state

  if (loading) {
    return <div>Loading posts...</div>; // Show this while loading
  }

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}

export default Notes;
