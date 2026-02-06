import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import CameraCapture from "./CameraCapture";
import PostForm from "./PostForm";
import { createPost } from "../../../api/UserApis/postApi";
import { uploadImage } from "../../../api/UserApis/imageApi"; // import our fetch-based API

const CreatePosts = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false); // optional: show loading state

  const handleCancel = () => {
    setImage(null);
  };

  const handlePostSubmit = async (data) => {
    let postLink = image;

    try {
      // If the image is a Base64 string, upload it first
      if (image && image.startsWith("data:image")) {
        setUploading(true);
        postLink = await uploadImage(image); // call backend API
        setUploading(false);
      }

      const payload = {
        ownerType: "USER",
        ownerId: "user123",
        postType: "NORMAL",
        campaignId: null,
        posts: [
          {
            caption: data.caption,
            postLink,
            musicLink: data.musicLink || null,
            scheduledAt: null,
            tags: data.tags || []
          }
        ]
      };

      console.log({payload});
      await createPost(payload);
      alert("Post created successfully");
      setImage(null); // Reset to camera after success
    } catch (err) {
      console.error("Submission Error:", err.message);
      setUploading(false);
      alert("Failed to create post: " + err.message);
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Always keep camera in background or render conditionally */}
      <CameraCapture onCapture={setImage} />

      {/* AnimatePresence handles the 'dramatic' entrance/exit of the form */}
      <AnimatePresence>
        {image && (
          <PostForm 
            image={image} 
            onSubmit={handlePostSubmit} 
            onCancel={handleCancel} 
            uploading={uploading} // optional: show loading in form
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreatePosts;
