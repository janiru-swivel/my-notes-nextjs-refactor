"use client";

import { memo, useState } from "react";
import { usePosts, PostProvider } from "./PostContext";
import PropTypes from "prop-types";
import Navbar from "../components/NavBar/Navbar";
import "./HomeStyles.css";
import Search from "../components/SearchBar/Search";

function Home() {
  return (
    <div>
      <Navbar />
      <section>
        <PostProvider>
          <Search />
          <Main />
          <Footer />
        </PostProvider>
      </section>
    </div>
  );
}

const Main = memo(function Main() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <main>
      <button className="open-btn" onClick={toggleFormVisibility}>
        {isFormVisible ? "-" : "+"}
      </button>
      {isFormVisible && (
        <FormAddPost toggleFormVisibility={toggleFormVisibility} />
      )}
      <Posts />
    </main>
  );
});

function FormAddPost({ toggleFormVisibility }) {
  const { onAddPost } = usePosts();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !body) return;
    const currentTime = new Date().toLocaleString(); // Add current time
    onAddPost({ title, body, lastUpdated: currentTime });
    setTitle("");
    setBody("");
    toggleFormVisibility(); // Close the form after adding a post
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-styles">
          <div className="form-header">
            <h2>Add Note</h2>
            <div className="close-btn" onClick={toggleFormVisibility}>
              &times;
            </div>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Post body"
            rows="4"
          />
          <button type="submit">Add post</button>
        </div>
      </form>
    </div>
  );
}

FormAddPost.propTypes = {
  toggleFormVisibility: PropTypes.func.isRequired,
};

function Posts() {
  const { posts, onUpdatePost, onMoveToTrash, sortOption } = usePosts();

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOption === "date") {
      return new Date(b.lastUpdated) - new Date(a.lastUpdated); // Sort by date (latest to oldest)
    } else if (sortOption === "title") {
      return a.title.localeCompare(b.title); // Sort alphabetically by title (A-Z)
    } else {
      return a.index - b.index; // Default sorting by index
    }
  });

  return (
    <ul className="post-list">
      {sortedPosts.map((post) => (
        <EditablePost
          key={post.id}
          post={post}
          onUpdate={onUpdatePost}
          onMoveToTrash={onMoveToTrash}
        />
      ))}
    </ul>
  );
}

function EditablePost({ post, onUpdate, onMoveToTrash }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);

  const handleSave = () => {
    if (title.trim() && body.trim()) {
      const currentTime = new Date().toLocaleString(); // Add current time
      onUpdate(post.id, { title, body, lastUpdated: currentTime });
      setIsEditing(false);
    }
  };

  return (
    <li className="post-card">
      {isEditing ? (
        <div className="edit-mode">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Post body"
          />
          <div className="action-buttons">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <div className="action-buttons">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button
              className="trash-btn"
              onClick={() => onMoveToTrash(post.id)}
            >
              Move to Trash
            </button>
          </div>
        </div>
      )}
      <div className="last-updated">
        Last Updated: {post.lastUpdated ? post.lastUpdated : "Not updated yet"}
      </div>
    </li>
  );
}

EditablePost.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    index: PropTypes.number, // Ensure index is included in prop types
    lastUpdated: PropTypes.string, // Last updated time
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onMoveToTrash: PropTypes.func.isRequired,
};

function Footer() {
  return <footer>&copy; by Janiru</footer>;
}

export default Home;
