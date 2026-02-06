import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios"; // Use your axios instance

// Fetch profile from backend
export const fetchProfile = createAsyncThunk("profile/fetchProfile", async () => {
  const res = await api.get("/auth/profile"); // backend endpoint to return logged in user's profile
  return res.data;
});

// Update profile
export const updateProfile = createAsyncThunk("profile/updateProfile", async (payload) => {
  const formData = new FormData();
  Object.keys(payload).forEach((key) => formData.append(key, payload[key]));
  const res = await api.put("/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
});

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    loading: false,
    error: null,
    saving: false,
  },
  reducers: {
    setProfile: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProfile.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.data = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      });
  },
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
