import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./weatherSlice";

const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
});

export default store; // ✅ Ensure this exists

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
