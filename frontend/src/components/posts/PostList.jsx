//sec/components/PostList.jsx


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPosts, deleteUserPost } from "../../app/postSlice";

export default function PostList() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);

  useEffect(() => {
    dispatch(fetchUserPosts(localStorage.getItem("email")));
  }, [dispatch]);

  const handleDelete = (postId) => {
    dispatch(deleteUserPost({ ownerId: localStorage.getItem("email"), postId }));
  };

  return (
    <div>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((p) => (
          <div key={p.postId} className="card p-3 mb-2 shadow">
            <div className="d-flex justify-content-between">
              <div>
                <h6>{p.caption}</h6>
                {p.postLink && (
                  <a href={p.postLink} target="_blank" rel="noopener noreferrer">
                    {p.postLink}
                  </a>
                )}
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(p.postId)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
