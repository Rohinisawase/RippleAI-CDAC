import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, role } = action.payload;

      state.isAuthenticated = true;
      state.token = token;
      state.role = role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.role = null;

      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
