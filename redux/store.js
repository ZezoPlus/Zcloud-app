import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from 'redux-saga'
import rootSaga from "./middleware";
import fileSlice from './slices/fileSlice'

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
    reducer: {
        fileSlice:fileSlice
    },
    middleware:(getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware)
})
sagaMiddleware.run(rootSaga)
export default store