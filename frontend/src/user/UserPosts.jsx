// src/components/UserPosts.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import postApi from "../api/postApi";

const UserPosts = () => {
  const { accountId } = useSelector((state) => state.user); // logged-in user's accountId
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [caption, setCaption] = useState("");
  const [postLink, setPostLink] = useState("");
  const [musicLink, setMusicLink] = useState("");
  const [tags, setTags] = useState("");
  const [editPostId, setEditPostId] = useState(null);

  // ---------------- Fetch Posts ----------------
  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await postApi.get(
        `/user/posts?ownerId=${accountId}&ownerType=USER`
      );
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || err.response?.data || err.message || "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) fetchPosts();
  }, [accountId]);

  // ---------------- Create / Update ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const postData = {
      caption,
      postLink,
      musicLink,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""),
    };

    try {
      if (editPostId) {
        // Update post
        await postApi.put(
          `/user/posts/${editPostId}?ownerId=${accountId}&ownerType=USER`,
          postData
        );
        alert("Post updated successfully");
      } else {
        // Create post
        await postApi.post("/user/posts", {
          ownerId: accountId,
          ownerType: "USER",
          posts: [postData],
        });
        alert("Post created successfully");
      }

      // Reset form
      setCaption("");
      setPostLink("");
      setMusicLink("");
      setTags("");
      setEditPostId(null);

      fetchPosts();
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || err.response?.data || err.message || "Unknown error";
      setError(msg);
      alert("Failed: " + msg);
    }
  };

  // ---------------- Edit ----------------
  const handleEdit = (post) => {
    setEditPostId(post.postId);
    setCaption(post.caption);
    setPostLink(post.postLink);
    setMusicLink(post.musicLink || "");
    setTags(post.tags.join(","));
  };

  // ---------------- Delete ----------------
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await postApi.delete(
        `/user/posts/${postId}?ownerId=${accountId}&ownerType=USER`
      );
      setPosts(posts.filter((p) => p.postId !== postId));
      alert("Post deleted successfully");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || err.response?.data || err.message || "Unknown error";
      alert("Failed to delete post: " + msg);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Posts</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Post Link"
          value={postLink}
          onChange={(e) => setPostLink(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Music Link (Optional)"
          value={musicLink}
          onChange={(e) => setMusicLink(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit">{editPostId ? "Update Post" : "Create Post"}</button>
        {editPostId && (
          <button
            type="button"
            onClick={() => {
              setEditPostId(null);
              setCaption("");
              setPostLink("");
              setMusicLink("");
              setTags("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Caption</th>
              <th>Post Link</th>
              <th>Music Link</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.postId}>
                <td>{post.caption}</td>
                <td>
                  <a href={post.postLink} target="_blank" rel="noreferrer">
                    {post.postLink}
                  </a>
                </td>
                <td>{post.musicLink || "-"}</td>
                <td>{post.tags.join(", ")}</td>
                <td>
                  <button onClick={() => handleEdit(post)}>Edit</button>
                  <button onClick={() => handleDelete(post.postId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UserPosts;
