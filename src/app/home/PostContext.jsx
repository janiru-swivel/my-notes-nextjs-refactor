"use client"; // Make sure this file is used on the client-side

import { ref, push, set, update, remove, onValue } from "firebase/database";
import { auth, database } from "../lib/firebaseConfig";
import { useState, useEffect, useContext, createContext } from "react";

// Context and Provider for Posts
const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [trash, setTrash] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Added searchQuery
  const [loading, setLoading] = useState(false); // Added loader for async operations
  const [sortOption, setSortOption] = useState("date");

  // Fetch posts and trash on mount and when searchQuery changes
  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setLoading(true);
      const postsRef = ref(database, `users/${user.uid}/notes`);
      const trashRef = ref(database, `users/${user.uid}/trash`);

      const fetchPosts = () => {
        onValue(postsRef, (snapshot) => {
          const data = snapshot.val();
          const loadedPosts = data
            ? Object.keys(data).map((key, index) => ({
                id: key,
                index,
                ...data[key],
              }))
            : [];
          const filteredPosts = loadedPosts.filter((post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setPosts(sortPosts(filteredPosts, sortOption)); // Filter and Sort posts after fetching
          setLoading(false); // Stop loading after fetching posts
        });
      };

      const fetchTrash = () => {
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
      };

      fetchPosts();
      fetchTrash();
    }
  }, [sortOption, searchQuery]); // Trigger fetch when sortOption or searchQuery changes

  // Sorting posts based on the selected sort option
  const sortPosts = (posts, option) => {
    switch (option) {
      case "date":
        return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "title":
        return posts.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return posts;
    }
  };

  // Add a new post
  const onAddPost = async (post) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userPostsRef = ref(database, `users/${user.uid}/notes`);
        const newPostRef = push(userPostsRef); // Generate a new post ID
        await set(newPostRef, post);
      } catch (error) {
        console.error("Error adding post:", error);
      }
    }
  };

  // Update an existing post
  const onUpdatePost = async (id, updatedPost) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const postRef = ref(database, `users/${user.uid}/notes/${id}`);
        await update(postRef, updatedPost); // Update post data in Firebase
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  };

  // Move a post to the trash
  const onMoveToTrash = async (id) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const postRef = ref(database, `users/${user.uid}/notes/${id}`);
        const trashRef = ref(database, `users/${user.uid}/trash/${id}`);

        // Move post to trash and delete from notes
        onValue(postRef, async (snapshot) => {
          const post = snapshot.val();
          if (post) {
            await set(trashRef, post); // Add post to trash
            await remove(postRef); // Remove from notes after moving to trash
          }
        });
      } catch (error) {
        console.error("Error moving post to trash:", error);
      }
    }
  };

  // Restore a post from trash back to notes
  const onRestorePost = async (id) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const trashRef = ref(database, `users/${user.uid}/trash/${id}`);
        const postRef = ref(database, `users/${user.uid}/notes/${id}`);

        // Move post from trash back to notes
        onValue(trashRef, async (snapshot) => {
          const post = snapshot.val();
          if (post) {
            await set(postRef, post); // Add back to notes
            await remove(trashRef); // Remove from trash after restoring
          }
        });
      } catch (error) {
        console.error("Error restoring post:", error);
      }
    }
  };

  // Permanently delete a post from the trash
  const onPermanentlyDelete = async (id) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const trashRef = ref(database, `users/${user.uid}/trash/${id}`);
        await remove(trashRef); // Permanently remove the post from trash
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        trash,
        loading, // Provide loading state
        sortOption,
        setSortOption, // Allow to set the sort option
        searchQuery,
        setSearchQuery, // Allow to set search query
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
