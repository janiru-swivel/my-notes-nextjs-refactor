import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./slices/notesSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    auth: authReducer,
  },
});

export default store;
