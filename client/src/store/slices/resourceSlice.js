import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  resources: [],
  loading: false,
  error: null,
  selectedResource: null,
};

const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    fetchResourcesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchResourcesSuccess: (state, action) => {
      state.loading = false;
      state.resources = action.payload;
    },
    fetchResourcesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedResource: (state, action) => {
      state.selectedResource = action.payload;
    },
    clearSelectedResource: (state) => {
      state.selectedResource = null;
    },
  },
});

export const {
  fetchResourcesStart,
  fetchResourcesSuccess,
  fetchResourcesFailure,
  setSelectedResource,
  clearSelectedResource,
} = resourceSlice.actions;

export default resourceSlice.reducer; 