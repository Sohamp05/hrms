import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUserEmp: null,
  error: null,
  loading: false,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    signInStartEmp: (state) => {
      state.loading = true;
    },
    signInSuccessEmp: (state, action) => {
      state.currentUserEmp = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailureEmp: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStartEmp: (state) => {
      state.loading = true;
    },
    deleteUserSuccessEmp: (state) => {
      state.currentUserEmp = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailureEmp: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutStartEmp: (state) => {
      state.loading = true;
    },
    signOutSuccessEmp: (state) => {
      state.currentUserEmp = null;
      state.loading = false;
      state.error = null;
    },
    signOutFailureEmp: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetAuthStateEmp: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  signInStartEmp,
  signInFailureEmp,
  signInSuccessEmp,
  signOutFailureEmp,
  signOutStartEmp,
  signOutSuccessEmp,
  deleteUserFailureEmp,
  deleteUserStartEmp,
  deleteUserSuccessEmp,
  resetAuthStateEmp,
} = employeeSlice.actions;

export default employeeSlice.reducer;
