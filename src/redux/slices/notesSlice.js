import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notes: [],
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote: (state, action) => {
      state.notes.push(action.payload);
    },
    editNote: (state, action) => {
      const { id, content } = action.payload;
      const noteIndex = state.notes.findIndex((note) => note.id === id);
      if (noteIndex !== -1) {
        state.notes[noteIndex].content = content;
      }
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    restoreNote: (state, action) => {
      state.notes.push(action.payload);
    },
  },
});

export const { addNote, editNote, deleteNote, restoreNote } =
  notesSlice.actions;
export default notesSlice.reducer;
