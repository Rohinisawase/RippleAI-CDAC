import React, { useEffect, useState } from "react";
import { getUserPosts, updateUserPost, deleteUserPost } from "../../../api/UserApis/managePostApi";
import { Edit2, Trash2, X, Check, Image as ImageIcon } from "lucide-react"; // Optional: lucide-react icons

const ManagePosts = ({ ownerId }) => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null); // Store the whole object
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const data = await getUserPosts(ownerId);
      setPosts(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [ownerId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUserPost(editingPost.postId, editingPost, ownerId);
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Permanent delete? This cannot be undone.")) return;
    try {
      await deleteUserPost(postId, ownerId);
      setPosts(posts.filter((p) => p.postId !== postId));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Manage Content</h2>
          <p className="text-gray-500">View, edit, or remove your published posts.</p>
        </div>
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {posts.length} Total Posts
        </span>
      </header>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-gray-500">No posts available to manage.</p>
        </div>
      )}

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.postId} className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-100 overflow-hidden relative">
              {post.postLink ? (
                <img src={post.postLink} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="flex items-center justify-center h-full"><ImageIcon className="text-gray-400" /></div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-gray-800 font-medium line-clamp-2 mb-4 h-12">
                {post.caption || <span className="text-gray-400 italic">No caption provided</span>}
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPost(post)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-600 py-2 rounded-lg transition-colors font-semibold text-sm"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(post.postId)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-red-50 hover:text-red-600 text-gray-600 py-2 rounded-lg transition-colors font-semibold text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Professional Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Edit Post</h3>
              <button onClick={() => setEditingPost(null)}><X className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <textarea
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                  value={editingPost.caption}
                  onChange={(e) => setEditingPost({...editingPost, caption: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingPost.postLink}
                  onChange={(e) => setEditingPost({...editingPost, postLink: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="flex-1 py-3 border rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePosts;