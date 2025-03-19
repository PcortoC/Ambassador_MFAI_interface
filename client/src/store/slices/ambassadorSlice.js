import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  statistics: {
    nombreReferes: 0,
    revenusTotaux: 0,
    missionsRealisees: 0,
  },
  recompenses: [],
  loading: false,
  error: null,
};

const ambassadorSlice = createSlice({
  name: 'ambassador',
  initialState,
  reducers: {
    fetchProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    },
    fetchProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      state.loading = false;
    },
    updateProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchStatisticsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStatisticsSuccess: (state, action) => {
      state.statistics = action.payload;
      state.loading = false;
    },
    fetchStatisticsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchRecompensesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRecompensesSuccess: (state, action) => {
      state.recompenses = action.payload;
      state.loading = false;
    },
    fetchRecompensesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStatistics: (state, action) => {
      state.statistics = { ...state.statistics, ...action.payload };
    },
    addRecompense: (state, action) => {
      state.recompenses.push(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  fetchStatisticsStart,
  fetchStatisticsSuccess,
  fetchStatisticsFailure,
  fetchRecompensesStart,
  fetchRecompensesSuccess,
  fetchRecompensesFailure,
  updateStatistics,
  addRecompense,
  clearError,
} = ambassadorSlice.actions;

export default ambassadorSlice.reducer; 