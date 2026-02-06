import api from "../axios";

// src/api/songsApi.js

export const fetchSongs = async () => {
  try {
    const res = await api.get("/user/posts/music");
    console.log({'musicFetch' : res.data})
    return res.data;
  } catch (error) {
    console.error("fetchSongs error:", error);
    return [];
  }
};
