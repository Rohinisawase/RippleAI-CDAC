//src/api/userApi.js



import api from "./axios";

export const getMyProfile = () => {
  return api.get("/auth/user/profile");
};

export const updateProfile = (data) => {
  return api.put("/auth/user/profile", data);
};

export const updateProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/auth/user/profile/photo", formData);
};
