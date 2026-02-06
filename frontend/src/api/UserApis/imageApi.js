import axios from "../axios";

export const uploadImage = async (base64Image) => {
  try {
    const res = await axios.post(
      "/user/posts/upload-image",
      base64Image,
      {
        headers: {
          "Content-Type": "text/plain", 
        },
      }
    );

    return res.data.url;
  } catch (error) {
    throw new Error(
      error.response?.data || "Failed to upload image"
    );
  }
};
