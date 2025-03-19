import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ambassadorReducer from './slices/ambassadorSlice';
import missionReducer from './slices/missionSlice';
import resourceReducer from './slices/resourceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ambassador: ambassadorReducer,
    missions: missionReducer,
    resources: resourceReducer,
  },
});

export default store; 