import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isGettingFoldersAndFiles: false,
  foldersAndFiles: [],
  isUploadFoldersAndFiles:false,
  uploadProgress:0,
};

const fileSlice = createSlice({
  name: "fileSlice",
  initialState,
  reducers: {
    gettingFoldersAndFiles: (state) => {
      state.isGettingFoldersAndFiles = true;
    },
    setFoldersAndFiles: (state, action) => {
      state.isGettingFoldersAndFiles = false;
      state.foldersAndFiles = action.payload;
    },
    setUploadingProgress:(state,action)=>{
      state.uploadProgress=action.payload;
    },
    uploadingFoldersAndFiles:(state,action)=>{
      state.isUploadFoldersAndFiles=action.payload;
    },
  },
});

export default fileSlice.reducer;
export const { gettingFoldersAndFiles, setFoldersAndFiles,setUploadingProgress,uploadingFoldersAndFiles } = fileSlice.actions;
