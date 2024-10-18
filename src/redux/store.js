import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./slices/notesSlice";
import authReducer from "./slices/authSlice";
import postsReducer from "../app/features/postSlice";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    auth: authReducer,
    posts: postsReducer,
  },
});

export default store;
