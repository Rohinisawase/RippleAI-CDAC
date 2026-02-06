import api from "../axios";

// ---------------- GET NGO PROFILE ----------------
export const getNGOProfile = async () => {
  try {
    const res = await api.get("/auth/ngo/profile");
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data || "Failed to fetch profile"
    );
  }
};

// ---------------- UPDATE NGO PROFILE ----------------
export const updateNGOProfile = async (data) => {
  try {
    const res = await api.put("/auth/ngo/profile", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data || "Failed to update profile"
    );
  }
};

// ---------------- UPDATE NGO PROFILE PHOTO ----------------
export const updateNGOProfilePhoto = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/ngo/profile/photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data || "Failed to update profile photo"
    );
  }
};

// ---------------- CHANGE NGO PASSWORD ----------------
export const changeNGOPassword = async (newPassword) => {
  try {
    const res = await api.put("/auth/ngo/profile/password", newPassword, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data || "Failed to update password"
    );
  }
};

// ---------------- DELETE NGO ACCOUNT ----------------
export const deleteNGOAccount = async () => {
  try {
    const res = await api.delete("/auth/ngo/profile");
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data || "Failed to delete account"
    );
  }
};
