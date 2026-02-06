// src/pages/Dashboard.jsx

import { useState } from "react";
import PostForm from "../components/posts/PostForm";
import PostList from "../components/posts/PostList";

export default function Dashboard() {
  const [showPostForm, setShowPostForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPostForm(!showPostForm)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md
                   hover:bg-blue-700 transition"
      >
        {showPostForm ? "Close Post Form" : "Create Post"}
      </button>

      {showPostForm && <PostForm onClose={() => setShowPostForm(false)} />}

      <h4 className="mt-6 text-lg font-semibold">All Posts</h4>
      <PostList />
    </>
  );
}
