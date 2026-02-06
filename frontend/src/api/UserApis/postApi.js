import api from "../axios";


const BASE_PATH = "/user/posts";

export const createPost = async (payload) => {
  try {
    const res = await api.post(BASE_PATH, payload);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data || "Failed to create post"
    );
  }
};
