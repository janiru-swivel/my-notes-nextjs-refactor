"use client";

import { ref, push, set, update, remove, onValue } from "firebase/database";
import { auth, database } from "../lib/firebaseConfig"; // Adjust the import path if necessary
import { useState, useEffect, useContext, createContext } from "react";

// Context and Provider for Posts
const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [trash, setTrash] = useState([]);
  const [sortOption, setSortOption] = useState("date");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Fetch posts from Firebase
      const postsRef = ref(database, `users/${user.uid}/notes`);
      onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        const loadedPosts = data
          ? Object.keys(data).map((key, index) => ({
              id: key,
              index,
              ...data[key],
            }))
          : [];
        setPosts(loadedPosts);
      });

      // Fetch trash from Firebase
      const trashRef = ref(database, `users/${user.uid}/trash`);
      onValue(trashRef, (snapshot) => {
        const data = snapshot.val();
        const loadedTrash = data
          ? Object.keys(data).map((key, index) => ({
              id: key,
              index,
              ...data[key],
            }))
          : [];
        setTrash(loadedTrash);
      });
    }
  }, []);

  const onAddPost = (post) => {
    const user = auth.currentUser;
    if (user) {
      const userPostsRef = ref(database, `users/${user.uid}/notes`);
      const newPostRef = push(userPostsRef); // Generate a new post ID
      set(newPostRef, post);
    }
  };

  const onUpdatePost = (id, updatedPost) => {
    const user = auth.currentUser;
    if (user) {
      const postRef = ref(database, `users/${user.uid}/notes/${id}`);
      update(postRef, updatedPost); // Update post data in Firebase
    }
  };

  const onMoveToTrash = (id) => {
    const user = auth.currentUser;
    if (user) {
      const postRef = ref(database, `users/${user.uid}/notes/${id}`);
      const trashRef = ref(database, `users/${user.uid}/trash/${id}`);

      // Move post to trash and delete from notes
      onValue(postRef, (snapshot) => {
        const post = snapshot.val();
        if (post) {
          set(trashRef, post) // Add post to trash
            .then(() => remove(postRef)); // Remove from notes after moving to trash
        }
      });
    }
  };

  const onRestorePost = (id) => {
    const user = auth.currentUser;
    if (user) {
      const trashRef = ref(database, `users/${user.uid}/trash/${id}`);
      const postRef = ref(database, `users/${user.uid}/notes/${id}`);

      // Move post from trash back to notes
      onValue(trashRef, (snapshot) => {
        const post = snapshot.val();
        if (post) {
          set(postRef, post) // Add back to notes
            .then(() => remove(trashRef)); // Remove from trash after restoring
        }
      });
    }
  };

  const onPermanentlyDelete = (id) => {
    const user = auth.currentUser;
    if (user) {
      const trashRef = ref(database, `users/${user.uid}/trash/${id}`);
      remove(trashRef); // Permanently remove the post from trash
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        trash,
        sortOption,
        setSortOption,
        onAddPost,
        onUpdatePost,
        onMoveToTrash,
        onRestorePost,
        onPermanentlyDelete,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

// Custom hook to use the PostContext
export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};
