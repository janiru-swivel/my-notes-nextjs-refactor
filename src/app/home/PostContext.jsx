import { createContext, useContext, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { database, auth } from "../lib/firebaseConfig";
import { ref, set, push, onValue, remove } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";

const PostContext = createContext();

function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [trash, setTrash] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user] = useAuthState(auth); // Get the currently logged-in user

  useEffect(() => {
    if (!user) return; // Exit if no user is logged in

    const userPostsRef = ref(database, `users/${user.uid}/posts/`);
    const userTrashRef = ref(database, `users/${user.uid}/trash/`);

    // Fetch posts
    onValue(userPostsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedPosts = Object.keys(data).map((key, index) => ({
          id: key,
          ...data[key],
          index,
        }));
        setPosts(loadedPosts);
      } else {
        setPosts([]);
      }
    });

    // Fetch trash
    onValue(userTrashRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedTrash = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTrash(loadedTrash);
      } else {
        setTrash([]);
      }
    });
  }, [user]);

  function handleAddPost(post) {
    if (!user) return;
    const userPostsRef = ref(database, `users/${user.uid}/posts/`);
    const newPostRef = push(userPostsRef);
    set(newPostRef, post);
  }

  function handleUpdatePost(id, updatedPost) {
    if (!user) return;
    const postRef = ref(database, `users/${user.uid}/posts/${id}`);
    set(postRef, updatedPost);
  }

  function handleMoveToTrash(id) {
    if (!user) return;
    const postRef = ref(database, `users/${user.uid}/posts/${id}`);
    const trashRef = ref(database, `users/${user.uid}/trash/${id}`);

    // Move post to trash
    onValue(postRef, (snapshot) => {
      const post = snapshot.val();
      if (post) {
        set(trashRef, post).then(() => remove(postRef));
      }
    });
  }

  function handlePermanentlyDelete(id) {
    if (!user) return;
    const trashRef = ref(database, `users/${user.uid}/trash/${id}`);
    remove(trashRef);
  }

  function handleRestorePost(id) {
    if (!user) return;
    const trashRef = ref(database, `users/${user.uid}/trash/${id}`);
    const postsRef = ref(database, `users/${user.uid}/posts/`);
    const postIndex = posts.length;

    // Move post back to posts
    onValue(trashRef, (snapshot) => {
      const post = snapshot.val();
      if (post) {
        const newPostRef = push(postsRef);
        set(newPostRef, { ...post, index: postIndex }).then(() =>
          remove(trashRef)
        );
      }
    });
  }

  const searchedPosts = useMemo(
    () =>
      searchQuery.length > 0
        ? posts.filter((post) =>
            `${post.title} ${post.body}`
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
        : posts,
    [posts, searchQuery]
  );

  const value = useMemo(() => {
    return {
      posts: searchedPosts,
      trash,
      onAddPost: handleAddPost,
      onUpdatePost: handleUpdatePost,
      onMoveToTrash: handleMoveToTrash,
      onPermanentlyDelete: handlePermanentlyDelete,
      onRestorePost: handleRestorePost,
      searchQuery,
      setSearchQuery,
    };
  }, [searchedPosts, trash, searchQuery, posts]);

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

PostProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
}

export { PostProvider, usePosts };
