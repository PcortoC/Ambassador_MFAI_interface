import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  missions: [],
  availableMissions: [],
  completedMissions: [],
  loading: false,
  error: null,
  selectedMission: null,
};

const missionSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    fetchMissionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMissionsSuccess: (state, action) => {
      state.missions = action.payload;
      state.loading = false;
    },
    fetchMissionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchAvailableMissionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAvailableMissionsSuccess: (state, action) => {
      state.availableMissions = action.payload;
      state.loading = false;
    },
    fetchAvailableMissionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCompletedMissionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCompletedMissionsSuccess: (state, action) => {
      state.completedMissions = action.payload;
      state.loading = false;
    },
    fetchCompletedMissionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectMission: (state, action) => {
      state.selectedMission = action.payload;
    },
    completeMissionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    completeMissionSuccess: (state, action) => {
      const completedMission = action.payload;
      state.completedMissions.push(completedMission);
      state.availableMissions = state.availableMissions.filter(
        mission => mission._id !== completedMission._id
      );
      state.loading = false;
    },
    completeMissionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchMissionsStart,
  fetchMissionsSuccess,
  fetchMissionsFailure,
  fetchAvailableMissionsStart,
  fetchAvailableMissionsSuccess,
  fetchAvailableMissionsFailure,
  fetchCompletedMissionsStart,
  fetchCompletedMissionsSuccess,
  fetchCompletedMissionsFailure,
  selectMission,
  completeMissionStart,
  completeMissionSuccess,
  completeMissionFailure,
  clearError,
} = missionSlice.actions;

export default missionSlice.reducer; 