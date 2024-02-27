import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./boardSlice";
import { apiSlice } from "./apiSlice";
import { authSlice } from "./authSlice";

const store = configureStore({
  reducer: {
    boarddata: boardReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authSlice.reducerPath]: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(authSlice.middleware)
      .concat(apiSlice.middleware)
     
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
