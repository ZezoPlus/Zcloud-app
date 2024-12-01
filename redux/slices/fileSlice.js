import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isGettingFoldersAndFiles: false,
  foldersAndFiles: [],
  isGettingFoldersAndFilesFailed: false,
  errorMessage: "",
  isUploadFoldersAndFiles: false,
  uploadProgress: 0,
  path: [""],
};

const fileSlice = createSlice({
  name: "fileSlice",
  initialState,
  reducers: {
    gettingFoldersAndFiles: (state) => {
      state.isGettingFoldersAndFiles = true;
      state.isGettingFoldersAndFilesFailed = false;
    },
    gettingFoldersAndFilesSuccess: (state, action) => {
      state.isGettingFoldersAndFiles = false;
      state.isGettingFoldersAndFilesFailed = false;
      state.foldersAndFiles = action.payload;
    },
    gettingFoldersAndFilesFailed: (state, action) => {
      state.isGettingFoldersAndFiles = false;
      state.isGettingFoldersAndFilesFailed = true;
      state.errorMessage = action.payload;
    },
    resetFoldersAndFiles: (state) => {
      state.foldersAndFiles = [];
    },
    setUploadingProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    uploadingFoldersAndFiles: (state, action) => {
      state.isUploadFoldersAndFiles = action.payload;
    },
    addPath: (state, action) => {
      state.path.push(action.payload);
    },
  },
});

export default fileSlice.reducer;
export const {
  gettingFoldersAndFiles,
  gettingFoldersAndFilesSuccess,
  gettingFoldersAndFilesFailed,
  setUploadingProgress,
  uploadingFoldersAndFiles,
  addPath,
} = fileSlice.actions;
