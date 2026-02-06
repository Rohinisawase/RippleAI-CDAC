// src/User/api/userProfile.js
import api from "../axios";

// =====================================================
// GET USER PROFILE
// =====================================================
export const getUserProfile = async () => {
  const res = await api.get("/auth/user/profile", { withCredentials: true });
  return res.data;
};

// =====================================================
// UPDATE USER PROFILE (name, phone, address)
// =====================================================
export const updateUserProfile = async (data) => {
  const res = await api.put("auth/user/profile", data);
  return res.data;
};

// =====================================================
// UPDATE USER PROFILE PHOTO
// =====================================================
export const updateUserProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/user/profile/photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// =====================================================
// UPDATE USER PASSWORD
// =====================================================
export const changeUserPassword = async ({ oldPassword, newPassword }) => {
  const res = await api.put("/user/profile/password", {
    oldPassword,
    newPassword,
  });

  return res.data; // backend returns string message
};

// =====================================================
// DELETE USER ACCOUNT
// =====================================================
export const deleteUserAccount = async () => {
  const res = await api.delete("/user/profile");
  return res.data; // backend returns string message
};
