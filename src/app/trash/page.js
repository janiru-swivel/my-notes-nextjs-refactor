"use client"; // Ensure this is a client component

import { usePosts } from "../home/PostContext"; // Adjust the import path if necessary
import Navbar from "../components/NavBar/Navbar";
import "../home/HomeStyles.css";
import { PostProvider } from "../home/PostContext"; // Import the PostProvider
import { useState } from "react";

// Add loading and error states
function TrashPage() {
  const { trash, onPermanentlyDelete, onRestorePost, loading, error } =
    usePosts();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this post?"
    );
    if (confirmDelete) {
      setDeletingId(id);
      onPermanentlyDelete(id);
    }
  };

  const handleRestore = (id) => {
    onRestorePost(id);
  };

  if (loading) {
    return <div className="loading-spinner">Loading trash items...</div>; // Spinner or text while loading
  }

  if (error) {
    return (
      <div className="error-message">Error loading trash: {error.message}</div>
    );
  }

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
                  onClick={() => handleDelete(post.id)}
                  disabled={deletingId === post.id}
                >
                  {deletingId === post.id
                    ? "Deleting..."
                    : "Delete Permanently"}
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleRestore(post.id)}
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
