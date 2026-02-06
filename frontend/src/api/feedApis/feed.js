// src/api/feed.js
import api from "../axios"; // your axios.create instance

export const fetchFeed = async (page = 0, size = 10) => {
  try {
    const res = await api.get("/feed", { params: { page, size } });
    return res.data.content || res.data || [];
  } catch (err) {
    console.error("fetchFeed error:", err.response || err.message);
    return [];
  }
};


export const fetchEngagement = async (postId) => {
  try {
    const res = await api.get(`/feed/${postId}/engagement`);
    return res.data || { likes: 0, comments: [] };
  } catch (err) {
    console.error("fetchEngagement error:", err.response || err.message);
    return { likes: 0, comments: [] };
  }
};


export const toggleLike = async (postId, userId) => {
  try {
    await api.post(`/feed/${postId}/like`, null, { params: { userId } });
    return true;
  } catch (err) {
    console.error("toggleLike error:", err.response || err.message);
    return false;
  }
};


export const addComment = async (postId, userId, content) => {
  try {
    await api.post(`/feed/${postId}/comments`, { userId, content });
    return true;
  } catch (err) {
    console.error("addComment error:", err.response || err.message);
    return false;
  }
};

export default {
  fetchFeed,
  fetchEngagement,
  toggleLike,
  addComment,
};
