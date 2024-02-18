import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./boardSlice";
import { apiSlice } from "./apiSlice";

const store = configureStore({
  reducer: {
    boarddata: boardReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
