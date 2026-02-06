import api from "../axios";

// BASE PATH (no host, api already has baseURL)
const BASE_PATH = "/user/posts";

// ---------------- GET ALL POSTS FOR A USER ----------------
export const getUserPosts = async (ownerId) => {
  try {
    const res = await api.get(BASE_PATH, {
      params: {
        ownerId,
        ownerType: "USER",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data || "Failed to fetch posts"
    );
  }
};

// ---------------- UPDATE A POST ----------------
export const updateUserPost = async (postId, data, ownerId) => {
  try {
    const res = await api.put(
      `${BASE_PATH}/${postId}`,
      data,
      {
        params: {
          ownerId,
          ownerType: "USER",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data || "Failed to update post"
    );
  }
};

// ---------------- DELETE A POST ----------------
export const deleteUserPost = async (postId, ownerId) => {
  try {
    const res = await api.delete(
      `${BASE_PATH}/${postId}`,
      {
        params: {
          ownerId,
          ownerType: "USER", // must be USER
        },
      }
    );

    return res.data ?? null; // safe for 204
  } catch (error) {
    throw new Error(
      error.response?.data || "Failed to delete post"
    );
  }
};
