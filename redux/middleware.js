import { put, takeLatest, call } from "redux-saga/effects";
import axios from "axios";
import {
  gettingFoldersAndFiles,
  setFoldersAndFiles,
  setUploadingProgress,
  uploadingFoldersAndFiles,
} from "./slices/fileSlice";
import store from "./store";

const baseURL = "http://192.168.1.10:5010";
function* getFoldersAndFiles() {
  yield put(gettingFoldersAndFiles());
  try {
    const res = yield call(axios.get, `${baseURL}/files/get-files`);
    yield put(setFoldersAndFiles(res.data));
  } catch (error) {
    console.log(error);
  }
}

function* uploadFoldersAndFiles(action) {
  yield put(uploadingFoldersAndFiles(true));
  try {
    const formData = new FormData();

    // Loop through the array of files (action.data.assets should be an array)
    action.data.assets.forEach((file) => {
      // Append each file to the 'files' field
      formData.append("files", {
        uri: file.uri, // File URI
        name: file.name || `file_${Date.now()}`, // Ensure a valid file name
        type: file.type || "application/octet-stream", // File MIME type
      });
    });

    // Create an instance of Axios to track progress
    const axiosInstance = axios.create();

    // Track upload progress
    axiosInstance.interceptors.request.use((config) => {
      config.onUploadProgress = (event) => {
        const percent = Math.round((event.loaded * 100) / event.total);
        // Dispatch action to update progress in Redux
        store.dispatch(setUploadingProgress(percent)); // Dispatching outside of generator
      };
      return config;
    });

    // Send the POST request
    const res = yield call(
      axiosInstance.post,
      `${baseURL}/files/upload-files`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    yield put(uploadingFoldersAndFiles(false));
    console.log("Upload successful:", res.data);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

function* rootSaga() {
  yield takeLatest("GET_FOLDER_AND_FILES", getFoldersAndFiles);
  yield takeLatest("UPLOAD_FOLDER_AND_FILES", uploadFoldersAndFiles);
}

export default rootSaga;
