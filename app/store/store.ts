import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice'; // ajustez le chemin selon votre structure de dossier

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
