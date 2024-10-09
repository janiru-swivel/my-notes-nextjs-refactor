"use client"; // Ensure this is a client component

import { usePosts } from "../home/PostContext"; // Adjust the import path if necessary
import Navbar from "../components/NavBar/Navbar";
import "../home/HomeStyles.css";
import { PostProvider } from "../home/PostContext"; // Import the PostProvider

function TrashPage() {
  const { trash, onPermanentlyDelete, onRestorePost } = usePosts();

  return (
    <div>
      <Navbar />
      <br />
      <ul className="post-list">
        {trash.length === 0 ? (
          <p>No items in trash</p>
        ) : (
          trash.map((post) => (
            <li key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <div className="action-buttons">
                <button
                  className="trash-btn"
                  onClick={() => onPermanentlyDelete(post.id)}
                >
                  Delete Permanently
                </button>
                <button
                  className="edit-btn"
                  onClick={() => onRestorePost(post.id)}
                >
                  Restore
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

// Wrapper component to provide context
function TrashPageWrapper() {
  return (
    <PostProvider>
      <TrashPage />
    </PostProvider>
  );
}

export default TrashPageWrapper;
