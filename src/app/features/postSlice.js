// src/app/features/postsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ref, push, set, update, remove, onValue } from "firebase/database";
import { auth, database } from "../lib/firebaseConfig";

// Async thunk for fetching posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (searchQuery, { rejectWithValue }) => {
    const user = auth.currentUser;
    if (!user) {
      return rejectWithValue("User not authenticated.");
    }

    const postsRef = ref(database, `users/${user.uid}/notes`);
    return new Promise((resolve, reject) => {
      onValue(
        postsRef,
        (snapshot) => {
          const data = snapshot.val();
          const loadedPosts = data
            ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
            : [];
          const filteredPosts = loadedPosts.filter((post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          resolve(filteredPosts);
        },
        (error) => {
          reject(rejectWithValue(error.message));
        }
      );
    });
  }
);

// Async thunk for fetching trash
export const fetchTrash = createAsyncThunk(
  "posts/fetchTrash",
  async (_, { rejectWithValue }) => {
    const user = auth.currentUser;
    if (!user) {
      return rejectWithValue("User not authenticated.");
    }

    const trashRef = ref(database, `users/${user.uid}/trash`);
    return new Promise((resolve, reject) => {
      onValue(
        trashRef,
        (snapshot) => {
          const data = snapshot.val();
          const loadedTrash = data
            ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
            : [];
          resolve(loadedTrash);
        },
        (error) => {
          reject(rejectWithValue(error.message));
        }
      );
    });
  }
);

// Async thunk for adding a post
export const addPost = createAsyncThunk(
  "posts/addPost",
  async (post, { rejectWithValue }) => {
    const user = auth.currentUser;
    if (!user) {
      return rejectWithValue("User not authenticated.");
    }

    const userPostsRef = ref(database, `users/${user.uid}/notes`);
    const newPostRef = push(userPostsRef);
    await set(newPostRef, post);
    return { id: newPostRef.key, ...post };
  }
);

// Async thunk for updating a post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, updatedPost }, { rejectWithValue }) => {
    const user = auth.currentUser;
    if (!user) {
      return rejectWithValue("User not authenticated.");
    }

    const postRef = ref(database, `users/${user.uid}/notes/${id}`);
    await update(postRef, updatedPost);
    return { id, updatedPost };
  }
);

// Async thunk for moving a post to trash
export const moveToTrash = createAsyncThunk(
  "posts/moveToTrash",
  async (id, { rejectWithValue }) => {
    const user = auth.currentUser;
    if (!user) {
      return rejectWithValue("User not authenticated.");
    }

    const postRef = ref(database, `users/${user.uid}/notes/${id}`);
    const trashRef = ref(database, `users/${user.uid}/trash/${id}`);
    return new Promise((resolve, reject) => {
      onValue(postRef, async (snapshot) => {
        const post = snapshot.val();
        if (post) {
          await set(trashRef, post);
          await remove(postRef);
          resolve({ id, post });
        } else {
          reject(rejectWithValue("Post not found."));
        }
      });
    });
  }
);

// Async thunk for restoring a post from trash
export const restorePost = createAsyncThunk(
  "posts/restorePost",
  async (id, { rejectWithValue }) => {
    const user = auth.currentUser;
    if (!user) {
      return rejectWithValue("User not authenticated.");
    }

    const trashRef = ref(database, `users/${user.uid}/trash/${id}`);
    const postRef = ref(database, `users/${user.uid}/notes/${id}`);
    return new Promise((resolve, reject) => {
      onValue(trashRef, async (snapshot) => {
        const post = snapshot.val();
        if (post) {
          await set(postRef, post);
          await remove(trashRef);
          resolve({ id, post });
        } else {
          reject(rejectWithValue("Post not found in trash."));
        }
      });
    });
  }
);

// Async thunk for permanently deleting a post from trash
export const permanentlyDelete = createAsyncThunk(
  "posts/permanentlyDelete",
  async (id, { rejectWithValue }) => {
    const user = auth.currentUser;
    if (!user) {
      return rejectWithValue("User not authenticated.");
    }

    const trashRef = ref(database, `users/${user.uid}/trash/${id}`);
    await remove(trashRef);
    return id;
  }
);

// Create posts slice
const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    trash: [],
    loading: false,
    error: null,
    sortOption: null,
    searchQuery: "",
  },
  reducers: {
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTrash.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrash.fulfilled, (state, action) => {
        state.loading = false;
        state.trash = action.payload;
      })
      .addCase(fetchTrash.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = {
            ...state.posts[index],
            ...action.payload.updatedPost,
          };
        }
      })
      .addCase(moveToTrash.fulfilled, (state, action) => {
        state.trash.push(action.payload.post);
        state.posts = state.posts.filter(
          (post) => post.id !== action.payload.id
        );
      })
      .addCase(restorePost.fulfilled, (state, action) => {
        state.posts.push(action.payload.post);
        state.trash = state.trash.filter(
          (post) => post.id !== action.payload.id
        );
      })
      .addCase(permanentlyDelete.fulfilled, (state, action) => {
        state.trash = state.trash.filter((post) => post.id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("pending"),
        (state) => {
          state.loading = true;
        }
      );
  },
});

// Export actions and reducer
export const { setSortOption, setSearchQuery } = postsSlice.actions;
export const selectPosts = (state) => state.posts.posts;
export const selectTrash = (state) => state.posts.trash;
export const selectLoading = (state) => state.posts.loading;
export const selectError = (state) => state.posts.error;

export default postsSlice.reducer;
