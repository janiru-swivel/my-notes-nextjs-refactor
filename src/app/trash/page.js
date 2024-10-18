// src/app/trash/page.js
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/NavBar/Navbar";
import "../home/HomeStyles.css";
import {
  fetchTrash,
  selectTrash,
  permanentlyDelete,
  restorePost,
} from "../features/postSlice";
function TrashPage() {
  const dispatch = useDispatch();
  const trash = useSelector(selectTrash);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch trash data when component mounts
  useEffect(() => {
    dispatch(fetchTrash());
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this post?"
    );
    if (confirmDelete) {
      setDeletingId(id);
      dispatch(permanentlyDelete(id)).finally(() => setDeletingId(null));
    }
  };

  const handleRestore = (id) => {
    dispatch(restorePost(id));
  };

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

export default TrashPage;
